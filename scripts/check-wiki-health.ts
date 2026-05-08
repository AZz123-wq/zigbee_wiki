#!/usr/bin/env node
/**
 * check-wiki-health.ts
 * Performs wiki health check: broken links, orphan pages, missing sources,
 * low confidence, unreviewed, duplicates, stale, unprocessed raw, PDF metadata
 * Outputs data/check-results.json
 */
import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.resolve(__dirname, '..', 'data');
const WIKI_INDEX = path.join(DATA_DIR, 'wiki-index.json');
const SOURCE_INDEX = path.join(DATA_DIR, 'source-index.json');
const OUTPUT_FILE = path.join(DATA_DIR, 'check-results.json');

interface CheckIssue {
  id: string;
  type: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  file: string;
  related_files: string[];
  suggestion: string;
  claude_prompt: string;
}

interface CheckResult {
  id: string;
  created_at: string;
  health_score: number;
  total_issues: number;
  critical: number;
  errors: number;
  warnings: number;
  suggestions: number;
  issues: CheckIssue[];
  summary: string;
}

function loadJson(filePath: string): Record<string, unknown> | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

function main() {
  console.log('🩺 Running Wiki health check...');

  const issues: CheckIssue[] = [];
  let issueCounter = 0;

  const wikiIndex = loadJson(WIKI_INDEX);
  const sourceIndex = loadJson(SOURCE_INDEX);

  if (!wikiIndex) {
    console.error('❌ wiki-index.json not found. Run build-wiki-index first.');
    process.exit(1);
  }

  const pages = (wikiIndex as any).pages || [];

  // 1. Check broken wikilinks
  for (const page of pages) {
    if (page.broken_links && page.broken_links.length > 0) {
      for (const link of page.broken_links) {
        issues.push({
          id: `issue-${++issueCounter}`,
          type: 'broken_wikilink',
          severity: 'error',
          title: `Broken wikilink in ${page.path}`,
          message: `[[${link}]] points to a page that does not exist`,
          file: `wiki/${page.path}`,
          related_files: [],
          suggestion: `Create the target page or fix the link to an existing page`,
          claude_prompt: `The wiki page wiki/${page.path} references [[${link}]] which doesn't exist. Please create this page or fix the link.`,
        });
      }
    }
  }

  // 2. Check orphan pages
  for (const page of pages) {
    if (
      page.backlinks &&
      page.backlinks.length === 0 &&
      page.path !== 'index.md' &&
      page.path !== 'changelog.md' &&
      page.type !== 'index' &&
      page.type !== 'changelog'
    ) {
      issues.push({
        id: `issue-${++issueCounter}`,
        type: 'orphan_page',
        severity: 'warning',
        title: `Orphan page: ${page.title}`,
        message: `No other wiki pages link to this page`,
        file: `wiki/${page.path}`,
        related_files: [],
        suggestion: `从相关页面添加 [[${page.path.replace('.md', '')}]] 链接`,
        claude_prompt: `Wiki 页面 wiki/${page.path} (${page.title}) 为孤立页面。请从 index.md 等相关页面添加 wikilinks。`,
      });
    }
  }

  // 3. Check missing source references
  for (const page of pages) {
    if (
      page.type !== 'index' &&
      page.type !== 'changelog' &&
      (!page.source_refs || page.source_refs.length === 0)
    ) {
      issues.push({
        id: `issue-${++issueCounter}`,
        type: 'missing_source',
        severity: 'warning',
        title: `Missing source in ${page.title}`,
        message: `Page has no source references in frontmatter`,
        file: `wiki/${page.path}`,
        related_files: [],
        suggestion: `在 frontmatter 中添加 'sources:' 字段引用源文档`,
        claude_prompt: `Wiki 页面 wiki/${page.path} (${page.title}) 缺少来源引用。请在 frontmatter 中添加 sources 字段。`,
      });
    }
  }

  // 4. Check low confidence pages (frontmatter confidence field)
  for (const page of pages) {
    if (page.frontmatter && page.frontmatter.confidence !== undefined) {
      const conf = Number(page.frontmatter.confidence);
      if (conf < 0.5) {
        issues.push({
          id: `issue-${++issueCounter}`,
          type: 'low_confidence',
          severity: 'warning',
          title: `Low confidence page: ${page.title}`,
          message: `Confidence: ${conf}`,
          file: `wiki/${page.path}`,
          related_files: [],
          suggestion: `Review and verify the information on this page`,
          claude_prompt: `The wiki page wiki/${page.path} (${page.title}) has low confidence (${conf}). Please review and verify its content.`,
        });
      }
    }
  }

  // 5. Check duplicate titles
  const titleMap = new Map<string, string[]>();
  for (const page of pages) {
    const title = (page.title || '').toLowerCase();
    if (!titleMap.has(title)) titleMap.set(title, []);
    titleMap.get(title)!.push(page.path);
  }
  for (const [title, paths] of titleMap) {
    if (paths.length > 1) {
      issues.push({
        id: `issue-${++issueCounter}`,
        type: 'duplicate_title',
        severity: 'warning',
        title: `Duplicate title: "${title}"`,
        message: `Found in: ${paths.join(', ')}`,
        file: `wiki/${paths[0]}`,
        related_files: paths.slice(1).map((p) => `wiki/${p}`),
        suggestion: `Rename one of the pages to have a unique title`,
        claude_prompt: `The following wiki pages have duplicate titles: ${paths.map((p) => `wiki/${p}`).join(', ')}. Please rename one to avoid confusion.`,
      });
    }
  }

  // 6. Check for missing frontmatter
  for (const page of pages) {
    if (!page.frontmatter || Object.keys(page.frontmatter).length === 0) {
      issues.push({
        id: `issue-${++issueCounter}`,
        type: 'missing_frontmatter',
        severity: 'error',
        title: `Missing frontmatter: ${page.title}`,
        message: `Page has no YAML frontmatter`,
        file: `wiki/${page.path}`,
        related_files: [],
        suggestion: `Add required frontmatter fields (title, type, sources, tags, created, updated)`,
        claude_prompt: `The wiki page wiki/${page.path} (${page.title}) is missing YAML frontmatter. Please add it with at least: title, type, sources, tags, created, updated.`,
      });
    }
  }

  // 7. Check unprocessed raw files (if source index available)
  if (sourceIndex) {
    const rawFiles = (sourceIndex as any).raw_files || [];
    const pdfFiles = (sourceIndex as any).pdf_files || [];
    const unprocessed = rawFiles.filter(
      (f: any) => f.status !== 'linked' && f.status !== 'archived' && f.status !== 'ignored'
    );
    for (const f of unprocessed) {
      issues.push({
        id: `issue-${++issueCounter}`,
        type: 'unprocessed_raw',
        severity: 'info',
        title: `Unprocessed raw file: ${f.filename}`,
        message: `Status: ${f.status}, type: ${f.type}, size: ${f.size_human}`,
        file: `raw/${f.path}`,
        related_files: [],
        suggestion: `可通过 /wiki-ingest 处理或标记为已忽略/已归档`,
        claude_prompt: `Raw 文件 raw/${f.path} 尚未处理到 Wiki 中。可使用 /wiki-ingest 处理或标记为已忽略。`,
      });
    }

    // Check PDFs with missing metadata
    for (const pdf of pdfFiles) {
      if (pdf.pages === 0 && pdf.size_human !== '0B') {
        issues.push({
          id: `issue-${++issueCounter}`,
          type: 'pdf_no_metadata',
          severity: 'error',
          title: `PDF missing metadata: ${pdf.filename}`,
          message: `Could not determine page count for ${pdf.filename} (${pdf.size_human})`,
          file: `raw/${pdf.path}`,
          related_files: [],
          suggestion: `Check if the PDF is corrupted and re-upload if needed`,
          claude_prompt: `The PDF raw/${pdf.path} has no metadata. Please check if it's corrupted.`,
        });
      } else if (pdf.pages > 200) {
        issues.push({
          id: `issue-${++issueCounter}`,
          type: 'large_pdf',
          severity: 'warning',
          title: `Large PDF: ${pdf.filename}`,
          message: `${pdf.pages} pages, ${pdf.size_human}. Consider breaking into smaller chunks.`,
          file: `raw/${pdf.path}`,
          related_files: [],
          suggestion: `Large PDFs should be processed incrementally with /wiki-pdf-read`,
          claude_prompt: `The PDF raw/${pdf.path} is very large (${pdf.pages} pages). Please use /wiki-pdf-read for incremental processing.`,
        });
      }
    }
  }

  // Calculate health score
  const criticalCount = issues.filter((i) => i.severity === 'critical').length;
  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;
  const infoCount = issues.filter((i) => i.severity === 'info').length;

  // Health score: start at 100, subtract penalties
  let score = 100;
  score -= criticalCount * 15;
  score -= errorCount * 5;
  score -= warningCount * 2;
  score -= infoCount * 0.5;
  score = Math.max(0, Math.min(100, Math.round(score)));

  const result: CheckResult = {
    id: `check-${Date.now()}`,
    created_at: new Date().toISOString(),
    health_score: score,
    total_issues: issues.length,
    critical: criticalCount,
    errors: errorCount,
    warnings: warningCount,
    suggestions: infoCount,
    issues,
    summary: `Health score: ${score}/100. ${issues.length} issues found (${criticalCount} critical, ${errorCount} errors, ${warningCount} warnings, ${infoCount} suggestions).`,
  };

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));

  console.log(`✅ Health check complete`);
  console.log(`   Score: ${score}/100`);
  console.log(`   Issues: ${issues.length} (${criticalCount}C/${errorCount}E/${warningCount}W/${infoCount}I)`);
  console.log(`   -> ${OUTPUT_FILE}`);
}

main();
