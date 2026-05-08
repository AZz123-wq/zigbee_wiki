#!/usr/bin/env node
/**
 * build-source-index.ts
 * Scans raw/ directory, identifies PDFs/txt/md/html,
 * runs pdfinfo on PDFs (metadata only), builds data/source-index.json
 */
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const RAW_DIR = path.resolve(__dirname, '..', 'raw');
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const OUTPUT_FILE = path.join(DATA_DIR, 'source-index.json');
const INBOX_DIR = path.resolve(__dirname, '..', 'raw', 'inbox');

// Ensure inbox exists
fs.mkdirSync(INBOX_DIR, { recursive: true });

interface RawFileEntry {
  id: string;
  filename: string;
  original_name: string;
  path: string;
  type: 'pdf' | 'markdown' | 'text' | 'html' | 'docx' | 'pptx' | 'image' | 'other';
  mime: string;
  size: number;
  size_human: string;
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
  raw_file_id: string;
  path: string;
  filename: string;
  size_human: string;
  pages: number;
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
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
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

function getFileType(ext: string): RawFileEntry['type'] {
  const map: Record<string, RawFileEntry['type']> = {
    '.pdf': 'pdf',
    '.md': 'markdown',
    '.txt': 'text',
    '.html': 'text',
    '.htm': 'text',
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

function getPdfInfo(filePath: string): PdfInfoEntry | null {
  try {
    const result = execSync(`pdfinfo "${filePath}"`, { encoding: 'utf-8', timeout: 10000 });
    const info: Record<string, string> = {};
    for (const line of result.split('\n')) {
      const m = line.match(/^(.+?):\s+(.+)$/);
      if (m) info[m[1].trim().toLowerCase()] = m[2].trim();
    }

    // Try pdftotext on first page to check extractability
    let extractable = true;
    let confidence = 1.0;
    let diagnosis = 'extractable';
    try {
      const text = execSync(`pdftotext -f 1 -l 1 "${filePath}" -`, {
        encoding: 'utf-8',
        timeout: 15000,
      });
      const charCount = text.replace(/\s/g, '').length;
      if (charCount < 50) {
        extractable = false;
        confidence = 0.1;
        diagnosis = 'scanned or image-based PDF';
      }
    } catch {
      extractable = false;
      confidence = 0.0;
      diagnosis = 'pdftotext extraction failed';
    }

    return {
      id: `pdf-${Buffer.from(filePath).toString('base64').slice(0, 12)}`,
      raw_file_id: '',
      path: path.relative(RAW_DIR, filePath),
      filename: path.basename(filePath),
      size_human: formatSize(fs.statSync(filePath).size),
      pages: parseInt(info.pages || '0', 10),
      title: info.title,
      author: info.author,
      created_at: info.creationdate,
      modified_at: info.moddate,
      encrypted: (info.encrypted || '').toLowerCase() === 'yes',
      page_size: info['page size'],
      linked_wiki_pages: [],
      referenced_by_conversations: [],
      indexed_at: new Date().toISOString(),
      extractable,
      confidence,
      diagnosis,
    };
  } catch (err) {
    console.warn(`   ⚠️  pdfinfo failed for ${path.basename(filePath)}: ${String(err).slice(0, 80)}`);
    // Fallback: use pdf_extract.py
    try {
      const result = execSync(
        `python3 /root/pdf_extract.py check "${filePath}"`,
        { encoding: 'utf-8', timeout: 15000 }
      );
      const check = JSON.parse(result);
      return {
        id: `pdf-${Buffer.from(filePath).toString('base64').slice(0, 12)}`,
        raw_file_id: '',
        path: path.relative(RAW_DIR, filePath),
        filename: path.basename(filePath),
        size_human: formatSize(fs.statSync(filePath).size),
        pages: check.pages || 0,
        extractable: check.extractable,
        confidence: check.confidence || 0,
        diagnosis: check.diagnosis || 'unknown',
        encrypted: false,
        linked_wiki_pages: [],
        referenced_by_conversations: [],
        indexed_at: new Date().toISOString(),
      };
    } catch (err2) {
      return null;
    }
  }
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
  return files;
}

function main() {
  console.log('🔍 Scanning raw files...');

  const allFiles = walkRawDir(RAW_DIR);
  console.log(`   Found ${allFiles.length} files`);

  const rawFiles: RawFileEntry[] = [];
  const pdfFiles: PdfInfoEntry[] = [];

  for (const filePath of allFiles) {
    const stat = fs.statSync(filePath);
    const ext = path.extname(filePath);
    const relPath = path.relative(RAW_DIR, filePath);

    const entry: RawFileEntry = {
      id: `raw-${Buffer.from(relPath).toString('base64').slice(0, 12)}`,
      filename: path.basename(filePath),
      original_name: path.basename(filePath),
      path: relPath,
      type: getFileType(ext),
      mime: getMimeType(ext),
      size: stat.size,
      size_human: formatSize(stat.size),
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

    // Process PDF specific info
    if (ext.toLowerCase() === '.pdf') {
      const pdfInfo = getPdfInfo(filePath);
      if (pdfInfo) {
        pdfInfo.raw_file_id = entry.id;
        pdfFiles.push(pdfInfo);
        entry.status = 'indexed';
        entry.metadata = {
          pages: pdfInfo.pages,
          extractable: pdfInfo.extractable,
          confidence: pdfInfo.confidence,
          diagnosis: pdfInfo.diagnosis,
        };

        // Risk assessment
        if (pdfInfo.pages > 100 || stat.size > 10 * 1024 * 1024) {
          entry.risk_level = 'high';
        } else if (
          pdfInfo.pages === 0 ||
          (!pdfInfo.extractable && stat.size > 1024 * 1024)
        ) {
          entry.risk_level = 'medium';
        }
      }
    }
  }

  // Check for wiki-linked files from wiki-index
  const wikiIndexPath = path.join(DATA_DIR, 'wiki-index.json');
  if (fs.existsSync(wikiIndexPath)) {
    const wikiIndex = JSON.parse(fs.readFileSync(wikiIndexPath, 'utf-8'));
    for (const page of wikiIndex.pages) {
      if (page.source_refs) {
        for (const src of page.source_refs) {
          // src format: raw/specs/xxx.pdf
          const cleanSrc = src.replace(/^raw\//, '');
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
  }

  const linkedSources = rawFiles
    .filter((f) => f.status === 'linked')
    .map((f) => f.path);
  const unlinkedSources = rawFiles
    .filter((f) => f.status !== 'linked')
    .map((f) => f.path);

  const output = {
    raw_files: rawFiles,
    pdf_files: pdfFiles,
    markdown_files: [] as { path: string; size: number }[],
    linked_sources: linkedSources,
    unlinked_sources: unlinkedSources,
    last_indexed_at: new Date().toISOString(),
  };

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

  const unprocessed = pdfFiles.filter((p) => p.linked_wiki_pages.length === 0).length;

  console.log(`✅ Source index built`);
  console.log(`   - ${rawFiles.length} raw files`);
  console.log(`   - ${pdfFiles.length} PDFs (${pdfFiles.filter((p) => !p.extractable).length} non-extractable)`);
  console.log(`   - ${linkedSources.length} linked to wiki`);
  console.log(`   - ${unprocessed} PDFs not yet linked`);
  console.log(`   -> ${OUTPUT_FILE}`);
}

main();
