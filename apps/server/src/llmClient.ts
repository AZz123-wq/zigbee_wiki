/**
 * server/src/llmClient.ts
 * LLM client for DeepSeek API using child_process curl (works in WSL)
 */
import { execFile, spawn } from 'child_process';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const ANTHROPIC_BASE_URL = process.env.ANTHROPIC_BASE_URL || 'https://api.deepseek.com/v1';
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'deepseek-chat';

export interface ChatCompletionMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatParams {
  messages: ChatCompletionMessage[];
  temperature?: number;
  max_tokens?: number;
}

export interface ChatResponse {
  content: string;
  model: string;
  usage?: { prompt_tokens: number; completion_tokens: number };
  finish_reason?: string;
}

export interface ChatStreamParams extends ChatParams {
  onToken: (token: string) => void;
  onThinking?: () => void;
}

function extractChoiceText(choice: any): string {
  return (
    choice?.delta?.content ??
    choice?.message?.content ??
    choice?.text ??
    ''
  );
}

function extractChoiceReasoning(choice: any): string {
  return (
    choice?.delta?.reasoning_content ??
    choice?.message?.reasoning_content ??
    ''
  );
}

function isAnthropicEndpoint(baseUrl: string): boolean {
  return /\/anthropic\/?$/.test(baseUrl) || /\/messages\/?$/.test(baseUrl);
}

function anthropicUrl(baseUrl: string): string {
  return /\/messages\/?$/.test(baseUrl)
    ? baseUrl
    : `${baseUrl.replace(/\/$/, '')}/v1/messages`;
}

function toAnthropicMessages(messages: ChatCompletionMessage[]): {
  system?: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
} {
  const system = messages
    .filter((m) => m.role === 'system' && m.content.trim())
    .map((m) => m.content)
    .join('\n\n');

  return {
    system: system || undefined,
    messages: messages
      .filter((m) => m.role !== 'system' && m.content.trim())
      .map((m) => ({
        role: m.role === 'assistant' ? 'assistant' as const : 'user' as const,
        content: m.content,
      })),
  };
}

function extractAnthropicContent(result: any): string {
  const blocks = Array.isArray(result?.content) ? result.content : [];
  return blocks
    .map((block: any) => block?.text || '')
    .filter(Boolean)
    .join('');
}

function curlJson(url: string, body: object, apiKey: string, timeout = 45): Promise<any> {
  return new Promise((resolve, reject) => {
    const args = [
      '-s', url,
      '-H', 'Content-Type: application/json',
      '-H', `Authorization: Bearer ${apiKey}`,
      '-d', JSON.stringify(body),
      '--max-time', String(timeout),
    ];

    execFile('curl', args, { maxBuffer: 10 * 1024 * 1024 }, (err, stdout) => {
      if (err) {
        // Exit code 28 is timeout
        if ((err as any).code === 28 || (err as any).signal === 'SIGALRM') {
          return reject(new Error('API 请求超时'));
        }
        // Try to parse body even on error
        try {
          const parsed = JSON.parse(stdout);
          const msg = parsed.error?.message || parsed.message || err.message;
          return reject(new Error(msg));
        } catch {
          return reject(new Error(err.message || String(err)));
        }
      }
      try {
        resolve(JSON.parse(stdout));
      } catch {
        reject(new Error(`无法解析 API 响应: ${stdout.slice(0, 200)}`));
      }
    });
  });
}

export async function chat(params: ChatParams): Promise<ChatResponse> {
  const apiKey = DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY 未配置');
  }

  const baseUrl = ANTHROPIC_BASE_URL;
  const model = ANTHROPIC_MODEL;

  if (isAnthropicEndpoint(baseUrl)) {
    const anthropic = toAnthropicMessages(params.messages);
    const result = await curlJson(
      anthropicUrl(baseUrl),
      {
        model,
        messages: anthropic.messages,
        ...(anthropic.system ? { system: anthropic.system } : {}),
        max_tokens: params.max_tokens ?? 4096,
        stream: false,
      },
      apiKey,
      45
    );

    return {
      content: extractAnthropicContent(result),
      model: result.model || model,
      usage: result.usage,
      finish_reason: result.stop_reason,
    };
  }

  const result = await curlJson(
    `${baseUrl}/chat/completions`,
    {
      model,
      messages: params.messages,
      temperature: params.temperature ?? 0.7,
      max_tokens: params.max_tokens ?? 4096,
      stream: false,
    },
    apiKey,
    45
  );

  const choice = result.choices?.[0];
  return {
    content: choice?.message?.content || '',
    model: result.model || model,
    usage: result.usage,
    finish_reason: choice?.finish_reason,
  };
}

export function chatStream(params: ChatStreamParams): Promise<ChatResponse> {
  const apiKey = DEEPSEEK_API_KEY;
  if (!apiKey) {
    return Promise.reject(new Error('DEEPSEEK_API_KEY 未配置'));
  }

  const baseUrl = ANTHROPIC_BASE_URL;
  const model = ANTHROPIC_MODEL;
  if (isAnthropicEndpoint(baseUrl)) {
    return chatAnthropicStream(baseUrl, model, apiKey, params);
  }

  const body = {
    model,
    messages: params.messages,
    temperature: params.temperature ?? 0.7,
    max_tokens: params.max_tokens ?? 4096,
    stream: true,
  };

  return new Promise((resolve, reject) => {
    const args = [
      '-sS',
      '-N',
      `${baseUrl}/chat/completions`,
      '-H',
      'Content-Type: application/json',
      '-H',
      `Authorization: Bearer ${apiKey}`,
      '-d',
      JSON.stringify(body),
      '--max-time',
      '120',
    ];

    const child = spawn('curl', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let buffer = '';
    let stderr = '';
    let rawOutput = '';
    let content = '';
    let reasoningContent = '';
    let responseModel = model;
    let finishReason: string | undefined;
    let settled = false;
    const debugStream = process.env.LLM_STREAM_DEBUG === '1';
    const debugEvents: string[] = [];

    const fail = (err: Error) => {
      if (!settled) {
        settled = true;
        reject(err);
      }
    };

    const handleDataLine = (line: string) => {
      if (settled) return;
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data:')) return;

      const payload = trimmed.slice(5).trim();
      if (!payload || payload === '[DONE]') return;

      if (debugStream && debugEvents.length < 8) {
        debugEvents.push(payload.slice(0, 1000));
      }

      try {
        const parsed = JSON.parse(payload);
        if (parsed.error) {
          fail(new Error(parsed.error.message || parsed.error || 'API stream error'));
          return;
        }

        if (parsed.model) responseModel = parsed.model;
        const choice = parsed.choices?.[0];
        const token = extractChoiceText(choice);
        const reasoning = extractChoiceReasoning(choice);
        if (reasoning) {
          reasoningContent += reasoning;
          params.onThinking?.();
        }
        if (token) {
          content += token;
          params.onToken(token);
        }
        if (choice?.finish_reason) {
          finishReason = choice.finish_reason;
        }
      } catch {
        // Ignore partial or non-JSON stream lines. The buffer splitter preserves
        // incomplete lines until more data arrives.
      }
    };

    child.stdout.on('data', (chunk: Buffer) => {
      const text = chunk.toString('utf-8');
      rawOutput += text;
      buffer += text;
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || '';
      for (const line of lines) handleDataLine(line);
    });

    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf-8');
    });

    child.on('error', (err) => fail(err));

    child.on('close', (code) => {
      if (settled) return;
      if (buffer) handleDataLine(buffer);

      if (code !== 0) {
        try {
          const parsed = JSON.parse(rawOutput);
          const msg = parsed.error?.message || parsed.message;
          if (msg) return fail(new Error(msg));
        } catch {}
        return fail(new Error(stderr.trim() || `curl exited with code ${code}`));
      }

      if (!content && rawOutput.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(rawOutput);
          const msg = parsed.error?.message || parsed.message;
          if (msg) return fail(new Error(msg));
          if (parsed.model) responseModel = parsed.model;
          const choice = parsed.choices?.[0];
          const nonStreamContent = extractChoiceText(choice);
          if (nonStreamContent) {
            content = nonStreamContent;
            params.onToken(nonStreamContent);
          }
          const reasoning = extractChoiceReasoning(choice);
          if (reasoning) {
            reasoningContent = reasoning;
            params.onThinking?.();
          }
          if (choice?.finish_reason) {
            finishReason = choice.finish_reason;
          }
        } catch {}
      }

      if (!content) {
        const detailParts = [
          `model=${responseModel}`,
          finishReason ? `finish_reason=${finishReason}` : '',
          reasoningContent ? `reasoning_chars=${reasoningContent.length}` : '',
          stderr.trim() ? `stderr=${stderr.trim().slice(0, 300)}` : '',
          debugEvents.length > 0 ? `debug=${debugEvents.join(' | ')}` : '',
        ].filter(Boolean);
        return fail(new Error(`模型返回了空内容，未保存 assistant 消息。${detailParts.join('; ')}`));
      }

      settled = true;
      resolve({
        content,
        model: responseModel,
        finish_reason: finishReason,
      });
    });
  });
}

function chatAnthropicStream(
  baseUrl: string,
  model: string,
  apiKey: string,
  params: ChatStreamParams
): Promise<ChatResponse> {
  const anthropic = toAnthropicMessages(params.messages);
  const body = {
    model,
    messages: anthropic.messages,
    ...(anthropic.system ? { system: anthropic.system } : {}),
    max_tokens: params.max_tokens ?? 4096,
    stream: true,
  };

  return new Promise((resolve, reject) => {
    const args = [
      '-sS',
      '-N',
      anthropicUrl(baseUrl),
      '-H',
      'Content-Type: application/json',
      '-H',
      `Authorization: Bearer ${apiKey}`,
      '-H',
      'anthropic-version: 2023-06-01',
      '-d',
      JSON.stringify(body),
      '--max-time',
      '120',
    ];

    const child = spawn('curl', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let buffer = '';
    let stderr = '';
    let rawOutput = '';
    let content = '';
    let reasoningContent = '';
    let responseModel = model;
    let finishReason: string | undefined;
    let settled = false;
    const debugStream = process.env.LLM_STREAM_DEBUG === '1';
    const debugEvents: string[] = [];

    const fail = (err: Error) => {
      if (!settled) {
        settled = true;
        reject(err);
      }
    };

    const handleEventBlock = (block: string) => {
      if (settled) return;
      const lines = block.split(/\r?\n/);
      const dataLines: string[] = [];

      for (const line of lines) {
        if (line.startsWith('data:')) {
          dataLines.push(line.slice(5).trimStart());
        }
      }

      if (dataLines.length === 0) return;
      const payload = dataLines.join('\n');
      if (debugStream && debugEvents.length < 8) {
        debugEvents.push(payload.slice(0, 1000));
      }

      try {
        const parsed = JSON.parse(payload);
        if (parsed.error) {
          fail(new Error(parsed.error.message || parsed.error || 'API stream error'));
          return;
        }

        if (parsed.type === 'message_start' && parsed.message?.model) {
          responseModel = parsed.message.model;
        }
        if (parsed.type === 'message_delta' && parsed.delta?.stop_reason) {
          finishReason = parsed.delta.stop_reason;
        }
        if (parsed.type === 'content_block_delta') {
          const delta = parsed.delta || {};
          if (delta.type === 'text_delta' && delta.text) {
            content += delta.text;
            params.onToken(delta.text);
          } else if (delta.type === 'thinking_delta' && delta.thinking) {
            reasoningContent += delta.thinking;
            params.onThinking?.();
          }
        }
      } catch {
        // Ignore malformed debug/ping payloads.
      }
    };

    child.stdout.on('data', (chunk: Buffer) => {
      const text = chunk.toString('utf-8');
      rawOutput += text;
      buffer += text;
      const blocks = buffer.split(/\r?\n\r?\n/);
      buffer = blocks.pop() || '';
      for (const block of blocks) {
        if (block.trim()) handleEventBlock(block);
      }
    });

    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf-8');
    });

    child.on('error', (err) => fail(err));

    child.on('close', (code) => {
      if (settled) return;
      if (buffer.trim()) handleEventBlock(buffer);

      if (code !== 0) {
        return fail(new Error(stderr.trim() || `curl exited with code ${code}`));
      }

      if (!content) {
        const detailParts = [
          `model=${responseModel}`,
          finishReason ? `finish_reason=${finishReason}` : '',
          reasoningContent ? `reasoning_chars=${reasoningContent.length}` : '',
          stderr.trim() ? `stderr=${stderr.trim().slice(0, 300)}` : '',
          debugEvents.length > 0 ? `debug=${debugEvents.join(' | ')}` : '',
        ].filter(Boolean);
        return fail(new Error(`模型返回了空内容，未保存 assistant 消息。${detailParts.join('; ')}`));
      }

      settled = true;
      resolve({
        content,
        model: responseModel,
        finish_reason: finishReason,
      });
    });
  });
}

export function buildSystemPrompt(wikiPages: string[], pdfPages: { path: string; text: string; pages?: number[] }[]): string {
  let prompt = `你是一个 Zigbee 协议专家助手，基于本地 Wiki 知识库回答问题。

规则：
1. 只能基于提供的 Wiki 内容、PDF/source 摘录和 evidence pack 回答。
2. 回答中引用具体来源：Wiki 用 [[页面名]]；PDF/source 用 \`raw/...pdf p.N\` 或页码范围。
3. 明确区分协议规范、测试要求、实现观察和推断总结。
4. 如果检索到了相关摘录但仍不足以确认细节，请说明缺口；不要说“知识库空白”。
5. 保持回答聚焦、结构化，使用中文回复。
6. 不要编造上下文中不存在的信息。

`;

  if (wikiPages.length > 0) {
    prompt += `## 相关 Wiki 页面\n\n${wikiPages.join('\n\n')}\n\n`;
  }

  if (pdfPages.length > 0) {
    prompt += `## PDF/source 摘录与 Evidence Pack\n\n`;
    for (const pp of pdfPages) {
      const pageLabel = pp.pages?.length ? ` p.${pp.pages.join(',')}` : '';
      prompt += `### 来自: ${pp.path}${pageLabel}\n\n${pp.text.slice(0, 5000)}\n\n`;
    }
  }

  prompt += `\n请基于以上上下文回答用户的问题。`;
  return prompt;
}
