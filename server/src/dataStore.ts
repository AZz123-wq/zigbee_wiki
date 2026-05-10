/**
 * server/src/dataStore.ts
 * Simple JSON file data store for conversations, archives, reviews, etc.
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(MODULE_DIR, '..', '..', 'data');

interface StoreFile<T> {
  data: T;
  _updated_at: string;
}

class JsonStore<T> {
  private filePath: string;
  private cache: T | null = null;

  constructor(filename: string, private defaultValue: T) {
    this.filePath = path.join(DATA_DIR, filename);
  }

  read(): T {
    if (this.cache) return this.cache;
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        this.cache = parsed.data || parsed;
        return this.cache as T;
      }
    } catch {}
    return this.defaultValue;
  }

  write(data: T): void {
    this.cache = data;
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const store: StoreFile<T> = { data, _updated_at: new Date().toISOString() };
    fs.writeFileSync(this.filePath, JSON.stringify(store, null, 2));
  }

  update(updater: (data: T) => T): T {
    const current = this.read();
    const updated = updater(JSON.parse(JSON.stringify(current)));
    this.write(updated);
    return updated;
  }
}

// Define store types
export interface ConvData {
  conversations: Record<string, unknown>[];
}

export interface ArchiveData {
  archives: Record<string, unknown>[];
}

export interface ReviewData {
  review_items: Record<string, unknown>[];
}

export interface MessageData {
  messages: Record<string, unknown>[];
}

export interface ResearchRunData {
  research_runs: Record<string, unknown>[];
}

export interface EvidencePackData {
  evidence_packs: Record<string, unknown>[];
}

export const conversationStore = new JsonStore<ConvData>('conversations.json', { conversations: [] });
export const archiveStore = new JsonStore<ArchiveData>('archives.json', { archives: [] });
export const reviewStore = new JsonStore<ReviewData>('review-items.json', { review_items: [] });
export const messageStore = new JsonStore<MessageData>('messages.json', { messages: [] });
export const researchRunStore = new JsonStore<ResearchRunData>('research-runs.json', { research_runs: [] });
export const evidencePackStore = new JsonStore<EvidencePackData>('evidence-packs.json', { evidence_packs: [] });

export function getCheckResult(): Record<string, unknown> | null {
  const checkPath = path.join(DATA_DIR, 'check-results.json');
  try {
    if (fs.existsSync(checkPath)) {
      const raw = fs.readFileSync(checkPath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {}
  return null;
}

export function getWikiIndex(): Record<string, unknown> | null {
  const wikiPath = path.join(DATA_DIR, 'wiki-index.json');
  try {
    if (fs.existsSync(wikiPath)) {
      const raw = fs.readFileSync(wikiPath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {}
  return null;
}

export function getSourceIndex(): Record<string, unknown> | null {
  const sourcePath = path.join(DATA_DIR, 'source-index.json');
  try {
    if (fs.existsSync(sourcePath)) {
      const raw = fs.readFileSync(sourcePath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {}
  return null;
}

function readDataJson(filename: string): Record<string, unknown> | null {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch {}
  return null;
}

export function getSourcePageIndex(): Record<string, unknown> | null {
  return readDataJson('source-page-index.json');
}

export function getSourceChunkIndex(): Record<string, unknown> | null {
  return readDataJson('source-chunk-index.json');
}

export function getSourceOutlineIndex(): Record<string, unknown> | null {
  return readDataJson('source-outline-index.json');
}

export function getSourceQualityReport(): Record<string, unknown> | null {
  return readDataJson('source-quality-report.json');
}
