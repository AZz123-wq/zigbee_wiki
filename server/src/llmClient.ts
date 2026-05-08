/**
 * server/src/llmClient.ts
 * LLM client for DeepSeek API using child_process curl (works in WSL)
 */
import { execFile } from 'child_process';

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

export function buildSystemPrompt(wikiPages: string[], pdfPages: { path: string; text: string }[]): string {
  let prompt = `你是一个 Zigbee 协议专家助手，基于本地 Wiki 知识库回答问题。

规则：
1. 基于提供的 Wiki 内容和文档内容回答
2. 引用具体的 Wiki 页面，使用 [[页面名]] 格式
3. 如果发现知识库的空白或不一致之处，请指出
4. 保持回答聚焦、结构化，使用中文回复
5. 不要编造上下文中不存在的信息

`;

  if (wikiPages.length > 0) {
    prompt += `## 相关 Wiki 页面\n\n${wikiPages.join('\n\n')}\n\n`;
  }

  if (pdfPages.length > 0) {
    prompt += `## PDF 文档摘录\n\n`;
    for (const pp of pdfPages) {
      prompt += `### 来自: ${pp.path}\n\n${pp.text.slice(0, 5000)}\n\n`;
    }
  }

  prompt += `\n请基于以上上下文回答用户的问题。`;
  return prompt;
}
