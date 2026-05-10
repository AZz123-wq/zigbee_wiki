/**
 * server/src/pdfSafeReader.ts
 * PDF safe reader with hard limits
 */
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const MAX_PAGES_PER_READ = 5;
const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
const RAW_DIR = path.resolve(MODULE_DIR, '..', '..', 'raw');

export interface PdfInfo {
  pages: number;
  title?: string;
  author?: string;
  encrypted: boolean;
  page_size?: string;
  created_at?: string;
  modified_at?: string;
}

export interface PdfReadResult {
  text: string;
  startPage: number;
  endPage: number;
  totalPages: number;
  truncated: boolean;
  error?: string;
}

export function getPdfInfo(relativePath: string): PdfInfo | null {
  const filePath = path.join(RAW_DIR, relativePath);
  if (!fs.existsSync(filePath)) return null;

  try {
    const result = execSync(`pdfinfo "${filePath}"`, { encoding: 'utf-8', timeout: 10000 });
    const info: Record<string, string> = {};
    for (const line of result.split('\n')) {
      const m = line.match(/^(.+?):\s+(.+)$/);
      if (m) info[m[1].trim().toLowerCase()] = m[2].trim();
    }
    return {
      pages: parseInt(info.pages || '0', 10),
      title: info.title,
      author: info.author,
      encrypted: (info.encrypted || '').toLowerCase() === 'yes',
      page_size: info['page size'],
      created_at: info.creationdate,
      modified_at: info.moddate,
    };
  } catch {
    // Fallback to pdf_extract.py
    try {
      const result = execSync(`python3 /root/pdf_extract.py check "${filePath}"`, {
        encoding: 'utf-8',
        timeout: 15000,
      });
      const check = JSON.parse(result);
      return {
        pages: check.pages || 0,
        encrypted: false,
      };
    } catch {
      return null;
    }
  }
}

export function readPdfPages(
  relativePath: string,
  startPage: number,
  endPage: number
): PdfReadResult {
  const filePath = path.join(RAW_DIR, relativePath);

  // Validate file exists
  if (!fs.existsSync(filePath)) {
    return {
      text: '',
      startPage,
      endPage,
      totalPages: 0,
      truncated: false,
      error: `File not found: ${relativePath}`,
    };
  }

  // Validate page range
  const info = getPdfInfo(relativePath);
  if (!info) {
    return {
      text: '',
      startPage,
      endPage,
      totalPages: 0,
      truncated: false,
      error: 'Could not read PDF metadata',
    };
  }

  const validation = validatePageRange(startPage, endPage, info.pages);
  if (validation.error) {
    return { ...validation, totalPages: info.pages };
  }

  // Extract text
  try {
    const text = execSync(
      `pdftotext -f ${startPage} -l ${endPage} -layout "${filePath}" -`,
      { encoding: 'utf-8', timeout: 20000 }
    );

    // Limit total chars per response
    const MAX_CHARS = 30000;
    const truncated = text.length > MAX_CHARS;
    return {
      text: truncated ? text.slice(0, MAX_CHARS) + '\n\n[Text truncated - exceeded 30,000 character limit]' : text,
      startPage,
      endPage,
      totalPages: info.pages,
      truncated,
    };
  } catch (err) {
    return {
      text: '',
      startPage,
      endPage,
      totalPages: info.pages,
      truncated: false,
      error: `pdfSafeReader: pdftotext extraction failed: ${String(err).slice(0, 200)}`,
    };
  }
}

export function validatePageRange(
  startPage: number,
  endPage: number,
  totalPages: number
): PdfReadResult & { error?: string } {
  if (startPage < 1) {
    return {
      text: '',
      startPage, endPage, totalPages,
      truncated: false,
      error: 'Invalid page range: startPage must be >= 1',
    };
  }

  if (endPage > totalPages) {
    return {
      text: '',
      startPage, endPage, totalPages,
      truncated: false,
      error: `Invalid page range: endPage (${endPage}) exceeds total pages (${totalPages})`,
    };
  }

  if (endPage < startPage) {
    return {
      text: '',
      startPage, endPage, totalPages,
      truncated: false,
      error: 'Invalid page range: endPage must be >= startPage',
    };
  }

  const pageCount = endPage - startPage + 1;
  if (pageCount > MAX_PAGES_PER_READ) {
    return {
      text: '',
      startPage, endPage, totalPages,
      truncated: false,
      error: `Too many pages requested (${pageCount}). Maximum ${MAX_PAGES_PER_READ} pages per read. Please reduce the range.`,
    };
  }

  return { text: '', startPage, endPage, totalPages, truncated: false };
}

export function detectPdfRisk(relativePath: string): {
  risk: 'low' | 'medium' | 'high';
  pages: number;
  size_mb: number;
} {
  const filePath = path.join(RAW_DIR, relativePath);
  try {
    const stat = fs.statSync(filePath);
    const size_mb = stat.size / (1024 * 1024);
    const info = getPdfInfo(relativePath);
    const pages = info?.pages || 0;

    let risk: 'low' | 'medium' | 'high' = 'low';
    if (pages > 100 || size_mb > 10) {
      risk = 'high';
    } else if (pages > 30 || size_mb > 5) {
      risk = 'medium';
    }

    return { risk, pages, size_mb: Math.round(size_mb * 10) / 10 };
  } catch {
    return { risk: 'high', pages: 0, size_mb: 0 };
  }
}
