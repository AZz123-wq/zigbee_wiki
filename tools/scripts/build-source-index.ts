#!/usr/bin/env node
/**
 * build-source-index.ts
 * Scans raw/ sources and builds stable file ids, PDF quality metadata,
 * page/chunk search indexes, and outline hints for retrieval.
 */
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';

const ROOT_DIR = path.resolve(__dirname, '..', '..');
const RAW_DIR = path.join(ROOT_DIR, 'knowledge', 'raw');
const DATA_DIR = path.join(ROOT_DIR, 'runtime', 'data');
const INBOX_DIR = path.join(RAW_DIR, 'inbox');
const SOURCE_INDEX_FILE = path.join(DATA_DIR, 'source-index.json');
const QUALITY_REPORT_FILE = path.join(DATA_DIR, 'source-quality-report.json');
const PAGE_INDEX_FILE = path.join(DATA_DIR, 'source-page-index.json');
const CHUNK_INDEX_FILE = path.join(DATA_DIR, 'source-chunk-index.json');
const OUTLINE_INDEX_FILE = path.join(DATA_DIR, 'source-outline-index.json');

const MAX_PAGE_TEXT_CHARS = 20000;
const MAX_PAGE_SNIPPET_CHARS = 1200;
const MAX_CHUNK_SNIPPET_CHARS = 1600;
const MAX_SECTION_SNIPPET_CHARS = 1400;

fs.mkdirSync(INBOX_DIR, { recursive: true });

type SourceType = 'pdf' | 'markdown' | 'text' | 'html' | 'docx' | 'pptx' | 'image' | 'other';
type MetadataStatus = 'clean' | 'needs_review' | 'failed';

interface RawFileEntry {
  id: string;
  stable_id: string;
  filename: string;
  original_name: string;
  path: string;
  type: SourceType;
  mime: string;
  sha256: string;
  size: number;
  size_human: string;
  mtime: string;
  uploaded_at: string;
  indexed_at: string;
  status: 'new' | 'indexed' | 'linked' | 'archived' | 'ignored';
  metadata: Record<string, unknown>;
  linked_wiki_pages: string[];
  related_conversations: string[];
  summary: string;
  risk_level: 'low' | 'medium' | 'high';
}

interface PdfInfoEntry {
  id: string;
  stable_id: string;
  raw_file_id: string;
  path: string;
  filename: string;
  sha256: string;
  size: number;
  size_human: string;
  pages: number;
  page_count_source: string;
  page_count_candidates: {
    pdfinfo?: number;
    structural?: number;
    pdf_extract?: number;
    extraction?: number;
  };
  metadata_status: MetadataStatus;
  metadata_warnings: string[];
  title?: string;
  author?: string;
  created_at?: string;
  modified_at?: string;
  encrypted: boolean;
  page_size?: string;
  linked_wiki_pages: string[];
  referenced_by_conversations: string[];
  indexed_at: string;
  extractable: boolean;
  confidence: number;
  diagnosis: string;
  text_quality: {
    sampled_pages: number;
    sample_chars: number;
    empty_sample_pages: number;
    garbled_ratio: number;
    extraction_errors: number;
    quality_score: number;
  };
}

interface PageIndexEntry {
  id: string;
  source_id: string;
  source_path: string;
  source_hash: string;
  type: SourceType;
  page: number;
  title?: string;
  text: string;
  snippet: string;
  normalized_text: string;
  terms: string[];
  char_count: number;
  normalized_char_count: number;
  empty: boolean;
  extraction_error?: string;
  hash: string;
  indexed_at: string;
}

interface ChunkIndexEntry {
  id: string;
  source_id: string;
  source_path: string;
  source_hash: string;
  type: 'page' | 'window' | 'section' | 'document';
  pages: number[];
  title?: string;
  text: string;
  snippet: string;
  normalized_text: string;
  terms: string[];
  char_count: number;
  hash: string;
  indexed_at: string;
}

interface OutlineEntry {
  source_id: string;
  source_path: string;
  source_hash: string;
  title?: string;
  type: SourceType;
  pages?: number;
  outline: { title: string; page?: number; level: number; snippet?: string }[];
  keyword_hits: Record<string, number[]>;
  indexed_at: string;
}

interface QualityReportItem {
  source_id: string;
  source_path: string;
  source_hash: string;
  type: SourceType;
  metadata_status: MetadataStatus;
  warnings: string[];
  page_count_candidates?: PdfInfoEntry['page_count_candidates'];
  selected_pages?: number;
  text_quality?: PdfInfoEntry['text_quality'];
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function sha256File(filePath: string): string {
  const hash = crypto.createHash('sha256');
  const fd = fs.openSync(filePath, 'r');
  const buffer = Buffer.allocUnsafe(1024 * 1024);
  try {
    while (true) {
      const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, null);
      if (bytesRead === 0) break;
      hash.update(buffer.subarray(0, bytesRead));
    }
  } finally {
    fs.closeSync(fd);
  }
  return hash.digest('hex');
}

function stableId(prefix: string, relPath: string): string {
  return `${prefix}-${crypto.createHash('sha256').update(relPath).digest('hex').slice(0, 24)}`;
}

function contentId(prefix: string, sourceId: string, key: string): string {
  return `${prefix}-${crypto.createHash('sha256').update(`${sourceId}:${key}`).digest('hex').slice(0, 24)}`;
}

function getMimeType(ext: string): string {
  const map: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.md': 'text/markdown',
    '.txt': 'text/plain',
    '.html': 'text/html',
    '.htm': 'text/html',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
  };
  return map[ext.toLowerCase()] || 'application/octet-stream';
}

function getFileType(ext: string): SourceType {
  const map: Record<string, SourceType> = {
    '.pdf': 'pdf',
    '.md': 'markdown',
    '.txt': 'text',
    '.html': 'html',
    '.htm': 'html',
    '.docx': 'docx',
    '.pptx': 'pptx',
    '.png': 'image',
    '.jpg': 'image',
    '.jpeg': 'image',
    '.gif': 'image',
    '.svg': 'image',
  };
  return map[ext.toLowerCase()] || 'other';
}

function walkRawDir(dir: string): string[] {
  const files: string[] = [];
  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'inbox' || entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkRawDir(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files.sort();
}

function commandExists(command: string): boolean {
  try {
    execFileSync('bash', ['-lc', `command -v ${command}`], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function run(command: string, args: string[], timeout = 20000): string {
  return execFileSync(command, args, {
    encoding: 'utf-8',
    timeout,
    maxBuffer: 100 * 1024 * 1024,
  });
}

function parsePdfInfo(output: string): Record<string, string> {
  const info: Record<string, string> = {};
  for (const line of output.split('\n')) {
    const m = line.match(/^(.+?):\s*(.*)$/);
    if (m) info[m[1].trim().toLowerCase()] = m[2].trim();
  }
  return info;
}

function structuralPageCount(filePath: string): number {
  try {
    const data = fs.readFileSync(filePath);
    const matches = data.toString('latin1').match(/\/Type\s*\/Page(?!s)\b/g);
    return matches?.length || 0;
  } catch {
    return 0;
  }
}

function pdfExtractCheck(filePath: string): Record<string, any> | null {
  try {
    return JSON.parse(run('python3', ['/root/pdf_extract.py', 'check', filePath], 30000));
  } catch {
    return null;
  }
}

function readPdfPage(filePath: string, page: number): { text: string; error?: string } {
  if (commandExists('pdftotext')) {
    try {
      const text = run('pdftotext', ['-f', String(page), '-l', String(page), '-layout', filePath, '-'], 30000);
      return { text: text.slice(0, MAX_PAGE_TEXT_CHARS) };
    } catch (err: any) {
      return { text: '', error: `pdftotext failed: ${String(err.message || err).slice(0, 160)}` };
    }
  }

  try {
    const text = run('python3', ['/root/pdf_extract.py', filePath, String(page), String(page)], 300000);
    return { text: text.slice(0, MAX_PAGE_TEXT_CHARS) };
  } catch (err: any) {
    return { text: '', error: `pdf_extract.py failed: ${String(err.message || err).slice(0, 160)}` };
  }
}

function readPdfAllPages(filePath: string, pageCount: number): { text: string; error?: string }[] {
  try {
    const raw = run('python3', ['/root/pdf_extract.py', 'json', filePath], 300000);
    const pages = JSON.parse(raw);
    if (Array.isArray(pages)) {
      return Array.from({ length: pageCount }, (_, index) => ({
        text: String(pages[index] || '').slice(0, MAX_PAGE_TEXT_CHARS),
      }));
    }
  } catch {}

  return Array.from({ length: pageCount }, (_, index) => readPdfPage(filePath, index + 1));
}

function normalizeText(text: string): string {
  return text
    .replace(/\r/g, '\n')
    .replace(/-\n(?=[a-zA-Z])/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\bSED\b/gi, 'sleepy end device')
    .replace(/\bRxOnWhenIdle\b/gi, 'rx on when idle')
    .replace(/\bData\s+Poll\b/gi, 'data poll')
    .replace(/\bMAC\s+Data\s+Poll\b/gi, 'mac data poll')
    .replace(/\bEnd\s+Device\b/gi, 'end device')
    .replace(/\bBroadcast\b/gi, 'broadcast')
    .replace(/[ \t]{2,}/g, ' ')
    .toLowerCase()
    .trim();
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'are', 'was', 'were', 'shall',
  'will', 'can', 'may', 'not', 'page', 'zigbee', 'chapter', 'section', 'device',
  'network', 'application', 'profile', 'specification', 'revision', 'document',
]);

function extractTerms(text: string, limit = 32): string[] {
  const normalized = normalizeText(text);
  const counts = new Map<string, number>();
  const phrasePatterns = [
    /sleepy end device/g,
    /end device/g,
    /data poll/g,
    /mac data poll/g,
    /rx on when idle/g,
    /poll control/g,
    /indirect transmission/g,
    /broadcast transaction/g,
    /broadcast delivery/g,
    /child keepalive/g,
    /parent/g,
    /child/g,
  ];

  for (const pattern of phrasePatterns) {
    const matches = normalized.match(pattern);
    if (matches) counts.set(pattern.source.replace(/\\/g, ''), matches.length + 10);
  }

  for (const token of normalized.match(/[a-z0-9][a-z0-9-]{2,}/g) || []) {
    if (STOP_WORDS.has(token)) continue;
    counts.set(token, (counts.get(token) || 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([term]) => term);
}

function snippet(text: string, maxChars: number): string {
  return text.replace(/\s+/g, ' ').trim().slice(0, maxChars);
}

function hashText(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function garbledRatio(text: string): number {
  if (!text) return 0;
  const odd = (text.match(/[�\u0000-\u0008\u000B\u000C\u000E-\u001F]/g) || []).length;
  return Math.round((odd / Math.max(text.length, 1)) * 1000) / 1000;
}

function buildPdfInfo(filePath: string, raw: RawFileEntry): PdfInfoEntry {
  const warnings: string[] = [];
  const candidates: PdfInfoEntry['page_count_candidates'] = {};
  const indexedAt = new Date().toISOString();
  let info: Record<string, string> = {};

  if (commandExists('pdfinfo')) {
    try {
      info = parsePdfInfo(run('pdfinfo', [filePath], 20000));
      const pages = Number.parseInt(info.pages || '0', 10);
      if (Number.isFinite(pages) && pages > 0) candidates.pdfinfo = pages;
    } catch (err: any) {
      warnings.push(`pdfinfo failed: ${String(err.message || err).slice(0, 160)}`);
    }
  } else {
    warnings.push('pdfinfo not available');
  }

  const structural = structuralPageCount(filePath);
  if (structural > 0) candidates.structural = structural;

  const fallback = pdfExtractCheck(filePath);
  if (fallback?.pages) candidates.pdf_extract = Number(fallback.pages);

  const selectedPages = candidates.pdfinfo || candidates.structural || candidates.pdf_extract || 0;
  let pageCountSource = candidates.pdfinfo ? 'pdfinfo' : candidates.structural ? 'structural' : candidates.pdf_extract ? 'pdf_extract.py' : 'none';

  if (!selectedPages) warnings.push('no page count available');
  if (candidates.pdfinfo && candidates.structural && Math.abs(candidates.pdfinfo - candidates.structural) > 1) {
    warnings.push(`page count mismatch: pdfinfo=${candidates.pdfinfo}, structural=${candidates.structural}`);
  }
  if (candidates.pdfinfo && candidates.pdf_extract && Math.abs(candidates.pdfinfo - candidates.pdf_extract) > 1) {
    warnings.push(`fallback extractor mismatch: pdfinfo=${candidates.pdfinfo}, pdf_extract=${candidates.pdf_extract}`);
  }

  const samplePages = Math.min(selectedPages || 0, 5);
  let sampleChars = 0;
  let emptySamplePages = 0;
  let extractionErrors = 0;
  let garbled = 0;

  for (let page = 1; page <= samplePages; page++) {
    const { text, error } = readPdfPage(filePath, page);
    if (error) extractionErrors++;
    const norm = normalizeText(text);
    sampleChars += norm.length;
    if (norm.length < 30) emptySamplePages++;
    garbled += garbledRatio(text);
  }

  const avgGarbled = samplePages > 0 ? Math.round((garbled / samplePages) * 1000) / 1000 : 0;
  const extractable = sampleChars >= 50 && extractionErrors < samplePages;
  const emptyRatio = samplePages > 0 ? emptySamplePages / samplePages : 1;
  let qualityScore = 1;
  qualityScore -= emptyRatio * 0.45;
  qualityScore -= Math.min(avgGarbled * 2, 0.25);
  qualityScore -= samplePages > 0 ? (extractionErrors / samplePages) * 0.3 : 0.3;
  qualityScore = Math.max(0, Math.min(1, Math.round(qualityScore * 100) / 100));

  if (!extractable) warnings.push('low or failed text extraction in sampled pages');
  if (avgGarbled > 0.02) warnings.push(`sample text has garbled ratio ${avgGarbled}`);

  const mismatch = warnings.some((w) => /mismatch|not available|failed|no page count|low or failed/.test(w));
  const metadataStatus: MetadataStatus = selectedPages ? (mismatch ? 'needs_review' : 'clean') : 'failed';
  const confidence = metadataStatus === 'clean'
    ? qualityScore
    : Math.min(qualityScore, candidates.pdfinfo ? 0.75 : 0.45);
  const diagnosis = warnings.length > 0
    ? warnings.join('; ')
    : extractable ? 'clean extractable text' : 'not extractable';

  if (!candidates.pdfinfo && selectedPages) pageCountSource = `${pageCountSource} fallback`;

  return {
    id: stableId('pdf', raw.path),
    stable_id: stableId('pdf', raw.path),
    raw_file_id: raw.id,
    path: raw.path,
    filename: raw.filename,
    sha256: raw.sha256,
    size: raw.size,
    size_human: raw.size_human,
    pages: selectedPages,
    page_count_source: pageCountSource,
    page_count_candidates: candidates,
    metadata_status: metadataStatus,
    metadata_warnings: warnings,
    title: info.title,
    author: info.author,
    created_at: info.creationdate,
    modified_at: info.moddate,
    encrypted: (info.encrypted || '').toLowerCase() === 'yes',
    page_size: info['page size'],
    linked_wiki_pages: [],
    referenced_by_conversations: [],
    indexed_at: indexedAt,
    extractable,
    confidence,
    diagnosis,
    text_quality: {
      sampled_pages: samplePages,
      sample_chars: sampleChars,
      empty_sample_pages: emptySamplePages,
      garbled_ratio: avgGarbled,
      extraction_errors: extractionErrors,
      quality_score: qualityScore,
    },
  };
}

function buildPdfPageEntries(pdf: PdfInfoEntry): PageIndexEntry[] {
  const filePath = path.join(RAW_DIR, pdf.path);
  const entries: PageIndexEntry[] = [];
  if (!pdf.pages || !pdf.extractable) return entries;
  const pageTexts = readPdfAllPages(filePath, pdf.pages);

  for (let page = 1; page <= pdf.pages; page++) {
    const { text, error } = pageTexts[page - 1] || { text: '', error: 'page text missing' };
    const normalized = normalizeText(text);
    const textHash = hashText(`${pdf.sha256}:${page}:${normalized}`);
    entries.push({
      id: contentId('page', pdf.id, String(page)),
      source_id: pdf.id,
      source_path: pdf.path,
      source_hash: pdf.sha256,
      type: 'pdf',
      page,
      title: pdf.title || pdf.filename,
      text: text.slice(0, MAX_PAGE_TEXT_CHARS),
      snippet: snippet(text, MAX_PAGE_SNIPPET_CHARS),
      normalized_text: normalized,
      terms: extractTerms(normalized),
      char_count: text.length,
      normalized_char_count: normalized.length,
      empty: normalized.length < 30,
      extraction_error: error,
      hash: textHash,
      indexed_at: pdf.indexed_at,
    });
  }

  return entries;
}

function buildTextPageEntry(raw: RawFileEntry): PageIndexEntry | null {
  if (!['markdown', 'text', 'html'].includes(raw.type)) return null;
  const filePath = path.join(RAW_DIR, raw.path);
  try {
    const text = fs.readFileSync(filePath, 'utf-8');
    const normalized = normalizeText(text);
    return {
      id: contentId('page', raw.id, '1'),
      source_id: raw.id,
      source_path: raw.path,
      source_hash: raw.sha256,
      type: raw.type,
      page: 1,
      title: raw.filename,
      text: text.slice(0, MAX_PAGE_TEXT_CHARS),
      snippet: snippet(text, MAX_PAGE_SNIPPET_CHARS),
      normalized_text: normalized,
      terms: extractTerms(normalized),
      char_count: text.length,
      normalized_char_count: normalized.length,
      empty: normalized.length < 30,
      hash: hashText(`${raw.sha256}:1:${normalized}`),
      indexed_at: raw.indexed_at,
    };
  } catch {
    return null;
  }
}

function buildChunks(pageEntries: PageIndexEntry[]): ChunkIndexEntry[] {
  const chunks: ChunkIndexEntry[] = [];
  const bySource = new Map<string, PageIndexEntry[]>();
  for (const entry of pageEntries) {
    if (!bySource.has(entry.source_id)) bySource.set(entry.source_id, []);
    bySource.get(entry.source_id)!.push(entry);
  }

  for (const [sourceId, pages] of bySource) {
    const sorted = pages.filter((p) => !p.empty).sort((a, b) => a.page - b.page);
    for (const page of sorted) {
      chunks.push({
        id: contentId('chunk', sourceId, `page-${page.page}`),
        source_id: sourceId,
        source_path: page.source_path,
        source_hash: page.source_hash,
        type: 'page',
        pages: [page.page],
        title: page.title,
        text: page.text.slice(0, MAX_CHUNK_SNIPPET_CHARS),
        snippet: page.snippet.slice(0, MAX_CHUNK_SNIPPET_CHARS),
        normalized_text: page.normalized_text,
        terms: page.terms,
        char_count: page.char_count,
        hash: hashText(`${page.hash}:page-chunk`),
        indexed_at: page.indexed_at,
      });
    }

    for (let i = 0; i < sorted.length; i += 3) {
      const group = sorted.slice(i, i + 3);
      if (group.length < 2) continue;
      const text = group.map((p) => `[p.${p.page}]\n${p.text}`).join('\n\n');
      const normalized = normalizeText(text);
      chunks.push({
        id: contentId('chunk', sourceId, `window-${group[0].page}-${group[group.length - 1].page}`),
        source_id: sourceId,
        source_path: group[0].source_path,
        source_hash: group[0].source_hash,
        type: 'window',
        pages: group.map((p) => p.page),
        title: group[0].title,
        text: text.slice(0, MAX_CHUNK_SNIPPET_CHARS),
        snippet: snippet(text, MAX_CHUNK_SNIPPET_CHARS),
        normalized_text: normalized,
        terms: extractTerms(normalized),
        char_count: text.length,
        hash: hashText(`${sourceId}:${group.map((p) => p.hash).join(':')}`),
        indexed_at: group[0].indexed_at,
      });
    }
  }

  return chunks;
}

function detectOutline(pageEntries: PageIndexEntry[]): OutlineEntry[] {
  const bySource = new Map<string, PageIndexEntry[]>();
  for (const page of pageEntries) {
    if (!bySource.has(page.source_id)) bySource.set(page.source_id, []);
    bySource.get(page.source_id)!.push(page);
  }

  const keywords = [
    'sleepy end device',
    'rx on when idle',
    'data poll',
    'mac data poll',
    'poll control',
    'broadcast',
    'broadcast transaction',
    'indirect transmission',
    'child keepalive',
    'parent',
    'device_annce',
  ];

  const outlines: OutlineEntry[] = [];
  for (const [, pages] of bySource) {
    const sorted = pages.sort((a, b) => a.page - b.page);
    const outline: OutlineEntry['outline'] = [];
    const keywordHits: Record<string, number[]> = {};

    for (const page of sorted) {
      for (const line of page.text.split('\n')) {
        const trimmed = line.trim();
        if (trimmed.length < 6 || trimmed.length > 140) continue;
        const heading =
          trimmed.match(/^(chapter\s+\d+[\s:.-]+.+)$/i) ||
          trimmed.match(/^(\d+(?:\.\d+){0,4}\s+[A-Z][A-Za-z0-9 ,()/-]{5,})$/) ||
          trimmed.match(/^([A-Z][A-Za-z0-9 ,()/-]{12,})$/);
        if (heading && outline.length < 300) {
          outline.push({
            title: heading[1].replace(/\s+/g, ' '),
            page: page.page,
            level: heading[1].match(/^\d+\.\d+\.\d+/) ? 3 : heading[1].match(/^\d+\.\d+/) ? 2 : 1,
            snippet: page.snippet.slice(0, MAX_SECTION_SNIPPET_CHARS),
          });
        }
      }

      for (const kw of keywords) {
        if (page.normalized_text.includes(kw)) {
          if (!keywordHits[kw]) keywordHits[kw] = [];
          keywordHits[kw].push(page.page);
        }
      }
    }

    for (const kw of Object.keys(keywordHits)) {
      keywordHits[kw] = [...new Set(keywordHits[kw])].slice(0, 80);
    }

    const first = sorted[0];
    outlines.push({
      source_id: first.source_id,
      source_path: first.source_path,
      source_hash: first.source_hash,
      title: first.title,
      type: first.type,
      pages: sorted.length,
      outline,
      keyword_hits: keywordHits,
      indexed_at: first.indexed_at,
    });
  }

  return outlines;
}

function loadWikiLinks(rawFiles: RawFileEntry[], pdfFiles: PdfInfoEntry[]) {
  const wikiIndexPath = path.join(DATA_DIR, 'wiki-index.json');
  if (!fs.existsSync(wikiIndexPath)) return;

  const wikiIndex = JSON.parse(fs.readFileSync(wikiIndexPath, 'utf-8'));
  for (const page of wikiIndex.pages || []) {
    for (const src of page.source_refs || []) {
      const cleanSrc = String(src).replace(/^raw\//, '');
      const rawFile = rawFiles.find((f) => f.path === cleanSrc);
      if (rawFile) {
        rawFile.linked_wiki_pages.push(page.path);
        rawFile.status = 'linked';
      }
      const pdfFile = pdfFiles.find((f) => f.path === cleanSrc);
      if (pdfFile && !pdfFile.linked_wiki_pages.includes(page.path)) {
        pdfFile.linked_wiki_pages.push(page.path);
      }
    }
  }
}

function buildQualityReport(rawFiles: RawFileEntry[], pdfFiles: PdfInfoEntry[]): QualityReportItem[] {
  const items: QualityReportItem[] = [];
  for (const pdf of pdfFiles) {
    if (pdf.metadata_status !== 'clean' || pdf.confidence < 0.8) {
      items.push({
        source_id: pdf.id,
        source_path: pdf.path,
        source_hash: pdf.sha256,
        type: 'pdf',
        metadata_status: pdf.metadata_status,
        warnings: pdf.metadata_warnings,
        page_count_candidates: pdf.page_count_candidates,
        selected_pages: pdf.pages,
        text_quality: pdf.text_quality,
      });
    }
  }

  for (const raw of rawFiles) {
    if (['docx', 'pptx'].includes(raw.type)) {
      items.push({
        source_id: raw.id,
        source_path: raw.path,
        source_hash: raw.sha256,
        type: raw.type,
        metadata_status: 'needs_review',
        warnings: [`${raw.type.toUpperCase()} extraction is not implemented in this pass`],
      });
    }
  }
  return items;
}

function assertUniqueIds(rawFiles: RawFileEntry[], pdfFiles: PdfInfoEntry[]) {
  const ids = [...rawFiles, ...pdfFiles].map((f) => f.id);
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }
  if (duplicates.size > 0) {
    throw new Error(`Source id collision detected: ${[...duplicates].join(', ')}`);
  }
}

function main() {
  console.log('🔍 Scanning raw files...');
  const allFiles = walkRawDir(RAW_DIR);
  console.log(`   Found ${allFiles.length} files`);

  const rawFiles: RawFileEntry[] = [];
  const pdfFiles: PdfInfoEntry[] = [];
  const pageEntries: PageIndexEntry[] = [];

  for (const filePath of allFiles) {
    const stat = fs.statSync(filePath);
    const ext = path.extname(filePath);
    const relPath = path.relative(RAW_DIR, filePath).replace(/\\/g, '/');
    const sha256 = sha256File(filePath);
    const rawId = stableId('raw', relPath);
    const entry: RawFileEntry = {
      id: rawId,
      stable_id: rawId,
      filename: path.basename(filePath),
      original_name: path.basename(filePath),
      path: relPath,
      type: getFileType(ext),
      mime: getMimeType(ext),
      sha256,
      size: stat.size,
      size_human: formatSize(stat.size),
      mtime: stat.mtime.toISOString(),
      uploaded_at: stat.birthtime.toISOString(),
      indexed_at: new Date().toISOString(),
      status: 'indexed',
      metadata: {},
      linked_wiki_pages: [],
      related_conversations: [],
      summary: '',
      risk_level: 'low',
    };

    rawFiles.push(entry);

    if (entry.type === 'pdf') {
      console.log(`   PDF: ${relPath}`);
      const pdfInfo = buildPdfInfo(filePath, entry);
      pdfFiles.push(pdfInfo);
      entry.metadata = {
        pages: pdfInfo.pages,
        page_count_source: pdfInfo.page_count_source,
        page_count_candidates: pdfInfo.page_count_candidates,
        metadata_status: pdfInfo.metadata_status,
        extractable: pdfInfo.extractable,
        confidence: pdfInfo.confidence,
        diagnosis: pdfInfo.diagnosis,
        sha256,
      };

      if (pdfInfo.pages > 100 || stat.size > 10 * 1024 * 1024 || pdfInfo.metadata_status !== 'clean') {
        entry.risk_level = 'high';
      } else if (pdfInfo.pages > 30 || stat.size > 5 * 1024 * 1024 || !pdfInfo.extractable) {
        entry.risk_level = 'medium';
      }

      pageEntries.push(...buildPdfPageEntries(pdfInfo));
    } else {
      entry.metadata = { sha256 };
      const pageEntry = buildTextPageEntry(entry);
      if (pageEntry) pageEntries.push(pageEntry);
    }
  }

  loadWikiLinks(rawFiles, pdfFiles);
  assertUniqueIds(rawFiles, pdfFiles);

  const chunks = buildChunks(pageEntries);
  const outlines = detectOutline(pageEntries);
  const qualityReport = buildQualityReport(rawFiles, pdfFiles);
  const linkedSources = rawFiles.filter((f) => f.status === 'linked').map((f) => f.path);
  const unlinkedSources = rawFiles.filter((f) => f.status !== 'linked').map((f) => f.path);
  const indexedAt = new Date().toISOString();

  const output = {
    schema_version: 2,
    raw_files: rawFiles,
    pdf_files: pdfFiles,
    markdown_files: rawFiles.filter((f) => f.type === 'markdown').map((f) => ({ path: f.path, size: f.size })),
    linked_sources: linkedSources,
    unlinked_sources: unlinkedSources,
    generated_indexes: {
      source_quality_report: 'runtime/data/source-quality-report.json',
      source_page_index: 'runtime/data/source-page-index.json',
      source_chunk_index: 'runtime/data/source-chunk-index.json',
      source_outline_index: 'runtime/data/source-outline-index.json',
    },
    tools: {
      pdfinfo: commandExists('pdfinfo'),
      pdftotext: commandExists('pdftotext'),
      fallback_pdf_extract: fs.existsSync('/root/pdf_extract.py'),
    },
    last_indexed_at: indexedAt,
  };

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(SOURCE_INDEX_FILE, JSON.stringify(output, null, 2));
  fs.writeFileSync(PAGE_INDEX_FILE, JSON.stringify({ schema_version: 1, pages: pageEntries, indexed_at: indexedAt }, null, 2));
  fs.writeFileSync(CHUNK_INDEX_FILE, JSON.stringify({ schema_version: 1, chunks, indexed_at: indexedAt }, null, 2));
  fs.writeFileSync(OUTLINE_INDEX_FILE, JSON.stringify({ schema_version: 1, sources: outlines, indexed_at: indexedAt }, null, 2));
  fs.writeFileSync(QUALITY_REPORT_FILE, JSON.stringify({
    schema_version: 1,
    generated_at: indexedAt,
    summary: {
      raw_file_count: rawFiles.length,
      pdf_count: pdfFiles.length,
      review_item_count: qualityReport.length,
      pdfs_needing_review: pdfFiles.filter((p) => p.metadata_status !== 'clean').length,
      non_extractable_pdfs: pdfFiles.filter((p) => !p.extractable).length,
    },
    items: qualityReport,
  }, null, 2));

  const unprocessed = pdfFiles.filter((p) => p.linked_wiki_pages.length === 0).length;
  console.log('✅ Source indexes built');
  console.log(`   - ${rawFiles.length} raw files`);
  console.log(`   - ${pdfFiles.length} PDFs (${pdfFiles.filter((p) => !p.extractable).length} non-extractable)`);
  console.log(`   - ${pageEntries.length} page entries`);
  console.log(`   - ${chunks.length} chunks`);
  console.log(`   - ${qualityReport.length} quality review items`);
  console.log(`   - ${linkedSources.length} linked to wiki`);
  console.log(`   - ${unprocessed} PDFs not yet linked`);
}

main();
