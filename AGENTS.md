# Zigbee Personal Knowledge Wiki — Schema & Rules

> 本文件是本 Wiki 的"宪法"。LLM Agent 在操作本知识库时必须遵循此 Schema。
> 领域：Zigbee 协议、Cluster Library、测试规范

---

## 一、目录结构

```
my_wiki/
├── AGENTS.md                   # 本文件 — Schema 定义
├── raw/                        # 原始资料（只读，永不修改）
│   ├── specs/                  # 核心协议规范 (R22/R23/ZCL/BDB/PSWG 等)
│   ├── test-specs/             # Cluster 测试规范
│   ├── presentations/          # PPT 培训材料
│   └── other/                  # DOCX 等杂项
├── wiki/                       # LLM 生成和维护的结构化知识
│   ├── index.md                # 总索引
│   ├── changelog.md            # 变更日志
│   ├── summaries/              # 摘要页（一个源文件 → 一个摘要页）
│   ├── entities/               # 实体页（Cluster、Device Type、Stack Layer）
│   ├── concepts/               # 概念页（Binding、Reporting、Commissioning 等）
│   ├── comparisons/            # 对比分析（R22 vs R23 等）
│   └── syntheses/              # 综合判断（跨文档模式总结）
├── outputs/                    # 产出（报告、演示等）
└── .git/
```

---

## 二、页面命名规范

### summaries/ — 摘要页
- 命名：`{date}-{source-short-name}.md`
- 示例：`summaries/2026-05-01-zigbee-spec-r23.md`
- 说明：一篇文章/文档对应一个摘要页，包含来源信息与内容概括

### entities/ — 实体页（具名的、可引用的对象）
- 命名：`{entity-type}-{name}.md`
- 示例：
  - `entities/cluster-on-off.md`
  - `entities/cluster-level-control.md`
  - `entities/device-on-off-light.md`
  - `entities/stack-aps.md`
  - `entities/spec-zigbee-r23.md`

### concepts/ — 概念页（抽象概念、机制、流程）
- 命名：`{concept-name}.md`
- 示例：
  - `concepts/binding.md`
  - `concepts/reporting.md`
  - `concepts/touchlink-commissioning.md`
  - `concepts/bdb-commissioning.md`

### comparisons/ — 对比分析页
- 命名：`{topic-a}-vs-{topic-b}.md`
- 示例：`comparisons/zigbee-r22-vs-r23.md`

### syntheses/ — 综合判断页（跨源洞察）
- 命名：`{topic}.md`
- 示例：`syntheses/zigbee-cluster-test-coverage.md`

---

## 三、页面模板

每个 Wiki 页面必须使用以下 YAML frontmatter + 标准结构：

```markdown
---
title: "页面标题"
type: summary | entity | concept | comparison | synthesis
sources:
  - raw/specs/xxx.pdf        # 引用来源（raw/ 相对路径）
  - raw/test-specs/xxx.pdf
tags: [zigbee, cluster, ...]
created: 2026-05-01
updated: 2026-05-01
---

# 页面标题

## 概述
（1-3 段，高度概括本页面核心内容）

## 正文
（按逻辑分段，使用 ## 小标题）

## 关键要点
- 要点 1
- 要点 2

## 交叉引用
- [[entities/cluster-on-off]] — 相关实体
- [[concepts/binding]] — 相关概念
- [[summaries/2026-05-01-zigbee-spec-r23]] — 来源摘要

## 待深入
- [ ] 某方面需要进一步研究
```

---

## 四、工作流规则

### 操作 A：Ingest（摄入新资料）

当 raw/ 下新增文件时，按以下流程处理：

1. **阅读阶段**：LLM 读取 raw/ 下未处理的文件（通过 changelog 判断）
2. **摘要生成**：在 `wiki/summaries/` 下创建摘要页
   - 必须包含：文档名称、版本、日期、核心内容概括（5-10 要点）
   - 必须包含：该文档与其他已知文档的关系
3. **实体提取**：
   - 识别新出现的实体（Cluster ID、Device Type、Stack Layer、Spec 版本等）
   - 在 `wiki/entities/` 下创建新页面或更新已有页面
   - 一个源文档可能触发 5-15 个实体页的创建/更新
4. **概念提取**：
   - 识别新出现的核心概念、机制、流程
   - 在 `wiki/concepts/` 下创建或更新
5. **索引更新**：更新 `wiki/index.md`，加入新建页面的链接（按分类组织）
6. **日志记录**：在 `wiki/changelog.md` 追加一条记录：
   ```
   ## 2026-05-01
   - ✅ Ingest: raw/specs/xxx.pdf → summaries/2026-05-01-xxx.md
     - 新建实体: entities/cluster-xxx.md (3个)
     - 更新实体: entities/cluster-yyy.md (2个)
     - 新建概念: concepts/zzz.md (1个)
   ```

### 操作 B：Query（查询）

1. 用户提问
2. LLM 在 `wiki/` 下搜索相关页面（利用 Markdown 链接和索引）
3. 综合出答案，引用具体页面名和段落
4. **归档规则**：如果答案具有长期价值，询问用户是否归档为 `wiki/syntheses/` 新页面

### 操作 C：Lint（健康检查）

每摄入 5-10 份新资料后或用户触发时执行：

1. **矛盾检测**：搜索不同页面中对同一概念/簇 ID 的矛盾描述
2. **过时检测**：标注可能已被更新版本取代的信息（同一 Cluster 有新版测试规范）
3. **孤儿页面**：未被任何其他页面 [[链接]] 引用的页面
4. **缺失引用**：页面正文提及但未建立 [[链接]] 的关键词
5. **生成报告**：`wiki/lint-reports/lint-{YYYY-MM-DD}.md`

---

## 五、Zigbee 领域特定约定

### Cluster 实体命名规则
- 格式：`entities/cluster-{short-name}.md`
- 必须包含 frontmatter 中的 `cluster_id: 0xXXXX`
- 示例：`entities/cluster-on-off.md` → `cluster_id: 0x0006`

### Device Type 实体
- 格式：`entities/device-{name}.md`
- 关联其支持的 Cluster 列表

### Spec 实体
- 格式：`entities/spec-{short-name}.md`
- 记录版本号、发布日期、核心变更

### 版本对比
- Zigbee R22 vs R23 的差异必须在 `comparisons/` 中有专门页面
- ZCL Revision 7 vs 8 的差异同理

### 测试规范关联
- 每个 Cluster 实体页应链接到对应的 Test Specification
- 测试规范摘要页应标注覆盖的 Cluster

---

## 六、LLM 行为准则

1. **不要修改 raw/**：原始资料是权威来源，保持原样
2. **保持交叉引用**：每次更新都检查并补充 \[\[链接\]\]
3. **如实标注信息级别**：区分"规范原文"、"测试要求"、"推断/总结"
4. **控制页面粒度**：实体页聚焦一个 Cluster/Device/概念，避免过长
5. **标签系统**：使用 tags 实现横向检索（`cluster`, `commissioning`, `security`, `bdb` 等）
6. **版本意识**：多处引用时提到版本号，避免混淆 R22/R23/Revision 7/8 等

---

## 七、Skill 命令（Slash Commands）

以下命令可通过 `/命令名` 触发，对应的 Skill 文件定义了详细执行步骤。
Skill 是 AGENTS.md 的**执行手册**：AGENTS.md 定义"做什么"（Schema），Skill 定义"怎么做"（步骤）。

### /wiki-ingest — 摄入新资料
- **文件**: `~/.claude/commands/wiki-ingest.md` (全局 Slash Command)
- **何时用**: 将 raw/ 下的新文件编译为 wiki 页面
- **自动触发**: 当大于 5MB 或 >30 页的 PDF 时，自动转入 `/wiki-pdf-read`

### /wiki-pdf-read — 长 PDF 低上下文读取
- **文件**: `~/.claude/commands/wiki-pdf-read.md` (全局)
- **何时用**: 处理 >5MB 或 >30 页的 PDF，或被 `/wiki-ingest` 自动调用
- **强制流程**: Phase 0(预检查) → Phase 1(结构扫描) → Phase 2(关键词定位) → Phase 3(分段深读≤5p/次) → Phase 4(Wiki 写入) → Phase 5(自检)
- **核心原则**: 永远不把整本 PDF 装入上下文

### /wiki-lint — 健康检查
- **文件**: `~/.claude/commands/wiki-lint.md` (全局)
- **何时用**: 每摄入 5-10 份资料后，或用户主动触发
- **检测项**: 矛盾检测、过时检测、孤儿页面、缺失引用、格式一致性

### /wiki-stats — 统计报告
- **文件**: `~/.claude/commands/wiki-stats.md` (全局)
- **何时用**: 了解知识库健康度
- **输出**: 源文件统计、Wiki 页面统计、标签统计、链接统计、时间线

### PDF 提取工具
- **脚本**: `/root/pdf_extract.py`
- **模式**:
  - `python3 pdf_extract.py <file.pdf> [start] [end]` — 提取指定页
  - `python3 pdf_extract.py check <file.pdf>` — 预检查（可提取性 + 置信度）
  - `python3 pdf_extract.py scan <file.pdf> [keywords]` — 扫描 TOC + 关键词命中
  - `python3 pdf_extract.py diff <f1> <f2> [keywords]` — 两个 PDF 的关键词差异对比
