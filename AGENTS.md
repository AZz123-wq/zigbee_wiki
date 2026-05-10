# Zigbee Wiki Chat Workbench — Agent Rules

> 本文件是本仓库的 Agent 操作规则。它同时约束 Zigbee 知识库维护、raw 资料处理、本地 Chat Workbench 代码修改与数据文件生成。
> 领域：Zigbee 协议、Cluster Library、测试规范、本地 Wiki 对话工作台。

---

## 一、项目定位

本仓库不是单纯的 Markdown Wiki，而是一个本地知识工作台：

- `raw/` 保存 Zigbee 原始资料，作为权威来源。
- `wiki/` 保存 LLM 生成和维护的结构化知识页。
- `scripts/` 从 `wiki/` 和 `raw/` 生成索引并执行健康检查。
- `server/` 提供 Express API、PDF 安全读取、聊天上下文组装和 JSON 存储。
- `frontend/` 提供 React + Vite + Tailwind 的本地 ChatGPT 风格界面。
- `data/` 保存索引、检查结果、对话、消息、归档和 review 队列。

Agent 的目标是让上述系统保持一致：资料可信、Wiki 可追溯、索引可再生成、前后端行为与安全限制一致。

---

## 二、当前目录结构

```text
my_wiki/
├── AGENTS.md                   # 本文件：Agent 规则
├── CLAUDE.md                   # 项目说明与运行文档
├── package.json                # 根脚本：index/check/dev/reindex
├── scripts/                    # 索引与健康检查脚本
│   ├── build-wiki-index.ts
│   ├── build-source-index.ts
│   └── check-wiki-health.ts
├── raw/                        # 原始资料
│   ├── specs/                  # 核心规范 PDF
│   ├── test-specs/             # Cluster / Profile 测试规范 PDF
│   ├── presentations/          # PPTX 培训资料
│   ├── other/                  # DOCX 等杂项资料
│   └── inbox/                  # 前端上传入口，待整理
├── wiki/                       # 结构化知识库
│   ├── index.md
│   ├── changelog.md
│   ├── summaries/
│   ├── entities/
│   ├── concepts/
│   ├── comparisons/
│   └── syntheses/
├── data/                       # 运行时与生成数据
│   ├── wiki-index.json
│   ├── source-index.json
│   ├── check-results.json
│   ├── conversations.json
│   ├── messages.json
│   ├── archives.json
│   └── review-items.json
├── server/                     # Express + TypeScript API
│   └── src/
│       ├── index.ts
│       ├── dataStore.ts
│       ├── llmClient.ts
│       └── pdfSafeReader.ts
├── frontend/                   # React + Vite + Tailwind UI
│   └── src/
│       ├── components/
│       ├── pages/
│       └── lib/
└── outputs/                    # 报告、演示或导出产物
```

---

## 三、不可破坏的边界

1. **不要修改 `raw/specs/`、`raw/test-specs/`、`raw/presentations/`、`raw/other/` 中的原始资料。**
   - 这些文件是权威来源，只读。
   - 如需新增资料，优先放入 `raw/inbox/`，再由 ingest 流程整理。
2. **不要手工伪造来源。**
   - Wiki 页面必须引用实际存在的 `raw/...` 文件。
   - 不确定的信息要标注为“推断/总结”，不能写成规范原文。
3. **不要把 API Key 或本地私密配置写入仓库。**
   - 后端读取 `DEEPSEEK_API_KEY`。
   - `ANTHROPIC_BASE_URL` 和 `ANTHROPIC_MODEL` 当前被用作可配置的 OpenAI-compatible DeepSeek 端点变量名。
4. **谨慎处理 `data/`。**
   - `wiki-index.json`、`source-index.json`、`check-results.json` 可由脚本再生成。
   - `conversations.json`、`messages.json`、`archives.json`、`review-items.json` 是运行时用户数据；除非任务明确要求，不要手工清空、重排或批量改写。
5. **不要绕过 PDF 安全限制。**
   - 单次读取 PDF 最多 5 页。
   - 每次返回文本最多约 30000 字符。
   - 大 PDF 必须分段读取，不允许把整本 PDF 塞进上下文。

---

## 四、Wiki 页面规范

### 4.1 页面类型与路径

- `wiki/summaries/`：一个源文件或一批强相关源文件的摘要。
- `wiki/entities/`：Cluster、Device Type、Spec 版本、Stack Layer 等具名对象。
- `wiki/concepts/`：Binding、Reporting、Commissioning、Security 等机制或流程。
- `wiki/comparisons/`：版本、规范、测试要求之间的对比。
- `wiki/syntheses/`：跨文档综合判断、盘点、长期有价值的研究结论。

### 4.2 命名规范

- 摘要页：`summaries/{date}-{source-short-name}.md`
- Cluster 实体：`entities/cluster-{short-name}.md`
- Device Type 实体：`entities/device-{name}.md`
- Spec 实体：`entities/spec-{short-name}.md`
- 概念页：`concepts/{concept-name}.md`
- 对比页：`comparisons/{topic-a}-vs-{topic-b}.md`
- 综合页：`syntheses/{topic}.md`

文件名使用小写英文、数字和连字符，避免空格。

### 4.3 标准 frontmatter

每个 Wiki 页面必须包含 YAML frontmatter。基础字段如下：

```markdown
---
title: "页面标题"
type: summary | entity | concept | comparison | synthesis | index | changelog
sources:
  - raw/specs/xxx.pdf
tags: [zigbee, cluster]
created: 2026-05-01
updated: 2026-05-01
---
```

Cluster 实体页还必须包含：

```yaml
cluster_id: "0x0006"
```

允许的可选字段：

- `status`: `draft | reviewed | deprecated | unknown`
- `confidence`: `0.0` 到 `1.0`
- `version`: 规范或测试文档版本
- `replaces`: 被替代页面或来源
- `related_clusters`: 相关 Cluster ID 列表

### 4.4 标准正文结构

普通页面优先使用以下结构；确有需要时可以增删小节，但不要省略来源、交叉引用和待深入信息。

```markdown
# 页面标题

## 概述

## 正文

## 关键要点

## 交叉引用

## 待深入
```

摘要页还应包含“文档信息”；测试规范摘要页应标注覆盖的 Cluster；版本对比页应明确比较基准和版本号。

---

## 五、Zigbee 领域约定

1. **版本意识**
   - 明确区分 Zigbee R22、R23、R23.1、ZCL Rev 7、ZCL Rev 8、BDB v1.0/v3.0.1 等版本。
   - 同一主题跨版本冲突时，写清楚信息来自哪个版本。
2. **Cluster 实体**
   - 必须写明 `cluster_id`。
   - 应包含属性、命令、关联设备、测试规范、来源摘要链接。
   - 每个 Cluster 实体页应尽量链接到对应 Test Specification。
3. **Device Type 实体**
   - 应列出 Mandatory / Optional Cluster。
   - 应链接到相关 Cluster 实体和来源规范。
4. **Spec 实体**
   - 记录文档编号、版本、发布时间、适用范围、核心变化。
5. **测试规范**
   - 测试规范中的要求要标注为“测试要求”，不要与“协议规范原文”混写。
   - 对 draft、旧版、替代版测试规范要标明版本关系。

---

## 六、Wiki 工作流

### 6.1 Ingest：摄入资料

当处理 `raw/` 下新资料或未入库资料时：

1. 检查 `wiki/changelog.md`、`data/source-index.json` 和已有 `wiki/summaries/`，避免重复 ingest。
2. 对 PDF 先做预检查和结构扫描：
   - 使用 `/root/pdf_extract.py check <file.pdf>` 或脚本索引结果判断页数、可提取性和风险。
   - 大于 5MB 或超过 30 页的 PDF 必须分阶段读取。
3. 创建或更新摘要页，包含：
   - 文档名称、文档编号、版本、日期、页数或文件规模。
   - 5-10 条核心内容。
   - 与已知规范、测试规范或实体页的关系。
4. 提取实体页：
   - Cluster、Device Type、Spec 版本、Stack Layer 等。
   - 已存在实体页时更新，不要创建重复实体。
5. 提取概念页：
   - Commissioning、Binding、Reporting、Security、OTA、Touchlink 等机制。
6. 更新 `wiki/index.md`。
7. 更新 `wiki/changelog.md`，记录来源文件、新建页、更新页和待深入事项。
8. 运行索引和健康检查：

```bash
npm run reindex
```

### 6.2 Query：回答问题

回答用户问题时：

1. 优先搜索 `wiki/`，必要时查 `data/wiki-index.json` 和 `data/source-index.json`。
2. 如 Wiki 不足，再按页读取 `raw/` 中相关文档。
3. 回答中引用具体页面或来源，例如 `[[entities/cluster-on-off]]`、`raw/specs/...pdf p.12`。
4. 长期有价值的结论，应询问是否归档为 `wiki/syntheses/` 页面。

### 6.3 Lint：健康检查

健康检查由脚本执行：

```bash
npm run index
npm run check
```

检查项包括：

- 断裂 wikilink
- 孤立页面
- 缺少来源
- 低置信度页面
- 重复标题
- 缺少 frontmatter
- 未处理 raw 文件
- PDF 元数据缺失或大 PDF 风险

如果修复 Wiki 页面，修复后应重新运行 `npm run reindex`。

---

## 七、代码维护规则

### 7.1 技术栈

- 根目录脚本使用 TypeScript + `tsx`。
- 后端：`server/`，Express + TypeScript，端口默认 `3001`。
- 前端：`frontend/`，React 18 + Vite + TypeScript + Tailwind，端口默认 `5173`。
- UI 图标库：`lucide-react`。
- 本地存储：`data/*.json`，通过 `server/src/dataStore.ts` 读写。

### 7.2 常用命令

```bash
# 生成 wiki 和 raw 索引
npm run index

# 执行健康检查
npm run check

# 索引 + 健康检查
npm run reindex

# 后端开发服务
npm run dev:server

# 前端开发服务
npm run dev:frontend

# 前端构建
cd frontend && npm run build

# 后端构建
cd server && npm run build
```

### 7.3 后端规则

1. API 路由集中在 `server/src/index.ts`。
2. JSON 文件读写必须通过 `server/src/dataStore.ts` 的 store 模式，避免多个地方直接改写运行时数据。
3. PDF 读取必须通过 `server/src/pdfSafeReader.ts`，保留并维护这些硬限制：
   - `MAX_PAGES_PER_READ = 5`
   - `MAX_MARKDOWN_CHARS_PER_PAGE` / 单次文本截断约 30000 字符
   - 上下文总量约 60000 字符
4. LLM 调用在 `server/src/llmClient.ts`。
   - 当前实现使用 `curl` child process 调用 OpenAI-compatible API，适配 WSL 中 Node fetch/DNS 问题。
   - 修改模型或端点时，保持环境变量方式，不要硬编码密钥。
5. 上传文件只进入 `raw/inbox/`，上传后需要重新生成 source index 才会进入索引视图。

### 7.4 前端规则

1. 页面在 `frontend/src/pages/`，复用组件在 `frontend/src/components/`，API 和类型在 `frontend/src/lib/`。
2. 前端不直接调用 LLM，不保存 API Key。
3. API 调用集中在 `frontend/src/lib/api.ts`。
4. 全局状态通过 `frontend/src/lib/store.ts`。
5. UI 文案当前以中文为主，保持一致。
6. 新增界面时保持工作台风格：信息密度适中、深色模式一致、控件状态明确。

### 7.5 脚本规则

1. `scripts/build-wiki-index.ts` 是 Wiki 页面、frontmatter、wikilink、backlink 的索引来源。
2. `scripts/build-source-index.ts` 是 raw 文件、PDF 元数据、source/wiki 关联状态的索引来源。
3. `scripts/check-wiki-health.ts` 是健康评分和 review prompt 的来源。
4. 修改 Wiki schema、frontmatter 字段或 wikilink 规则时，必须同步更新相关脚本。

---

## 八、数据文件约定

### 8.1 可再生成数据

以下文件可由脚本重建：

- `data/wiki-index.json`
- `data/source-index.json`
- `data/check-results.json`

修改 Wiki 或 raw 资料后应重新生成。

### 8.2 运行时用户数据

以下文件来自应用运行：

- `data/conversations.json`
- `data/messages.json`
- `data/archives.json`
- `data/review-items.json`

除非任务明确要求迁移、修复或清理用户数据，不要直接编辑这些文件。若必须编辑，先理解当前 JSON wrapper 格式：

```json
{
  "data": {},
  "_updated_at": "..."
}
```

部分旧文件可能是未包装的历史格式，`dataStore.ts` 会兼容读取。

---

## 九、PDF 与原始资料读取规则

1. 优先使用项目脚本或 `/root/pdf_extract.py`：

```bash
python3 /root/pdf_extract.py check raw/specs/example.pdf
python3 /root/pdf_extract.py scan raw/specs/example.pdf "OnOff,Binding"
python3 /root/pdf_extract.py raw/specs/example.pdf 10 14
python3 /root/pdf_extract.py diff raw/specs/a.pdf raw/specs/b.pdf "keyword"
```

2. 大 PDF 流程：
   - Phase 0：预检查，可提取性、页数、风险。
   - Phase 1：目录和结构扫描。
   - Phase 2：关键词定位。
   - Phase 3：每次最多 5 页深读。
   - Phase 4：写入 Wiki。
   - Phase 5：索引和健康检查。
3. 扫描版或低置信度 PDF 要写入 `confidence` 或在正文明确标注。
4. 不支持 OCR 时，不要声称已读取全文。

---

## 十、开发验证要求

根据改动类型选择验证：

- 只改 Wiki 页面：

```bash
npm run reindex
```

- 改脚本：

```bash
npm run reindex
```

- 改后端：

```bash
cd server && npm run build
```

- 改前端：

```bash
cd frontend && npm run build
```

- 改前后端 API 契约：
  - 同时检查 `server/src/index.ts` 和 `frontend/src/lib/api.ts`。
  - 至少运行前端和后端构建。

启动本地服务：

```bash
npm run dev:server
npm run dev:frontend
```

访问：

- 前端：`http://localhost:5173`
- 后端 API：`http://localhost:3001/api/index/summary`

---

## 十一、变更记录要求

涉及 Wiki 内容变化时，必须更新 `wiki/changelog.md`，格式示例：

```markdown
## 2026-05-08

- ✅ Ingest: `raw/specs/example.pdf` → `wiki/summaries/2026-05-08-example.md`
  - 新建实体: `wiki/entities/cluster-example.md`
  - 更新概念: `wiki/concepts/reporting.md`
  - 验证: `npm run reindex`
```

涉及代码变化时，不强制写入 Wiki changelog；但应在最终说明中列出修改文件和验证命令。

---

## 十二、Agent 行为准则

1. 先搜索已有页面和代码，再决定新增或修改。
2. 保持交叉引用：新增 Wiki 页面后，从 `wiki/index.md` 和相关页面补充 `[[...]]`。
3. 信息分级清楚：规范原文、测试要求、实现观察、推断总结要分开写。
4. 页面粒度适中：实体页聚焦一个对象，综合页才承载跨文档判断。
5. 修改代码时遵循现有结构，不引入不必要的新框架。
6. 修改脚本或 schema 时，同步考虑前端展示、后端 API 和 `data/*.json` 结构。
7. 遇到用户运行时数据的未提交改动，默认视为用户数据，不要回滚。
8. 完成后说明验证结果；如果无法验证，明确说明原因。
