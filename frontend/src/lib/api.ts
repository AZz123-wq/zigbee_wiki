/**
 * src/lib/api.ts
 * API client for Wiki Chat Workbench backend
 */

const BASE = '/api';

interface ChatStreamHandlers {
  onConversation?: (payload: any) => void;
  onUserMessage?: (message: any) => void;
  onAssistantMessage?: (message: any) => void;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// Index
export const getIndexSummary = () => request<any>('/index/summary');

// Conversations
export const getConversations = () => request<any[]>('/conversations');
export const createConversation = () => request<any>('/conversations', { method: 'POST' });
export const getConversation = (id: string) => request<any>(`/conversations/${id}`);
export const updateConversation = (id: string, data: any) =>
  request<any>(`/conversations/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteConversation = (id: string) =>
  request<any>(`/conversations/${id}`, { method: 'DELETE' });

// Chat
export const sendChat = (data: any) =>
  request<any>('/chat', { method: 'POST', body: JSON.stringify(data) });

export async function sendChatStream(
  data: any,
  onToken: (token: string) => void,
  onDone: (fullContent: string) => void,
  onError: (err: string) => void,
  signal?: AbortSignal,
  handlers: ChatStreamHandlers = {}
): Promise<void> {
  const res = await fetch(`${BASE}/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    signal,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Stream failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  const handleEventBlock = (block: string) => {
    const lines = block.split(/\r?\n/);
    let event = 'message';
    const dataLines: string[] = [];

    for (const line of lines) {
      if (line.startsWith('event:')) {
        event = line.slice(6).trim();
      } else if (line.startsWith('data:')) {
        dataLines.push(line.slice(5).trimStart());
      }
    }

    if (dataLines.length === 0) return;
    let parsed: any;
    try {
      parsed = JSON.parse(dataLines.join('\n'));
    } catch {
      return;
    }

    if (event === 'conv_id') {
      handlers.onConversation?.(parsed);
      return;
    }
    if (event === 'user_msg') {
      handlers.onUserMessage?.(parsed);
      return;
    }
    if (event === 'token') {
      if (parsed.content) onToken(parsed.content);
      return;
    }
    if (event === 'done') {
      if (parsed.message) handlers.onAssistantMessage?.(parsed.message);
      onDone(parsed.full_content || parsed.message?.content || '');
      return;
    }
    if (event === 'error') {
      const message = parsed.message || 'Stream failed';
      onError(message);
      throw new Error(message);
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split(/\r?\n\r?\n/);
    buffer = blocks.pop() || '';

    for (const block of blocks) {
      if (block.trim()) handleEventBlock(block);
    }
  }

  if (buffer.trim()) {
    handleEventBlock(buffer);
  }
}

// Archive
export const getArchive = (convId: string) => request<any>(`/conversations/${convId}/archive`);

// Raw files
export const getRawFiles = () => request<any>('/raw');
export const uploadRawFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return fetch(`${BASE}/raw/upload`, { method: 'POST', body: formData }).then((r) => r.json());
};
export const getRawFile = (id: string) => request<any>(`/raw/${id}`);
export const getRawPreview = (id: string) => request<any>(`/raw/${id}/preview`);

// PDF
export const getPdfs = () => request<any[]>('/pdf');
export const getPdfInfo = (id: string) => request<any>(`/pdf/${id}/info`);
export const readPdfPages = (id: string, startPage: number, endPage: number) =>
  request<any>(`/pdf/${id}/read-pages`, {
    method: 'POST',
    body: JSON.stringify({ startPage, endPage }),
  });
export const getPdfFileUrl = (id: string) => `${BASE}/pdf/${id}/file`;

// Check
export const runCheck = () => request<any>('/check', { method: 'POST' });
export const getLatestCheck = () => request<any>('/check/latest');

// Review
export const getReviews = () => request<any[]>('/review');
export const createReview = (data: any) =>
  request<any>('/review', { method: 'POST', body: JSON.stringify(data) });
export const updateReview = (id: string, data: any) =>
  request<any>(`/review/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

// Prompt
export const generatePrompt = (data: any) =>
  request<any>('/prompt/generate', { method: 'POST', body: JSON.stringify(data) });
