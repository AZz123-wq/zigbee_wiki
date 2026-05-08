# Wiki Chat Workbench — 项目文档

## 一、项目概述

在 Zigbee 个人 Wiki 知识库 (`my_wiki/`) 之上构建的**本地 Wiki Chat 工作台**，类 ChatGPT 网页版界面，
围绕本地 Wiki 进行智能对话、raw 文件管理、PDF 预览、健康检查和 Wiki 自更新建议。

**核心原则**：
- 前端不直接调用大模型，不保存 API Key
- PDF 单次最多读取 5 页，不自动全文分析
- 第一版不自动写回 Wiki（只生成建议和 Claude Code 提示词）
- Node.js 网络调用使用 curl child_process（WSL 中 Node fetch 不可用）

## 二、目录结构

```
my_wiki/
├── CLAUDE.md                   # 本文件
├── AGENTS.md                   # Wiki Schema 定义
├── wiki/                       # LLM 生成的 Wiki 页面 (32 个 .md)
│   ├── index.md                # 总索引
│   ├── changelog.md            # 变更日志
│   ├── summaries/              # 5 个摘要页
│   ├── entities/               # 10 个实体页
│   ├── concepts/               # 11 个概念页
│   ├── comparisons/            # 2 个对比页
│   └── syntheses/              # 1 个综合页
├── raw/                        # 原始资料 (只读，35 个文件)
│   ├── specs/                  # 9 个核心规范 PDF
│   ├── test-specs/             # 24 个 Cluster 测试规范 PDF
│   ├── presentations/          # 1 个 PPTX
│   └── other/                  # 3 个 DOCX
├── frontend/                   # React + Vite + TypeScript + Tailwind
│   └── src/
│       ├── components/         # Sidebar, ChatWindow, ChatInput,
│       │                          MessageBubble, ConversationList,
│       │                          ContextMenu, DetailDrawer,
│       │                          ArchiveTimeline, PdfViewer
│       ├── pages/              # ChatPage, RawFilesPage, ReviewPage,
│       │                          CheckPage, SettingsPage
│       └── lib/                # api.ts, store.ts (Zustand), types.ts
├── server/                     # Node.js + Express
│   └── src/
│       ├── index.ts            # 所有 API 路由 + SSE 端点
│       ├── llmClient.ts        # DeepSeek API (curl child_process)
│       ├── pdfSafeReader.ts    # PDF 安全读取 (≤5 页)
│       └── dataStore.ts        # JSON 文件存储
├── scripts/                    # 索引与检查脚本
│   ├── build-wiki-index.ts     # 扫描 Wiki → frontmatter + wikilinks
│   ├── build-source-index.ts   # 扫描 Raw → PDF metadata
│   └── check-wiki-health.ts    # 健康检查 (断链/孤立页/未处理文件)
└── data/                       # 自动生成的 JSON 数据
    ├── wiki-index.json         # Wiki 页面索引
    ├── source-index.json       # Raw 文件索引
    ├── check-results.json      # 健康检查结果
    ├── conversations.json      # 对话历史
    ├── messages.json           # 消息记录
    ├── archives.json           # 归档流程
    └── review-items.json       # 审查队列
```

## 三、启动方式

```bash
# 1. 生成索引（首次或 raw 文件变更后）
cd /root/my_wiki
npx tsx scripts/build-wiki-index.ts
npx tsx scripts/build-source-index.ts

# 2. 启动后端 (port 3001)
export DEEPSEEK_API_KEY="sk-..."
cd /root/my_wiki/server && npx tsx src/index.ts

# 3. 启动前端 (port 5173)
cd /root/my_wiki/frontend && npx vite --host 0.0.0.0

# 访问 http://localhost:5173
```

## 四、已实现功能

| 功能 | 状态 |
|------|------|
| ChatGPT 风格布局 (Sidebar + Chat + DetailDrawer) | ✅ |
| 对话历史列表 + 新建/切换/重命名/删除 | ✅ |
| 对话历史显示时间 (MM-DD HH:mm) | ✅ |
| 右键上下文菜单 (7 项操作) | ✅ |
| 归档流程详情 (7-step Timeline) | ✅ |
| Raw 文件管理页 + 筛选 | ✅ |
| 拖拽上传 raw 文件 (并行上传 + 进度) | ✅ |
| PDF 文件列表 + 浏览器内嵌预览 | ✅ |
| PDF 按页读取 (后端限制 ≤5 页) | ✅ |
| PDF 页码范围选择后加入对话 | ✅ |
| Check Wiki 健康检查 (84/100) | ✅ |
| Review Queue | ✅ |
| Claude Code 提示词生成 + 复制 | ✅ |
| 设置页面 (后端/API/存储/安全信息) | ✅ |
| DeepSeek API 调用 (curl child_process) | ✅ |
| SSE 流式输出 (分块发送 token) | ✅ |
| 全站中文化 | ✅ |
| 深色模式 | ✅ |

## 五、当前问题

### 1. LLM 网络问题 (已修复)
**原因**：WSL 中 Node.js 的 `fetch`/`https.request` 无法解析外部 DNS，但系统 curl 正常。
**修复**：`server/src/llmClient.ts` 改用 `child_process.execFile('curl', ...)` 调用 DeepSeek API。

### 2. 待验证项
- 聊天功能端到端测试（需 DEEPSEEK_API_KEY 有效且网络通）
- 拖拽上传 raw 文件后，文件 ID 传递给 chat 接口的流程
- 右键删除对话后 UI 是否正确移除

### 3. 已知限制
- 第一版不自动写回 Wiki（只生成建议和 Claude Code 提示词）
- 不实现多用户/登录/云同步/向量数据库
- PDF 全文 OCR 不支持
- DOCX/PPTX 文件预览不支持（仅列出）

## 六、设计约束

| 约束项 | 值 |
|--------|-----|
| MAX_PDF_PAGES_PER_READ | 5 |
| MAX_MARKDOWN_CHARS_PER_PAGE | 30000 |
| MAX_CONTEXT_CHARS | 60000 |
| MAX_RAW_FILES_PER_CHAT | 5 |
| 前端端口 | 5173 |
| 后端端口 | 3001 |
| 存储方式 | JSON 文件 (data/) |

## 七、API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/index/summary | 总览摘要 |
| GET/POST | /api/conversations | 对话列表/新建 |
| GET/PATCH/DELETE | /api/conversations/:id | 对话 CRUD |
| POST | /api/chat | 发送消息 (非流式) |
| POST | /api/chat/stream | 发送消息 (SSE 流式) |
| GET | /api/conversations/:id/archive | 归档流程 |
| GET | /api/raw | raw 文件列表 |
| POST | /api/raw/upload | 上传 raw 文件 |
| GET/POST | /api/pdf /api/pdf/:id/read-pages | PDF 列表/按页读取 |
| GET | /api/pdf/:id/file | PDF 文件流 |
| POST/GET | /api/check /api/check/latest | 执行检查/最新结果 |
| GET/POST/PATCH | /api/review/:id | 审查队列 CRUD |
| POST | /api/prompt/generate | 生成 Claude Code 提示词 |

## 八、LLM 交互流程

```
用户输入 → 前端 sendChatStream()
  → POST /api/chat/stream (SSE)
  → 后端保存 user message
  → 加载 Wiki 页面内容 + PDF 按页文本
  → 构造 system prompt（中文）
  → curl child_process 调用 DeepSeek API
  → 分块 SSE 推送 token
  → 保存 assistant message
  → 生成归档流程
```

## 九、健康评分算法

评分初始 100 分，扣减规则：
- critical: -15, error: -5, warning: -2, info: -0.5
- 未处理 raw 文件为 `info` 级别（不扣分，仅提示）
- 当前评分: 84/100 (2 个大 PDF 警告)
