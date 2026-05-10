/**
 * server/src/index.ts
 * Main Express server for Wiki Chat Workbench
 */
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

import { conversationStore, archiveStore, reviewStore, messageStore, researchRunStore, evidencePackStore, getWikiIndex, getSourceIndex, getCheckResult } from './dataStore.js';
import { getPdfInfo, readPdfPages, detectPdfRisk } from './pdfSafeReader.js';
import { chat, chatStream, buildSystemPrompt } from './llmClient.js';
import { buildChatContext, maybeSaveEvidencePack, saveResearchRun, type Citation, type SearchTrace } from './contextSearch.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);
const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// File upload config
const RAW_DIR = path.resolve(MODULE_DIR, '..', '..', 'raw');
const INBOX_DIR = path.join(RAW_DIR, 'inbox');
fs.mkdirSync(INBOX_DIR, { recursive: true });

const upload = multer({
  dest: INBOX_DIR,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  preservePath: true,
});

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function citationPdfRefs(citations: Citation[]): { path: string; pages: number[] }[] {
  const refs = new Map<string, Set<number>>();
  for (const citation of citations) {
    if (citation.type !== 'pdf' || !citation.path) continue;
    if (!refs.has(citation.path)) refs.set(citation.path, new Set());
    for (const page of citation.pages || []) refs.get(citation.path)!.add(page);
  }
  return [...refs.entries()].map(([path, pages]) => ({
    path,
    pages: [...pages].sort((a, b) => a - b),
  }));
}

function citationRawPaths(citations: Citation[]): string[] {
  return uniqueStrings(citations
    .filter((citation) => citation.type === 'raw' || citation.type === 'pdf')
    .map((citation) => citation.path));
}

function citationWikiPaths(citations: Citation[]): string[] {
  return uniqueStrings(citations
    .filter((citation) => citation.type === 'wiki')
    .map((citation) => citation.path));
}

function createAutoReviewItem(params: {
  conversation_id: string;
  message: string;
  assistantContent: string;
  citations: Citation[];
  trace: SearchTrace;
}) {
  if (!params.trace.auto_context_used || params.assistantContent.length < 80) return null;

  const id = uuidv4();
  const item = {
    id,
    type: 'improve_summary',
    title: `沉淀自动检索问答: ${params.message.slice(0, 40)}`,
    source_conversation_id: params.conversation_id,
    target_page: 'wiki/syntheses/',
    related_raw_files: citationRawPaths(params.citations),
    related_pdf_pages: citationPdfRefs(params.citations),
    severity: 'medium',
    status: 'pending',
    summary: `自动检索命中 ${params.trace.selected_source_chunks.length} 个 source chunk、${params.trace.selected_wiki_pages.length} 个 Wiki 页面。`,
    claude_prompt: [
      '# Wiki Review Task',
      '',
      `Question: ${params.message}`,
      '',
      'Review the answer against the cited source chunks, then decide whether to create or update a Wiki concept/synthesis page.',
      '',
      `Answer excerpt: ${params.assistantContent.slice(0, 800)}`,
      '',
      `Citations: ${params.citations.map((c) => `${c.type}:${c.path}${c.pages?.length ? ` p.${c.pages.join(',')}` : ''}`).join('; ')}`,
    ].join('\n'),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  reviewStore.update((d) => {
    const duplicate = d.review_items.find((r: any) =>
      r.source_conversation_id === params.conversation_id &&
      r.title === item.title
    );
    if (!duplicate) d.review_items.unshift(item);
    return d;
  });
  return item;
}

function applyConversationContextMetadata(c: Record<string, any>, message: string, citations: Citation[]) {
  c.updated_at = new Date().toISOString();
  c.message_count = Number(c.message_count ?? 0) + 2;
  c.last_summary = message.slice(0, 100);
  c.has_raw = Boolean(c.has_raw || citationRawPaths(citations).length > 0);
  c.has_pdf = Boolean(c.has_pdf || citationPdfRefs(citations).length > 0);
  c.related_raw_files = uniqueStrings([...(c.related_raw_files || []), ...citationRawPaths(citations)]);
  c.related_wiki_pages = uniqueStrings([...(c.related_wiki_pages || []), ...citationWikiPaths(citations)]);
  c.related_pdf_pages = citationPdfRefs(citations);
  return c;
}

// ============================================================
// Index Summary
// ============================================================
app.get('/api/index/summary', (_req, res) => {
  const wikiIndex = getWikiIndex();
  const sourceIndex = getSourceIndex();
  const conversations = conversationStore.read().conversations;
  const reviews = reviewStore.read().review_items;
  const checkResult = getCheckResult();

  res.json({
    wiki_page_count: (wikiIndex as any)?.total_pages ?? 0,
    raw_file_count: (sourceIndex as any)?.raw_files?.length ?? 0,
    pdf_count: (sourceIndex as any)?.pdf_files?.length ?? 0,
    inbox_count: 0,
    review_item_count: reviews.length,
    last_check: checkResult,
    recent_conversations: conversations.slice(0, 10),
  });
});

// ============================================================
// Conversations
// ============================================================
app.get('/api/conversations', (_req, res) => {
  const data = conversationStore.read();
  res.json(data.conversations);
});

app.post('/api/conversations', (_req, res) => {
  const conv = {
    id: uuidv4(),
    title: 'New Chat',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'active',
    message_count: 0,
    has_raw: false,
    has_pdf: false,
    has_wiki_update: false,
    archived: false,
    related_raw_files: [],
    related_wiki_pages: [],
    related_pdf_pages: [],
    last_summary: '',
  };
  conversationStore.update((d) => {
    d.conversations.unshift(conv);
    return d;
  });
  res.status(201).json(conv);
});

app.get('/api/conversations/:id', (req, res) => {
  const data = conversationStore.read();
  const conv = data.conversations.find((c: any) => c.id === req.params.id);
  if (!conv) return res.status(404).json({ error: 'Conversation not found' });

  // Get messages for this conversation
  const msgs = messageStore.read().messages.filter(
    (m: any) => m.conversation_id === req.params.id
  );
  res.json({ ...conv, messages: msgs });
});

app.patch('/api/conversations/:id', (req, res) => {
  const { title, status, archived } = req.body;
  const conv = conversationStore.update((d) => {
    const idx = d.conversations.findIndex((c: any) => c.id === req.params.id);
    if (idx === -1) return d;
    const c = d.conversations[idx] as any;
    if (title !== undefined) c.title = title;
    if (status !== undefined) c.status = status;
    if (archived !== undefined) c.archived = archived;
    c.updated_at = new Date().toISOString();
    d.conversations[idx] = c;
    return d;
  });
  const updated = conv.conversations.find((c: any) => c.id === req.params.id);
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
});

app.delete('/api/conversations/:id', (req, res) => {
  conversationStore.update((d) => ({
    conversations: d.conversations.filter((c: any) => c.id !== req.params.id),
  }));
  // Also delete messages
  messageStore.update((d) => ({
    messages: d.messages.filter((m: any) => m.conversation_id !== req.params.id),
  }));
  res.json({ deleted: true });
});

// ============================================================
// Chat
// ============================================================
app.post('/api/chat', async (req, res) => {
  try {
    const {
      conversation_id,
      message,
      wiki_pages = [],
      raw_files = [],
      pdf_pages = [],
    } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let convId = conversation_id;

    // Auto-create conversation if not provided
    if (!convId) {
      const conv = {
        id: uuidv4(),
        title: message.slice(0, 50),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'active',
        message_count: 0,
        has_raw: raw_files.length > 0,
        has_pdf: pdf_pages.length > 0,
        has_wiki_update: false,
        archived: false,
        related_raw_files: raw_files || [],
        related_wiki_pages: wiki_pages || [],
        related_pdf_pages: pdf_pages || [],
        last_summary: '',
      };
      conversationStore.update((d) => {
        d.conversations.unshift(conv);
        return d;
      });
      convId = conv.id;
    }

    // Save user message
    const userMsg = {
      id: uuidv4(),
      conversation_id: convId,
      role: 'user',
      content: message,
      created_at: new Date().toISOString(),
      related_files: raw_files,
    };
    messageStore.update((d) => {
      d.messages.push(userMsg);
      return d;
    });

    // Load manual context and append high-confidence automatic retrieval.
    let {
      wikiContent,
      pdfContent,
      citations,
      trace: searchTrace,
    } = buildChatContext({
      query: message,
      wiki_pages,
      raw_files,
      pdf_pages,
      allowAuto: true,
    });

    // Build chat messages
    const systemPrompt = buildSystemPrompt(wikiContent, pdfContent);

    const previousMessages = messageStore.read().messages
      .filter((m: any) => m.conversation_id === convId)
      .filter((m: any) => m.id !== userMsg.id)
      .slice(-10) // last 10 messages for context
      .map((m: any) => ({ role: m.role, content: m.content }));

    const chatMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...previousMessages,
      { role: 'user' as const, content: message },
    ];

    // Estimate total context
    let contextEstimate = chatMessages.reduce(
      (sum, m) => sum + m.content.length, 0
    );

    // Check context limit
    const MAX_CONTEXT = 60000;
    if (contextEstimate > MAX_CONTEXT) {
      // Try with shorter wiki content
      wikiContent = wikiContent.map((c) => c.slice(0, 2000));
      pdfContent = pdfContent.map((c) => ({ ...c, text: c.text.slice(0, 4000) }));
      const slimSystem = buildSystemPrompt(wikiContent, pdfContent);
      chatMessages[0] = { role: 'system', content: slimSystem };
      contextEstimate = chatMessages.reduce((sum, m) => sum + m.content.length, 0);
    }

    // Call LLM
    let assistantContent: string;
    let modelName = 'deepseek-chat';
    let errorMsg: string | undefined;

    try {
      const response = await chat({
        messages: chatMessages,
        temperature: 0.7,
        max_tokens: 4096,
      });
      assistantContent = response.content;
      modelName = response.model;
    } catch (err: any) {
      errorMsg = `LLM call failed: ${err.message}`;
      assistantContent = `Sorry, I encountered an error: ${err.message}\n\nPlease check that your API key is configured correctly in the DEEPSEEK_API_KEY environment variable.`;
    }

    // Save assistant message
    const assistantMsg = {
      id: uuidv4(),
      conversation_id: convId,
      role: 'assistant',
      content: assistantContent,
      created_at: new Date().toISOString(),
      citations,
      search_trace: searchTrace,
      related_pdf_pages: citationPdfRefs(citations),
      model: modelName,
      token_estimate: contextEstimate,
    };
    messageStore.update((d) => {
      d.messages.push(assistantMsg);
      return d;
    });

    saveResearchRun(searchTrace, {
      conversation_id: convId,
      user_message_id: userMsg.id,
      assistant_message_id: assistantMsg.id,
      citations,
      token_estimate: contextEstimate,
    });
    const evidencePack = maybeSaveEvidencePack(searchTrace, citations);
    const reviewItem = createAutoReviewItem({
      conversation_id: convId,
      message,
      assistantContent,
      citations,
      trace: searchTrace,
    });

    // Generate archive
    const archiveId = uuidv4();
    const archiveConv = {
      id: archiveId,
      conversation_id: convId,
      created_at: new Date().toISOString(),
      steps: [
        {
          id: uuidv4(),
          type: 'user_input',
          title: 'User Input',
          status: 'completed',
          started_at: new Date().toISOString(),
          finished_at: new Date().toISOString(),
          summary: `User asked: "${message.slice(0, 100)}${message.length > 100 ? '...' : ''}"`,
          details: {
            raw_question: message,
            has_attachments: raw_files.length > 0 || pdf_pages.length > 0,
            wiki_scope: wiki_pages,
            pdf_page_range: pdf_pages,
          },
          related_files: raw_files,
          related_pages: wiki_pages,
        },
        {
          id: uuidv4(),
          type: 'context_selection',
          title: 'Context Selection',
          status: 'completed',
          started_at: new Date().toISOString(),
          finished_at: new Date().toISOString(),
          summary: `Used ${wikiContent.length} wiki context blocks, ${pdfContent.length} source blocks; auto retrieval ${searchTrace.auto_context_used ? 'enabled' : 'not used'}`,
          details: {
            wiki_pages_used: wiki_pages,
            raw_files_used: raw_files,
            pdf_ranges: pdf_pages,
            citations,
            search_trace: searchTrace,
            evidence_pack_id: evidencePack?.id,
            truncated: contextEstimate > MAX_CONTEXT,
          },
          related_files: citationRawPaths(citations),
          related_pages: citationWikiPaths(citations),
        },
        {
          id: uuidv4(),
          type: 'model_analysis',
          title: 'Model Analysis',
          status: errorMsg ? 'error' : 'completed',
          started_at: new Date().toISOString(),
          finished_at: new Date().toISOString(),
          summary: `Model: ${modelName}. Input: ~${Math.round(contextEstimate / 1000)}K chars. Output: ~${Math.round(assistantContent.length / 1000)}K chars.`,
          details: {
            model: modelName,
            input_estimate: contextEstimate,
            output_estimate: assistantContent.length,
            error: errorMsg,
          },
          related_files: [],
          related_pages: [],
        },
        {
          id: uuidv4(),
          type: 'wiki_update_proposal',
          title: 'Wiki Update Proposals',
          status: 'completed',
          started_at: new Date().toISOString(),
          finished_at: new Date().toISOString(),
          summary: 'No automatic proposals generated (first version - manual only)',
          details: { proposals: [] },
          related_files: [],
          related_pages: [],
        },
        {
          id: uuidv4(),
          type: 'review_status',
          title: 'Review Status',
          status: 'pending',
          started_at: new Date().toISOString(),
          summary: reviewItem ? 'Automatic retrieval answer queued for manual Wiki review' : 'Pending manual review',
          details: {
            needs_review: Boolean(reviewItem),
            review_item_id: reviewItem?.id,
            risk_level: 'low',
            pending_items: reviewItem ? ['Verify answer against citations and wikify durable conclusion'] : ['Manual verification of LLM response accuracy'],
          },
          related_files: [],
          related_pages: [],
        },
        {
          id: uuidv4(),
          type: 'writeback_status',
          title: 'Writeback Status',
          status: 'pending',
          started_at: new Date().toISOString(),
          summary: 'Not applied (proposal only mode)',
          details: { status: 'not_applied', reason: 'First version operates in proposal-only mode' },
          related_files: [],
          related_pages: [],
        },
        {
          id: uuidv4(),
          type: 'followup_tasks',
          title: 'Follow-up Tasks',
          status: 'pending',
          started_at: new Date().toISOString(),
          summary: 'Claude Code prompt generated for manual processing',
          details: {
            generated_prompt: `# Wiki Update Task from Conversation\n\nReview this conversation and:\n1. Verify the assistant's response against source documents\n2. If the response contains valuable new insights, create or update wiki pages\n3. Add any missing wikilinks\n4. Run /wiki-lint after changes\n\n## Conversation Summary\n\nQuestion: ${message.slice(0, 200)}\n\nAnswer: ${assistantContent.slice(0, 500)}\n\n## Citations\n${citations.map((c) => `- ${c.type}: ${c.path}${c.pages?.length ? ` p.${c.pages.join(',')}` : ''}`).join('\n')}`,
          },
          related_files: [],
          related_pages: [],
        },
      ],
      context_summary: `Wiki pages: ${citationWikiPaths(citations).join(', ') || 'none'}. Sources: ${citationRawPaths(citations).join(', ') || 'none'}`,
      raw_files: citationRawPaths(citations),
      wiki_pages: citationWikiPaths(citations),
      pdf_refs: citationPdfRefs(citations),
      search_trace: searchTrace,
      model_runs: [{
        model: modelName,
        input_estimate: contextEstimate,
        output_estimate: assistantContent.length,
        error: errorMsg,
      }],
      update_proposals: [],
      review_items: reviewItem ? [reviewItem.id] : [],
      writeback_status: 'not_applied',
      generated_prompt: '',
    };

    archiveStore.update((d) => {
      d.archives.push(archiveConv);
      return d;
    });

    // Update conversation metadata
    const convData = conversationStore.update((d) => {
      const idx = d.conversations.findIndex((c: any) => c.id === convId);
      if (idx === -1) return d;
      d.conversations[idx] = applyConversationContextMetadata(d.conversations[idx] as any, message, citations);
      return d;
    });
    const updatedConversation = convData.conversations.find((c: any) => c.id === convId);

    res.json({
      message: assistantMsg,
      conversation: updatedConversation,
      archive_id: archiveId,
      update_proposals: [],
    });
  } catch (err: any) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// ============================================================
// Chat Stream (SSE)
// ============================================================
app.post('/api/chat/stream', async (req, res) => {
  try {
    const {
      conversation_id,
      message,
      wiki_pages = [],
      raw_files = [],
      pdf_pages = [],
    } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const sendSSE = (event: string, data: any) => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };
    let sentThinkingStatus = false;
    const sendThinkingStatus = () => {
      if (sentThinkingStatus || res.writableEnded) return;
      sentThinkingStatus = true;
      sendSSE('status', { phase: 'thinking', message: '正在思考...' });
    };

    let convId = conversation_id;
    let createdConversation: Record<string, unknown> | null = null;
    if (!convId) {
      const conv = {
        id: uuidv4(),
        title: message.slice(0, 50),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'active',
        message_count: 0,
        has_raw: raw_files.length > 0,
        has_pdf: pdf_pages.length > 0,
        has_wiki_update: false,
        archived: false,
        related_raw_files: raw_files || [],
        related_wiki_pages: wiki_pages || [],
        related_pdf_pages: pdf_pages || [],
        last_summary: '',
      };
      conversationStore.update((d) => {
        d.conversations.unshift(conv);
        return d;
      });
      convId = conv.id;
      createdConversation = conv;
    }

    // Save user message
    const userMsg = {
      id: uuidv4(),
      conversation_id: convId,
      role: 'user',
      content: message,
      created_at: new Date().toISOString(),
    };
    messageStore.update((d) => {
      d.messages.push(userMsg);
      return d;
    });

    sendSSE('conv_id', { conversation_id: convId, conversation: createdConversation });
    sendSSE('user_msg', userMsg);
    sendThinkingStatus();

    let {
      wikiContent,
      pdfContent,
      citations,
      trace: searchTrace,
    } = buildChatContext({
      query: message,
      wiki_pages,
      raw_files,
      pdf_pages,
      allowAuto: true,
    });

    const systemPrompt = buildSystemPrompt(wikiContent, pdfContent);

    const previousMessages = messageStore.read().messages
      .filter((m: any) => m.conversation_id === convId)
      .filter((m: any) => m.id !== userMsg.id)
      .slice(-10)
      .map((m: any) => ({ role: m.role, content: m.content }));

    const chatMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...previousMessages,
      { role: 'user' as const, content: message },
    ];

    const MAX_CONTEXT = 60000;
    let contextEstimate = chatMessages.reduce((sum, m) => sum + m.content.length, 0);
    if (contextEstimate > MAX_CONTEXT) {
      wikiContent = wikiContent.map((c) => c.slice(0, 2000));
      pdfContent = pdfContent.map((c) => ({ ...c, text: c.text.slice(0, 4000) }));
      chatMessages[0] = { role: 'system', content: buildSystemPrompt(wikiContent, pdfContent) };
      contextEstimate = chatMessages.reduce((sum, m) => sum + m.content.length, 0);
    }

    // Call LLM and forward real streaming tokens.
    try {
      let fullContent = '';
      const response = await chatStream({
        messages: chatMessages,
        temperature: 0.7,
        max_tokens: 4096,
        onToken: (content) => {
          fullContent += content;
          if (!res.writableEnded) {
            sendSSE('token', { content });
          }
        },
        onThinking: sendThinkingStatus,
      });

      fullContent = response.content || fullContent;
      if (!fullContent.trim()) {
        throw new Error(`模型返回了空内容，未保存 assistant 消息。model=${response.model}`);
      }

      const assistantMsg = {
        id: uuidv4(),
        conversation_id: convId,
        role: 'assistant',
        content: fullContent,
        created_at: new Date().toISOString(),
        citations,
        search_trace: searchTrace,
        related_pdf_pages: citationPdfRefs(citations),
        model: response.model,
        token_estimate: contextEstimate,
      };
      messageStore.update((d) => {
        d.messages.push(assistantMsg);
        return d;
      });

      saveResearchRun(searchTrace, {
        conversation_id: convId,
        user_message_id: userMsg.id,
        assistant_message_id: assistantMsg.id,
        citations,
        token_estimate: contextEstimate,
      });
      const evidencePack = maybeSaveEvidencePack(searchTrace, citations);
      const reviewItem = createAutoReviewItem({
        conversation_id: convId,
        message,
        assistantContent: fullContent,
        citations,
        trace: searchTrace,
      });

      const archiveId = uuidv4();
      const archiveConv = {
        id: archiveId,
        conversation_id: convId,
        created_at: new Date().toISOString(),
        steps: [
          {
            id: uuidv4(),
            type: 'user_input',
            title: 'User Input',
            status: 'completed',
            started_at: new Date().toISOString(),
            finished_at: new Date().toISOString(),
            summary: `User asked: "${message.slice(0, 100)}${message.length > 100 ? '...' : ''}"`,
            details: { raw_question: message, wiki_scope: wiki_pages, pdf_page_range: pdf_pages },
            related_files: raw_files,
            related_pages: wiki_pages,
          },
          {
            id: uuidv4(),
            type: 'context_selection',
            title: 'Context Selection',
            status: 'completed',
            started_at: new Date().toISOString(),
            finished_at: new Date().toISOString(),
            summary: `Used ${wikiContent.length} wiki context blocks, ${pdfContent.length} source blocks; auto retrieval ${searchTrace.auto_context_used ? 'enabled' : 'not used'}`,
            details: {
              wiki_pages_used: wiki_pages,
              raw_files_used: raw_files,
              pdf_ranges: pdf_pages,
              citations,
              search_trace: searchTrace,
              evidence_pack_id: evidencePack?.id,
              truncated: contextEstimate > MAX_CONTEXT,
            },
            related_files: citationRawPaths(citations),
            related_pages: citationWikiPaths(citations),
          },
          {
            id: uuidv4(),
            type: 'model_analysis',
            title: 'Model Analysis',
            status: 'completed',
            started_at: new Date().toISOString(),
            finished_at: new Date().toISOString(),
            summary: `Model: ${response.model}. Input: ~${Math.round(contextEstimate / 1000)}K chars. Output: ~${Math.round(fullContent.length / 1000)}K chars.`,
            details: { model: response.model, input_estimate: contextEstimate, output_estimate: fullContent.length },
            related_files: [],
            related_pages: [],
          },
          {
            id: uuidv4(),
            type: 'review_status',
            title: 'Review Status',
            status: reviewItem ? 'pending' : 'completed',
            started_at: new Date().toISOString(),
            summary: reviewItem ? 'Automatic retrieval answer queued for manual Wiki review' : 'No automatic review item generated',
            details: { needs_review: Boolean(reviewItem), review_item_id: reviewItem?.id },
            related_files: citationRawPaths(citations),
            related_pages: citationWikiPaths(citations),
          },
        ],
        context_summary: `Wiki pages: ${citationWikiPaths(citations).join(', ') || 'none'}. Sources: ${citationRawPaths(citations).join(', ') || 'none'}`,
        raw_files: citationRawPaths(citations),
        wiki_pages: citationWikiPaths(citations),
        pdf_refs: citationPdfRefs(citations),
        search_trace: searchTrace,
        model_runs: [{
          model: response.model,
          input_estimate: contextEstimate,
          output_estimate: fullContent.length,
        }],
        update_proposals: [],
        review_items: reviewItem ? [reviewItem.id] : [],
        writeback_status: 'not_applied',
        generated_prompt: '',
      };

      archiveStore.update((d) => {
        d.archives.push(archiveConv);
        return d;
      });

      const convData = conversationStore.update((d) => {
        const idx = d.conversations.findIndex((c: any) => c.id === convId);
        if (idx >= 0) {
          d.conversations[idx] = applyConversationContextMetadata(d.conversations[idx] as any, message, citations);
        }
        return d;
      });
      const updatedConversation = convData.conversations.find((c: any) => c.id === convId);

      sendSSE('done', {
        message: assistantMsg,
        conversation: updatedConversation,
        message_id: assistantMsg.id,
        full_content: fullContent,
        archive_id: archiveId,
        search_trace: searchTrace,
      });
      res.end();
    } catch (err: any) {
      conversationStore.update((d) => {
        const idx = d.conversations.findIndex((c: any) => c.id === convId);
        if (idx >= 0) {
          const c = d.conversations[idx] as Record<string, any>;
          c.updated_at = new Date().toISOString();
          c.message_count = Number(c.message_count ?? 0) + 1;
          c.last_summary = message.slice(0, 100);
          d.conversations[idx] = c;
        }
        return d;
      });
      sendSSE('error', { message: err.message || String(err) });
      res.end();
    }
  } catch (err: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error', details: err.message });
    }
  }
});

// ============================================================
// Archive
// ============================================================
app.get('/api/conversations/:id/archive', (req, res) => {
  const data = archiveStore.read();
  const archive = data.archives.find(
    (a: any) => a.conversation_id === req.params.id
  );
  if (!archive) {
    // Generate empty archive
    const empty = {
      id: uuidv4(),
      conversation_id: req.params.id,
      created_at: new Date().toISOString(),
      steps: [],
      context_summary: 'No archive data available',
      raw_files: [],
      wiki_pages: [],
      pdf_refs: [],
      model_runs: [],
      update_proposals: [],
      review_items: [],
      writeback_status: 'not_applied' as const,
      generated_prompt: '',
    };
    return res.json(empty);
  }
  res.json(archive);
});

app.post('/api/conversations/:id/archive', (req, res) => {
  // Regenerate archive
  const data = archiveStore.read();
  const existing = data.archives.find(
    (a: any) => a.conversation_id === req.params.id
  );
  if (existing) {
    existing.created_at = new Date().toISOString();
    res.json(existing);
  } else {
    res.status(404).json({ error: 'No archive found' });
  }
});

// ============================================================
// Retrieval Evidence
// ============================================================
app.get('/api/research-runs', (req, res) => {
  const limit = Math.min(Math.max(parseInt(String(req.query.limit || '100'), 10) || 100, 1), 500);
  const query = String(req.query.q || '').trim().toLowerCase();
  const runs = researchRunStore.read().research_runs
    .filter((run: any) => {
      if (!query) return true;
      return String(run.query || '').toLowerCase().includes(query) ||
        String(run.normalized_query || '').toLowerCase().includes(query) ||
        (run.extracted_terms || []).some((term: string) => String(term).toLowerCase().includes(query));
    })
    .slice(0, limit);
  res.json(runs);
});

app.get('/api/research-runs/:id', (req, res) => {
  const run = researchRunStore.read().research_runs.find((item: any) => item.id === req.params.id);
  if (!run) return res.status(404).json({ error: 'Research run not found' });
  res.json(run);
});

app.get('/api/evidence-packs', (req, res) => {
  const limit = Math.min(Math.max(parseInt(String(req.query.limit || '100'), 10) || 100, 1), 500);
  const query = String(req.query.q || '').trim().toLowerCase();
  const packs = evidencePackStore.read().evidence_packs
    .filter((pack: any) => {
      if (!query) return true;
      return String(pack.topic_key || '').toLowerCase().includes(query) ||
        String(pack.query || '').toLowerCase().includes(query) ||
        String(pack.normalized_query || '').toLowerCase().includes(query);
    })
    .slice(0, limit);
  res.json(packs);
});

app.get('/api/evidence-packs/:id', (req, res) => {
  const pack = evidencePackStore.read().evidence_packs.find((item: any) => item.id === req.params.id);
  if (!pack) return res.status(404).json({ error: 'Evidence pack not found' });
  res.json(pack);
});

// ============================================================
// Raw Files
// ============================================================
app.get('/api/raw', (_req, res) => {
  const sourceIndex = getSourceIndex();
  if (!sourceIndex) return res.json({ raw_files: [], pdf_files: [] });
  res.json({
    raw_files: (sourceIndex as any).raw_files || [],
    pdf_files: (sourceIndex as any).pdf_files || [],
  });
});

app.post('/api/raw/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const file = req.file;
  const originalName = file.originalname;
  const destPath = path.join(INBOX_DIR, originalName);

  // If file already exists, append timestamp
  let finalPath = destPath;
  if (fs.existsSync(destPath)) {
    const ext = path.extname(originalName);
    const base = path.basename(originalName, ext);
    finalPath = path.join(INBOX_DIR, `${base}-${Date.now()}${ext}`);
  }

  fs.renameSync(file.path, finalPath);

  const rawFile = {
    id: uuidv4(),
    filename: path.basename(finalPath),
    original_name: originalName,
    path: path.relative(RAW_DIR, finalPath),
    type: getFileType(path.extname(finalPath)),
    mime: file.mimetype,
    size: file.size,
    size_human: formatSize(file.size),
    uploaded_at: new Date().toISOString(),
    indexed_at: new Date().toISOString(),
    status: 'new',
    metadata: {},
    linked_wiki_pages: [],
    related_conversations: [],
    summary: '',
    risk_level: 'low' as 'low' | 'medium' | 'high',
  };

  // Run pdfinfo if it's a PDF
  if (rawFile.type === 'pdf') {
    const info = getPdfInfo(path.relative(RAW_DIR, finalPath));
    if (info) {
      rawFile.metadata = {
        pages: info.pages,
        title: info.title,
        author: info.author,
        encrypted: info.encrypted,
      };
    }
    const risk = detectPdfRisk(path.relative(RAW_DIR, finalPath));
    rawFile.risk_level = risk.risk;
  }

  res.status(201).json(rawFile);
});

app.get('/api/raw/:id', (req, res) => {
  const sourceIndex = getSourceIndex();
  if (!sourceIndex) return res.status(404).json({ error: 'Source index not built' });
  const files = (sourceIndex as any).raw_files || [];
  const file = files.find((f: any) => f.id === req.params.id);
  if (!file) return res.status(404).json({ error: 'File not found' });
  res.json(file);
});

app.get('/api/raw/:id/preview', (req, res) => {
  const sourceIndex = getSourceIndex();
  if (!sourceIndex) return res.status(404).json({ error: 'Source index not built' });
  const files = (sourceIndex as any).raw_files || [];
  const file = files.find((f: any) => f.id === req.params.id);
  if (!file) return res.status(404).json({ error: 'File not found' });

  const filePath = path.join(RAW_DIR, file.path);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found on disk' });

  // For text-based files
  const textTypes = ['.md', '.txt', '.html', '.htm'];
  const ext = path.extname(filePath).toLowerCase();
  if (textTypes.includes(ext)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    res.json({ type: 'text', content: content.slice(0, 50000) });
  } else {
    res.json({ type: file.type, message: 'Preview not available for this file type' });
  }
});

// ============================================================
// PDF
// ============================================================
app.get('/api/pdf', (_req, res) => {
  const sourceIndex = getSourceIndex();
  if (!sourceIndex) return res.json([]);
  res.json((sourceIndex as any).pdf_files || []);
});

app.get('/api/pdf/:id/info', (req, res) => {
  const sourceIndex = getSourceIndex();
  if (!sourceIndex) return res.status(404).json({ error: 'Source index not built' });
  const pdfs = (sourceIndex as any).pdf_files || [];
  const pdf = pdfs.find((p: any) => p.id === req.params.id);
  if (!pdf) return res.status(404).json({ error: 'PDF not found' });

  // Refresh info
  const refreshed = getPdfInfo(pdf.path);
  res.json({ ...pdf, ...refreshed });
});

app.post('/api/pdf/:id/read-pages', (req, res) => {
  const { startPage, endPage } = req.body;

  if (!startPage || !endPage) {
    return res.status(400).json({ error: 'startPage and endPage are required' });
  }

  const sourceIndex = getSourceIndex();
  if (!sourceIndex) return res.status(404).json({ error: 'Source index not built' });
  const pdfs = (sourceIndex as any).pdf_files || [];
  const pdf = pdfs.find((p: any) => p.id === req.params.id);
  if (!pdf) return res.status(404).json({ error: 'PDF not found' });

  const result = readPdfPages(pdf.path, parseInt(startPage, 10), parseInt(endPage, 10));

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  res.json(result);
});

app.get('/api/pdf/:id/file', (req, res) => {
  const sourceIndex = getSourceIndex();
  if (!sourceIndex) return res.status(404).json({ error: 'Source index not built' });
  const pdfs = (sourceIndex as any).pdf_files || [];
  const pdf = pdfs.find((p: any) => p.id === req.params.id);
  if (!pdf) return res.status(404).json({ error: 'PDF not found' });

  const filePath = path.join(RAW_DIR, pdf.path);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found on disk' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${pdf.filename}"`);
  fs.createReadStream(filePath).pipe(res);
});

// ============================================================
// Check
// ============================================================
app.post('/api/check', (_req, res) => {
  try {
    const scriptsDir = path.resolve(MODULE_DIR, '..', '..', 'scripts');
    execSync(
      `npx tsx ${path.join(scriptsDir, 'check-wiki-health.ts')}`,
      { encoding: 'utf-8', timeout: 30000, cwd: path.resolve(MODULE_DIR, '..', '..') }
    );
    const result = getCheckResult();
    res.json(result);
  } catch (err: any) {
    // Try running check in-process
    res.status(500).json({ error: 'Check execution failed', details: err.message });
  }
});

app.get('/api/check/latest', (_req, res) => {
  const result = getCheckResult();
  if (!result) return res.status(404).json({ error: 'No check results found. Run a check first.' });
  res.json(result);
});

// ============================================================
// Review
// ============================================================
app.get('/api/review', (_req, res) => {
  const data = reviewStore.read();
  res.json(data.review_items);
});

app.post('/api/review', (req, res) => {
  const item = {
    id: uuidv4(),
    ...req.body,
    status: req.body.status || 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  reviewStore.update((d) => {
    d.review_items.unshift(item);
    return d;
  });
  res.status(201).json(item);
});

app.patch('/api/review/:id', (req, res) => {
  const review = reviewStore.update((d) => {
    const idx = d.review_items.findIndex((r: any) => r.id === req.params.id);
    if (idx === -1) return d;
    d.review_items[idx] = { ...d.review_items[idx], ...req.body, updated_at: new Date().toISOString() };
    return d;
  });
  const updated = review.review_items.find((r: any) => r.id === req.params.id);
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
});

// ============================================================
// Prompt Generation
// ============================================================
app.post('/api/prompt/generate', (req, res) => {
  const { conversation_id, check_issues } = req.body;

  let prompt = '# Wiki Update Tasks\n\n';

  if (conversation_id) {
    const convData = conversationStore.read();
    const conv = convData.conversations.find((c: any) => c.id === conversation_id);
    if (conv) {
      const msgs = messageStore.read().messages.filter(
        (m: any) => m.conversation_id === conversation_id
      );
      const question = msgs.find((m: any) => m.role === 'user');
      const answer = msgs.find((m: any) => m.role === 'assistant');

      prompt += `## From Conversation: ${(conv as any).title || 'Untitled'}\n\n`;
      if (question) {
        prompt += `**Question:** ${(question as any).content.slice(0, 500)}\n\n`;
      }
      if (answer) {
        prompt += `**Answer:** ${(answer as any).content.slice(0, 1000)}\n\n`;
      }
      prompt += `## Tasks\n\n`;
      prompt += `1. Review the assistant's response for accuracy against source documents\n`;
      prompt += `2. If new insights are found, create wiki pages in the appropriate directory:\n`;
      prompt += `   - summaries/ for document summaries\n`;
      prompt += `   - entities/ for new clusters, devices, or spec versions\n`;
      prompt += `   - concepts/ for new concepts or mechanisms\n`;
      prompt += `   - comparisons/ for version comparisons\n`;
      prompt += `3. Update index.md to include new pages\n`;
      prompt += `4. Add wikilinks from existing pages to new pages\n`;
      prompt += `5. Run /wiki-lint after changes\n`;
      prompt += `6. Update changelog.md\n`;

      if ((conv as any).related_raw_files?.length > 0) {
        prompt += `\n## Related Raw Files\n${(conv as any).related_raw_files.map((f: string) => `- ${f}`).join('\n')}\n`;
      }
    }
  }

  if (check_issues && Array.isArray(check_issues)) {
    prompt += `\n## Health Check Issues to Fix\n\n`;
    for (const issue of check_issues) {
      prompt += `- [ ] **${issue.title}**: ${issue.message}\n  File: ${issue.file}\n  Fix: ${issue.suggestion}\n\n`;
    }
  }

  res.json({ prompt });
});

// ============================================================
// Static files for frontend (production)
// ============================================================
const frontendDist = path.resolve(MODULE_DIR, '..', '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// ============================================================
// Start
// ============================================================
app.listen(PORT, () => {
  console.log(`\n🔧 Wiki Chat Workbench Server`);
  console.log(`   → http://localhost:${PORT}`);
  console.log(`   → API: http://localhost:${PORT}/api/index/summary`);
  console.log(`   → DEEPSEEK_API_KEY: ${process.env.DEEPSEEK_API_KEY ? '✅ configured' : '❌ not set'}`);
  console.log();
});

// Helper functions
function getFileType(ext: string): string {
  const map: Record<string, string> = {
    '.pdf': 'pdf', '.md': 'markdown', '.txt': 'text',
    '.html': 'text', '.htm': 'text', '.docx': 'docx',
    '.pptx': 'pptx', '.png': 'image', '.jpg': 'image',
    '.jpeg': 'image', '.gif': 'image', '.svg': 'image',
  };
  return map[ext.toLowerCase()] || 'other';
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
