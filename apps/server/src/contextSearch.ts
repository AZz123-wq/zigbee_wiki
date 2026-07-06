/**
 * Retrieval helpers for automatic wiki/source context selection.
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

import {
  evidencePackStore,
  getSourceChunkIndex,
  getSourceIndex,
  getWikiIndex,
  researchRunStore,
} from './dataStore.js';
import { readPdfPages } from './pdfSafeReader.js';

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(MODULE_DIR, '..', '..', '..');
const WIKI_DIR = path.join(ROOT_DIR, 'knowledge', 'wiki');
const MAX_WIKI_CONTEXT_CHARS = 14000;
const MAX_SOURCE_CONTEXT_CHARS = 22000;

type CitationType = 'wiki' | 'raw' | 'pdf' | 'evidence';

export interface Citation {
  type: CitationType;
  title: string;
  path: string;
  pages?: number[];
  source_id?: string;
  evidence_pack_id?: string;
  score?: number;
}

export interface PdfContext {
  path: string;
  text: string;
  pages?: number[];
  source_id?: string;
}

export interface SearchTrace {
  id: string;
  query: string;
  normalized_query: string;
  extracted_terms: string[];
  search_mode: 'manual_only' | 'evidence_pack_reuse' | 'fresh_source_search' | 'mixed';
  selected_wiki_pages: string[];
  selected_source_chunks: Record<string, unknown>[];
  selected_pdf_pages: { path: string; pages: number[]; source_id?: string }[];
  selected_evidence_packs: string[];
  discarded_candidates: Record<string, unknown>[];
  read_errors: string[];
  auto_context_used: boolean;
  created_at: string;
}

export interface ContextBuildResult {
  wikiContent: string[];
  pdfContent: PdfContext[];
  citations: Citation[];
  trace: SearchTrace;
}

const STOP_WORDS = new Set([
  'what', 'when', 'where', 'which', 'that', 'this', 'with', 'from', 'about',
  'how', 'does', '设备', '如何', '处理', '消息', '区别', '什么', '一个', '是否',
  'end', 'device', 'devices', 'message', 'messages', 'data', 'network', 'zigbee',
]);

const PHRASES = [
  'sleepy end device',
  'end device',
  'data poll',
  'mac data poll',
  'rx on when idle',
  'poll control',
  'indirect transmission',
  'broadcast transaction',
  'broadcast delivery',
  'parent child',
  'child keepalive',
  'parent information',
  'device annce',
  'device_annce',
  'nwk passive ack timeout',
];

function normalizeQuery(input: string): string {
  return input
    .toLowerCase()
    .replace(/休眠终端设备|休眠终端|休眠设备|睡眠终端|睡眠设备|低功耗终端/g, ' sleepy end device ')
    .replace(/终端设备|子设备/g, ' end device child ')
    .replace(/父节点|父设备/g, ' parent ')
    .replace(/广播消息|广播帧|广播/g, ' broadcast ')
    .replace(/轮询控制/g, ' poll control ')
    .replace(/数据轮询|轮询/g, ' data poll polling ')
    .replace(/间接传输|间接发送/g, ' indirect transmission ')
    .replace(/接收器常开|空闲接收|rxonwhenidle/g, ' rx on when idle ')
    .replace(/保活/g, ' keepalive ')
    .replace(/区别|差异/g, ' difference ')
    .replace(/device[_\s-]?annce/g, ' device_annce ')
    .replace(/[，。？！、；：]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractQueryTerms(query: string): string[] {
  const normalized = normalizeQuery(query);
  const terms = new Set<string>();

  for (const phrase of PHRASES) {
    if (normalized.includes(phrase)) terms.add(phrase);
  }

  for (const token of normalized.match(/[a-z0-9_][a-z0-9_-]{2,}/g) || []) {
    if (!STOP_WORDS.has(token)) terms.add(token);
  }

  if (normalized.includes('sleepy end device')) {
    terms.add('macrxonwhenidle');
    terms.add('rxonwhenidle');
    terms.add('rx on when idle');
    terms.add('parent');
    terms.add('child');
    terms.add('indirect transmission');
  }
  if (normalized.includes('broadcast')) {
    terms.add('broadcast transaction');
    terms.add('broadcast address');
    terms.add('0xffff');
    terms.add('nwkbroadcastdeliverytime');
  }
  if (normalized.includes('data poll') || normalized.includes('polling')) {
    terms.add('data poll');
    terms.add('mac data poll');
  }

  return [...terms];
}

function scoreText(text: string, terms: string[], query: string): number {
  const haystack = text.toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (!term) continue;
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const count = (haystack.match(new RegExp(escaped, 'g')) || []).length;
    if (count > 0) score += count * (term.includes(' ') ? 8 : term.length > 5 ? 4 : 2);
  }

  const normalizedQuery = normalizeQuery(query);
  if (normalizedQuery.includes('sleepy end device') && haystack.includes('macrxonwhenidle')) score += 8;
  if (normalizedQuery.includes('sleepy end device') && haystack.includes('indirect transmission')) score += 8;
  if (normalizedQuery.includes('broadcast') && haystack.includes('broadcast transaction')) score += 10;
  if (normalizedQuery.includes('broadcast') && haystack.includes('0xffff')) score += 6;
  if (normalizedQuery.includes('data poll') && haystack.includes('parent')) score += 5;
  if (normalizedQuery.includes('poll control') && haystack.includes('cluster')) score += 8;
  if (haystack.includes('table of contents')) score -= 12;
  if (haystack.includes('figure ') && haystack.includes('................................')) score -= 6;
  return score;
}

function readWikiPage(pagePath: string, maxChars = 5000): string | null {
  const wikiPath = path.resolve(WIKI_DIR, pagePath);
  if (!wikiPath.startsWith(WIKI_DIR) || !fs.existsSync(wikiPath)) return null;
  return fs.readFileSync(wikiPath, 'utf-8').slice(0, maxChars);
}

function loadManualWiki(wikiPages: string[]): string[] {
  const wikiIndex = getWikiIndex();
  const pages = ((wikiIndex as any)?.pages || []) as any[];
  const selected = pages.filter((p) => wikiPages.includes(p.path) || wikiPages.includes(p.id));
  return selected.flatMap((p) => {
    const content = readWikiPage(p.path);
    return content ? [`### ${p.path}\n\n${content}`] : [];
  });
}

function loadManualPdf(pdfPages: any[]): PdfContext[] {
  const pdfContent: PdfContext[] = [];
  for (const pp of pdfPages.slice(0, 3)) {
    try {
      const startPage = Math.max(1, pp.pages?.[0] || 1);
      const endPage = Math.min(startPage + 2, pp.pages?.[pp.pages.length - 1] || startPage + 2);
      const result = readPdfPages(pp.path, startPage, endPage);
      if (result.text && !result.error) {
        pdfContent.push({
          path: pp.path,
          pages: Array.from({ length: result.endPage - result.startPage + 1 }, (_, i) => result.startPage + i),
          text: result.text,
        });
      }
    } catch {}
  }
  return pdfContent;
}

function selectedPagesAround(chunks: any[]): { path: string; source_id?: string; pages: number[] }[] {
  const selected: { path: string; source_id?: string; pages: number[] }[] = [];
  const seen = new Set<string>();
  for (const chunk of chunks) {
    const pages = Array.isArray(chunk.pages)
      ? (chunk.pages as unknown[])
          .map((p) => Number(p))
          .filter((p) => Number.isFinite(p))
      : [];
    if (pages.length === 0) continue;
    const sorted = [...new Set<number>(pages)].sort((a: number, b: number) => a - b);
    const start = Math.max(1, sorted[0] ?? 1);
    const end = Math.min(start + 4, sorted[sorted.length - 1] ?? start);
    const key = `${chunk.source_path}:${start}-${end}`;
    if (seen.has(key)) continue;
    seen.add(key);
    selected.push({
      path: chunk.source_path,
      source_id: chunk.source_id,
      pages: Array.from({ length: end - start + 1 }, (_, i) => start + i),
    });
    if (selected.length >= 5) break;
  }

  return selected;
}

function sourcePathFromRawFile(rawFileRef: string): string | null {
  const sourceIndex = getSourceIndex();
  const rawFiles = ((sourceIndex as any)?.raw_files || []) as any[];
  const found = rawFiles.find((f) => f.id === rawFileRef || f.path === rawFileRef);
  return found?.path || (rawFileRef.includes('/') ? rawFileRef : null);
}

function createTrace(query: string, terms: string[]): SearchTrace {
  return {
    id: uuidv4(),
    query,
    normalized_query: normalizeQuery(query),
    extracted_terms: terms,
    search_mode: 'manual_only',
    selected_wiki_pages: [],
    selected_source_chunks: [],
    selected_pdf_pages: [],
    selected_evidence_packs: [],
    discarded_candidates: [],
    read_errors: [],
    auto_context_used: false,
    created_at: new Date().toISOString(),
  };
}

function findEvidencePacks(query: string, terms: string[]): any[] {
  const packs = evidencePackStore.read().evidence_packs || [];
  return packs
    .map((pack: any) => ({
      pack,
      score: scoreText(`${pack.topic_key || ''} ${pack.summary || ''} ${(pack.snippets || []).join(' ')}`, terms, query),
    }))
    .filter((item) => item.score > 0 && !item.pack.stale && (item.pack.record_type || 'source_evidence_pack') === 'source_evidence_pack')
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((item) => ({ ...item.pack, _score: item.score }));
}

function searchWiki(query: string, terms: string[]): any[] {
  const wikiIndex = getWikiIndex();
  const pages = ((wikiIndex as any)?.pages || []) as any[];
  return pages
    .map((page) => ({
      page,
      score: scoreText(`${page.title || ''} ${(page.tags || []).join(' ')} ${page.summary || ''} ${(page.source_refs || []).join(' ')}`, terms, query),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => ({ ...item.page, _score: item.score }));
}

function searchChunks(query: string, terms: string[], rawFiles: string[]): any[] {
  const chunkIndex = getSourceChunkIndex();
  const chunks = ((chunkIndex as any)?.chunks || []) as any[];
  const selectedPaths = rawFiles.map(sourcePathFromRawFile).filter(Boolean) as string[];
  const pool = selectedPaths.length > 0
    ? chunks.filter((chunk) => selectedPaths.includes(chunk.source_path))
    : chunks;
  const normalizedQuery = normalizeQuery(query);

  return pool
    .map((chunk) => {
      const text = `${chunk.title || ''} ${(chunk.terms || []).join(' ')} ${chunk.normalized_text || ''}`;
      const haystack = text.toLowerCase();
      let score = scoreText(text, terms, query);

      if (normalizedQuery.includes('broadcast') && chunk.source_path.includes('docs-05-3474')) score += 18;
      if (normalizedQuery.includes('broadcast') && !haystack.includes('broadcast')) score *= 0.4;
      if (normalizedQuery.includes('broadcast') && haystack.includes('to transmit a broadcast msdu')) score += 45;
      if (normalizedQuery.includes('broadcast') && haystack.includes('broadcast address destination group')) score += 28;
      if (normalizedQuery.includes('broadcast') && haystack.includes('broadcast transaction record')) score += 28;
      if (normalizedQuery.includes('broadcast') && haystack.includes('macrxonwhenidle') && haystack.includes('broadcast')) score += 120;
      if (normalizedQuery.includes('broadcast') && haystack.includes('mac layer unicast')) score += 90;
      if (normalizedQuery.includes('broadcast') && haystack.includes('indirect transmission')) score += 80;
      if (normalizedQuery.includes('sleepy end device') && haystack.includes('mac destination address of the parent')) score += 30;
      if (normalizedQuery.includes('sleepy end device') && haystack.includes('indirect transmission')) score += 25;
      if (normalizedQuery.includes('data poll') && haystack.includes('child keepalive')) score += 20;
      if (!normalizedQuery.includes('test') && chunk.source_path.startsWith('test-specs/')) score -= 20;
      if (!normalizedQuery.includes('poll control') && chunk.source_path.includes('Zigbee-Cluster-Library')) score -= 10;
      return { chunk, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((item) => ({ ...item.chunk, _score: item.score }));
}

function compressPdfContext(chunks: any[], maxChars = MAX_SOURCE_CONTEXT_CHARS): PdfContext[] {
  const grouped = new Map<string, PdfContext>();
  let used = 0;

  for (const chunk of chunks) {
    if (used >= maxChars) break;
    const pages = Array.isArray(chunk.pages) ? chunk.pages.map(Number).filter(Boolean) : [];
    const cite = pages.length > 0 ? `p.${pages.join(',')}` : 'chunk';
    const block = `### ${chunk.source_path} ${cite}\n${chunk.snippet || chunk.text || ''}\n`;
    if (!block.trim()) continue;
    const remaining = maxChars - used;
    const text = block.slice(0, remaining);
    used += text.length;

    const existing = grouped.get(chunk.source_path);
    if (existing) {
      existing.text += `\n${text}`;
      const mergedPages = new Set([...(existing.pages || []), ...pages]);
      existing.pages = [...mergedPages].sort((a, b) => a - b);
    } else {
      grouped.set(chunk.source_path, {
        path: chunk.source_path,
        text,
        pages,
        source_id: chunk.source_id,
      });
    }
  }

  return [...grouped.values()];
}

export function buildChatContext(params: {
  query: string;
  wiki_pages?: string[];
  raw_files?: string[];
  pdf_pages?: any[];
  allowAuto?: boolean;
  allowEvidencePacks?: boolean;
}): ContextBuildResult {
  const manualWikiPages = params.wiki_pages || [];
  const manualRawFiles = params.raw_files || [];
  const manualPdfPages = params.pdf_pages || [];
  const terms = extractQueryTerms(params.query);
  const trace = createTrace(params.query, terms);

  const wikiContent = loadManualWiki(manualWikiPages);
  const pdfContent = loadManualPdf(manualPdfPages);
  const citations: Citation[] = [
    ...manualWikiPages.map((wp) => ({ type: 'wiki' as const, title: wp, path: wp })),
    ...manualRawFiles.map((rf) => ({ type: 'raw' as const, title: rf, path: sourcePathFromRawFile(rf) || rf })),
    ...manualPdfPages.map((pp: any) => ({ type: 'pdf' as const, title: pp.path, path: pp.path, pages: pp.pages })),
  ];

  const allowAuto = params.allowAuto !== false;
  const hasManualContext = wikiContent.length > 0 || pdfContent.length > 0 || manualRawFiles.length > 0;
  if (!allowAuto) {
    return { wikiContent, pdfContent, citations, trace };
  }

  const evidencePacks = params.allowEvidencePacks === false ? [] : findEvidencePacks(params.query, terms);
  for (const pack of evidencePacks) {
    trace.selected_evidence_packs.push(pack.id);
    const snippets = Array.isArray(pack.snippets) ? pack.snippets.join('\n\n') : pack.summary || '';
    pdfContent.push({
      path: pack.source_path || `evidence:${pack.topic_key || pack.id}`,
      text: `### Evidence Pack: ${pack.topic_key || pack.id}\n${snippets}`.slice(0, 4000),
      pages: pack.pages,
    });
    citations.push({
      type: 'evidence',
      title: pack.topic_key || pack.id,
      path: pack.source_path || '',
      pages: pack.pages,
      evidence_pack_id: pack.id,
      score: pack._score,
    });
  }

  const canReuseEvidenceOnly = evidencePacks.some((pack) =>
    Number(pack.confidence ?? 0) >= 0.7 &&
    Number(pack._score ?? 0) >= 20 &&
    Array.isArray(pack.snippets) &&
    pack.snippets.length > 0
  ) && manualRawFiles.length === 0 && manualPdfPages.length === 0;

  const wikiMatches = searchWiki(params.query, terms);
  for (const page of wikiMatches) {
    if (wikiContent.join('\n').length >= MAX_WIKI_CONTEXT_CHARS) break;
    if (manualWikiPages.includes(page.path)) continue;
    const content = readWikiPage(page.path, 4500);
    if (!content) continue;
    wikiContent.push(`### ${page.path}\n\n${content}`);
    trace.selected_wiki_pages.push(page.path);
    citations.push({ type: 'wiki', title: page.title || page.path, path: page.path, score: page._score });
  }

  const chunkMatches = canReuseEvidenceOnly ? [] : searchChunks(params.query, terms, manualRawFiles);
  const selectedChunks = hasManualContext ? chunkMatches.slice(0, 6) : chunkMatches.slice(0, 10);
  trace.selected_source_chunks = selectedChunks.map((chunk) => ({
    id: chunk.id,
    source_id: chunk.source_id,
    source_path: chunk.source_path,
    pages: chunk.pages,
    score: chunk._score,
    snippet: String(chunk.snippet || '').slice(0, 300),
  }));

  const selectedPdfPages = selectedPagesAround(selectedChunks);
  const safeReadPaths = new Set<string>();
  for (const item of selectedPdfPages) {
    trace.selected_pdf_pages.push(item);
    citations.push({
      type: 'pdf',
      title: item.path,
      path: item.path,
      pages: item.pages,
      source_id: item.source_id,
    });
    try {
      const startPage = item.pages[0];
      const endPage = item.pages[item.pages.length - 1];
      const result = readPdfPages(item.path, startPage, endPage);
      if (result.error) {
        trace.read_errors.push(`${item.path} p.${startPage}-${endPage}: ${result.error}`);
      } else if (result.text.trim()) {
        safeReadPaths.add(`${item.path}:${item.pages.join(',')}`);
        pdfContent.push({
          path: item.path,
          pages: item.pages,
          source_id: item.source_id,
          text: result.text.slice(0, 6000),
        });
      }
    } catch (err: any) {
      trace.read_errors.push(`${item.path} p.${item.pages.join(',')}: ${String(err.message || err).slice(0, 180)}`);
    }
  }

  if (safeReadPaths.size === 0) {
    pdfContent.push(...compressPdfContext(selectedChunks));
  }

  trace.discarded_candidates = chunkMatches.slice(selectedChunks.length, selectedChunks.length + 8).map((chunk) => ({
    id: chunk.id,
    source_path: chunk.source_path,
    pages: chunk.pages,
    score: chunk._score,
  }));
  trace.auto_context_used = trace.selected_wiki_pages.length > 0 ||
    trace.selected_source_chunks.length > 0 ||
    trace.selected_evidence_packs.length > 0;
  trace.search_mode = trace.selected_evidence_packs.length > 0 && trace.selected_source_chunks.length === 0
    ? 'evidence_pack_reuse'
    : trace.selected_evidence_packs.length > 0 && trace.selected_source_chunks.length > 0
      ? 'mixed'
      : trace.selected_source_chunks.length > 0
        ? 'fresh_source_search'
        : 'manual_only';

  const seen = new Set<string>();
  const deduped = citations.filter((citation) => {
    const key = `${citation.type}:${citation.path}:${(citation.pages || []).join(',')}:${citation.evidence_pack_id || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return { wikiContent, pdfContent, citations: deduped, trace };
}

export function saveResearchRun(trace: SearchTrace, data: {
  conversation_id: string;
  user_message_id: string;
  assistant_message_id?: string;
  citations: Citation[];
  token_estimate?: number;
}) {
  const run = {
    id: trace.id,
    query: trace.query,
    normalized_query: trace.normalized_query,
    extracted_terms: trace.extracted_terms,
    record_type: 'source_search_run',
    basis: 'spec_source_search',
    search_mode: trace.search_mode,
    selected_wiki_pages: trace.selected_wiki_pages,
    selected_source_chunks: trace.selected_source_chunks,
    selected_pdf_pages: trace.selected_pdf_pages,
    selected_evidence_packs: trace.selected_evidence_packs,
    discarded_candidates: trace.discarded_candidates,
    read_errors: trace.read_errors,
    answer_content_stored: false,
    final_answer_message_id: data.assistant_message_id,
    conversation_id: data.conversation_id,
    user_message_id: data.user_message_id,
    citations: data.citations,
    token_estimate: data.token_estimate,
    created_at: trace.created_at,
  };

  researchRunStore.update((d) => {
    d.research_runs.unshift(run);
    d.research_runs = d.research_runs.slice(0, 500);
    return d;
  });
  return run;
}

export function maybeSaveEvidencePack(trace: SearchTrace, citations: Citation[]) {
  if (trace.selected_source_chunks.length === 0) return null;
  const firstPdf = citations.find((c) => c.type === 'pdf');
  const topicKey = trace.extracted_terms.slice(0, 5).join(' ') || trace.normalized_query.slice(0, 80);
  const sourceRefs = trace.selected_pdf_pages.map((item) => ({
    source_id: item.source_id,
    source_path: item.path,
    pages: item.pages,
  }));
  const chunkRefs = trace.selected_source_chunks.slice(0, 8).map((chunk: any) => ({
    chunk_id: chunk.id,
    source_id: chunk.source_id,
    source_path: chunk.source_path,
    pages: chunk.pages,
    score: chunk.score,
    snippet: chunk.snippet,
  }));
  const pack = {
    id: uuidv4(),
    record_type: 'source_evidence_pack',
    basis: 'spec_source_search',
    topic_key: topicKey,
    query: trace.query,
    normalized_query: trace.normalized_query,
    source_path: firstPdf?.path,
    source_id: firstPdf?.source_id,
    pages: firstPdf?.pages,
    source_refs: sourceRefs,
    chunk_refs: chunkRefs,
    snippets: chunkRefs.map((c) => c.snippet).filter(Boolean),
    answer_content_stored: false,
    created_from_research_run_id: trace.id,
    confidence: 0.72,
    stale: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  evidencePackStore.update((d) => {
    const exists = d.evidence_packs.find((p: any) => p.topic_key === pack.topic_key && p.source_path === pack.source_path);
    if (exists) {
      Object.assign(exists, {
        record_type: 'source_evidence_pack',
        basis: 'spec_source_search',
        source_refs: pack.source_refs,
        chunk_refs: pack.chunk_refs,
        snippets: pack.snippets,
        pages: pack.pages,
        answer_content_stored: false,
        created_from_research_run_id: trace.id,
        updated_at: pack.updated_at,
        stale: false,
      });
    } else {
      d.evidence_packs.unshift(pack);
    }
    d.evidence_packs = d.evidence_packs.slice(0, 300);
    return d;
  });

  return pack;
}
