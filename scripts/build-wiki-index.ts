#!/usr/bin/env node
/**
 * build-wiki-index.ts
 * Scans wiki/ directory, parses frontmatter, extracts [[wikilinks]],
 * detects broken links and orphan pages, outputs data/wiki-index.json
 */
import * as fs from 'fs';
import * as path from 'path';

const WIKI_DIR = path.resolve(__dirname, '..', 'wiki');
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const OUTPUT_FILE = path.join(DATA_DIR, 'wiki-index.json');

interface WikiPage {
  id: string;
  title: string;
  path: string;
  folder: string;
  type: string;
  frontmatter: Record<string, unknown>;
  tags: string[];
  status: string;
  confidence?: number;
  source_refs: string[];
  pdf_refs: string[];
  outgoing_links: string[];
  backlinks: string[];
  broken_links: string[];
  created_at: string;
  updated_at: string;
  word_count: number;
  summary: string;
}

function parseFrontmatter(content: string): { data: Record<string, unknown>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: content };

  const raw = match[1];
  const body = match[2];
  const data: Record<string, unknown> = {};

  // Simple YAML parser for flat key-value pairs and lists
  let currentKey = '';
  let inList = false;
  let listValues: string[] = [];

  for (const line of raw.split('\n')) {
    const listMatch = line.match(/^\s*-\s+(.+)/);
    if (listMatch && currentKey) {
      inList = true;
      listValues.push(listMatch[1].trim().replace(/^['"]|['"]$/g, ''));
      continue;
    }

    if (inList && currentKey) {
      if (Array.isArray(data[currentKey])) {
        (data[currentKey] as string[]).push(...listValues);
      } else {
        data[currentKey] = [...listValues];
      }
      listValues = [];
      inList = false;
      currentKey = '';
    }

    const kvMatch = line.match(/^(\w[\w_]*):\s*(.+)?$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const value = (kvMatch[2] || '').trim();
      // Handle bracketed lists inline: [a, b, c]
      if (value.startsWith('[') && value.endsWith(']')) {
        data[currentKey] = value
          .slice(1, -1)
          .split(',')
          .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean);
        currentKey = '';
      } else if (value) {
        data[currentKey] = value.replace(/^['"]|['"]$/g, '');
        currentKey = '';
      }
    }
  }

  // Flush any remaining list
  if (inList && currentKey) {
    if (Array.isArray(data[currentKey])) {
      (data[currentKey] as string[]).push(...listValues);
    } else {
      data[currentKey] = [...listValues];
    }
  }

  return { data, body };
}

function extractWikilinks(content: string): string[] {
  const regex = /\[\[([^\]]+)\]\]/g;
  const links: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    const target = match[1].split('|')[0].trim();
    links.push(target);
  }
  return [...new Set(links)];
}

function walkDir(dir: string): string[] {
  const files: string[] = [];
  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'lint-reports') {
      files.push(...walkDir(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

function main() {
  console.log('🔍 Scanning wiki pages...');
  const mdFiles = walkDir(WIKI_DIR);
  console.log(`   Found ${mdFiles.length} Markdown files`);

  const pages: WikiPage[] = [];
  // Map: relative path (without .md) → full relative path
  const pageMap = new Map<string, string>();

  for (const filePath of mdFiles) {
    const relPath = path.relative(WIKI_DIR, filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data: fm, body } = parseFrontmatter(content);
    const outgoing = extractWikilinks(body);
    const wordCount = body.split(/\s+/).filter(Boolean).length;

    // Determine folder
    const folder = path.dirname(relPath) === '.' ? '/' : path.dirname(relPath);

    // Derive ID from relative path
    const id = relPath.replace(/\.md$/, '').replace(/\//g, '-');

    const page: WikiPage = {
      id,
      title: (fm.title as string) || path.basename(filePath, '.md'),
      path: relPath,
      folder,
      type: (fm.type as string) || 'unknown',
      frontmatter: fm,
      tags: Array.isArray(fm.tags) ? (fm.tags as string[]) : [],
      status: (fm.status as string) || 'unknown',
      source_refs: Array.isArray(fm.sources) ? (fm.sources as string[]) : [],
      pdf_refs: Array.isArray(fm.sources)
        ? (fm.sources as string[]).filter((s) => s.toLowerCase().endsWith('.pdf'))
        : [],
      outgoing_links: outgoing,
      backlinks: [],
      broken_links: [],
      created_at: (fm.created as string) || '',
      updated_at: (fm.updated as string) || (fm.created as string) || '',
      word_count: wordCount,
      summary: body.slice(0, 300).replace(/\n/g, ' ').trim(),
    };

    pages.push(page);

    // Register in page map
    const key = relPath.replace(/\.md$/, '');
    pageMap.set(key, relPath);
    // Also register by filename only (for short-form wikilinks)
    const basename = path.basename(filePath, '.md');
    if (!pageMap.has(basename)) {
      pageMap.set(basename, relPath);
    }
  }

  // Build title index for wikilink resolution
  const titleToPath = new Map<string, string>();
  for (const p of pages) {
    titleToPath.set(p.title.toLowerCase(), p.path);
  }

  // Resolve outgoing links → check if target exists
  const matchedPaths = new Set<string>();
  for (const page of pages) {
    for (const link of page.outgoing_links) {
      const normalized = link.replace(/\\/g, '/');
      // Try exact match first, then by filename, then by title
      let targetPath = pageMap.get(normalized);
      if (!targetPath) {
        // Try matching just the basename
        const linkBasename = path.basename(normalized);
        targetPath = pageMap.get(linkBasename);
      }
      if (!targetPath) {
        // Try by title
        const titleTarget = titleToPath.get(normalized.toLowerCase());
        if (titleTarget) {
          targetPath = titleTarget;
        }
      }

      if (targetPath) {
        matchedPaths.add(targetPath);
        // Find the target page and add backlink
        const targetPage = pages.find((p) => p.path === targetPath);
        if (targetPage && !targetPage.backlinks.includes(page.path)) {
          targetPage.backlinks.push(page.path);
        }
      } else {
        page.broken_links.push(link);
      }
    }
  }

  // Detect orphan pages (no backlinks, not index/changelog)
  for (const page of pages) {
    if (
      page.backlinks.length === 0 &&
      page.path !== 'index.md' &&
      page.path !== 'changelog.md' &&
      page.type !== 'index' &&
      page.type !== 'changelog'
    ) {
      // It's potentially orphan
    }
  }

  const output = {
    pages,
    total_pages: pages.length,
    indexed_at: new Date().toISOString(),
    stats: {
      types: {} as Record<string, number>,
      total_wikilinks: pages.reduce((sum, p) => sum + p.outgoing_links.length, 0),
      total_broken_links: pages.reduce((sum, p) => sum + p.broken_links.length, 0),
      total_backlinks: pages.reduce((sum, p) => sum + p.backlinks.length, 0),
      orphan_count: pages.filter(
        (p) =>
          p.backlinks.length === 0 &&
          p.path !== 'index.md' &&
          p.path !== 'changelog.md'
      ).length,
    },
  };

  // Count types
  for (const p of pages) {
    output.stats.types[p.type] = (output.stats.types[p.type] || 0) + 1;
  }

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

  console.log(`✅ Wiki index built: ${pages.length} pages`);
  console.log(`   - ${output.stats.total_wikilinks} wikilinks`);
  console.log(`   - ${output.stats.total_broken_links} broken links`);
  console.log(`   - ${output.stats.orphan_count} orphan pages`);
  console.log(`   -> ${OUTPUT_FILE}`);
}

main();
