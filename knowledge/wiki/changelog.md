---
title: "变更日志"
type: changelog
created: 2026-05-01
updated: 2026-05-10
---

# Wiki 变更日志

> 每次 Ingest / Lint / 重大更新的记录，按日期倒序。

---

## 2026-05-10

- ✅ **Cluster pages / 精读落页**: `raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf`
  - 新建 Cluster 实体页: 按 ZCL Rev 7 cluster 清单补齐 `wiki/entities/cluster-*.md`，当前共 124 个 Cluster 页面、124 个唯一 `cluster_id`。
  - 保留人工精读页: `wiki/entities/cluster-on-off.md` 不覆盖；其余页面按 Rev 7 页码窗口生成，包含概述、定位、属性线索、命令或“无 cluster-specific command”结论、行为要点、测试规范入口和待深入项。
  - 更新索引: `wiki/index.md` 新增 ZCL Rev 7 Cluster 实体表，按功能域列出 Cluster ID、页面和来源页码。
  - 新增脚本: `tools/scripts/generate-zcl-rev7-cluster-pages.ts`，用于从 `runtime/data/source-page-index.json` 可重复生成/更新 cluster 实体页。
  - 特殊标注: `cluster-fecal-coliform-fluoride-concentration-measurement.md` 保留 Rev 7 表中 `0x041B` 同时对应 Fecal coliform & E. Coli 与 Fluoride 的冲突，置信度降为 0.72。

- ✅ **Re-ingest / 精读**: `raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf`
  - 更新摘要: `wiki/summaries/2026-05-08-zcl-rev7.md` 从占位式 ingest 改为 Foundation、章节结构、Cluster 覆盖和关键机制的精读摘要。
  - 更新实体: `wiki/entities/spec-zcl-rev7.md`, `wiki/entities/cluster-on-off.md`。
  - 新建概念: `wiki/concepts/zcl-foundation.md`。
  - 更新概念: `wiki/concepts/sleepy-end-device-broadcast.md` 补充 Rev 7 Poll Control 证据。
  - 更新对比/索引: `wiki/comparisons/zcl-rev7-vs-rev8.md`, `wiki/index.md`。
  - 读取范围: `pdfinfo`/source-page-index 929p；分段精读 TOC、Foundation、General/OnOff/Poll Control、Measurement、Lighting、HVAC、Closures、IAS、Protocol Interfaces、Smart Energy、OTA、Telecom、Commissioning、Retail、Appliance。
  - 验证: `npm run reindex` 通过，64 个 Wiki 页面、0 断链、35 个 source 均 linked，健康检查 78/100，11 个 warning。

## 2026-05-08

- ✅ **Ingest**: 全量逐文档摘要与 PDF 读取连贯性复查
  - 覆盖: `raw/` 下 35 个 source（specs 9、test-specs 22、presentations 1、other 3）。
  - 新建摘要: 30 个 `wiki/summaries/2026-05-08-*.md`，覆盖 ZCL Rev7、BDB v3.0.1、Zigbee Direct、IoT Device Security、18 个 Cluster Test Specification、HA/Profile/PRO/BDB/IEEE 测试规范、3 个 CCB DOCX 和 1 个 Zigbee Technical PPTX。
  - 更新摘要: 修正既有 5 个核心规范摘要的页数与 PDF 读取检查：R22 599p、R23.1 649p、ZCL Rev8 1213p、BDB v1.0 87p、L&O v1.0 122p。
  - 更新综合: `wiki/syntheses/scanned-pdf-inventory.md` 从“扫描版需 OCR”改为“PDF 读取质量盘点”，记录 fallback extractor 少计页数风险。
  - 更新索引: `wiki/index.md` 按核心规范、Cluster 测试规范、平台/Profile 测试规范、CCB/培训资料重新列出所有摘要。
  - 读取结论: 31 个 PDF 均有 `data/source-page-index.json` 页级覆盖；存在 fallback mismatch 的文档后续引用以 `pdfinfo`、页级索引和分段 `pdftotext` 为准。

- ✅ **Remediation**: 文档摄入与检索链路修复
  - 依据: `outputs/2026-05-08-document-ingest-and-retrieval-remediation-plan.md`
  - Source index: 修复 raw/PDF id 碰撞，改为完整相对路径 SHA-256 稳定 id；记录 `sha256`、mtime、size、页数候选和 metadata status。
  - PDF metadata: 安装并优先使用 Poppler `pdfinfo`/`pdftotext`，保留 `/root/pdf_extract.py` 作为 fallback；R22 页数从旧 fallback 的 38 页修正为 599 页，并标记 fallback mismatch `needs_review`。
  - 新增索引: `data/source-quality-report.json`, `data/source-page-index.json`, `data/source-chunk-index.json`, `data/source-outline-index.json`。
  - 后端: 新增自动检索、research run、evidence pack、citation/search trace 保存链路；聊天空上下文时自动命中 Wiki/source chunk。
  - 前端: assistant 消息显示自动检索来源数和 wiki/pdf/raw/evidence citation badge。
  - 新建概念: `wiki/concepts/sleepy-end-device-broadcast.md`
  - 更新概念: `wiki/concepts/zigbee-nwk-layer.md`
  - 回归问题: `休眠设备如何处理广播消息`

- ✅ **Fix**: 修复 Chat Workbench 思考状态不可见问题
  - 根因: 后端只向前端转发最终回答 token，未发送可见的思考中状态；前端也未处理 `status` SSE 事件，导致模型开始输出前 assistant 气泡为空。
  - 后端: `server/src/index.ts` 在流式请求开始后发送 `status` 事件；`server/src/llmClient.ts` 识别 reasoning/thinking delta 时触发状态回调，但不暴露原始隐藏推理文本。
  - 前端: `frontend/src/lib/api.ts` 增加 `status` 事件处理；`frontend/src/components/ChatInput.tsx` 显示“正在思考...”，首个正式回答 token 到达时替换该占位。
  - 验证: `cd apps/server && npm run build`; `cd apps/frontend && npm run build`; Playwright Chromium 真实浏览器发送 `你好，你是什么模型`，确认出现“正在思考...”并最终显示回答。

- ✅ **Fix**: 修复 Chat Workbench 对话流式输出和历史对话删除菜单问题
  - 根因: 当前环境使用 DeepSeek Anthropic-compatible endpoint (`/anthropic/v1/messages`)，后端原先按 OpenAI `/chat/completions` 协议调用和解析，导致 assistant 消息保存为空。
  - 后端: `server/src/llmClient.ts` 增加 Anthropic Messages 流式解析，并保留 OpenAI-compatible 解析；`server/src/index.ts` 阻止空 assistant 消息入库。
  - 前端: `frontend/src/lib/api.ts` 正确解析 SSE event block；`frontend/src/components/ChatInput.tsx` 同步真实 conversation/message id 并显示流式错误。
  - UI: `frontend/src/components/ContextMenu.tsx` 和 `frontend/src/components/ConversationList.tsx` 修复删除对话后右键菜单残留，并处理当前对话删除后的消息区状态。
  - 验证: `cd apps/server && npm run build`; `cd apps/frontend && npm run build`; Playwright Chromium 真实浏览器发送 `你好，你是什么模型`，确认页面显示非空 assistant 回复且无错误。

## 2026-05-01

- ✅ **Ingest #5**: R22 详细处理 (全文低上下文读取)
  → `summaries/2026-05-01-zigbee-r22-spec.md` (详细摘要, 替代占位)
  - 更新实体: `entities/spec-zigbee-r22.md` (完整协议栈架构 + ZDO 命令集)
  - 新建概念: `concepts/zdo-device-discovery.md`, `concepts/zigbee-security-model.md`, `concepts/zigbee-nwk-layer.md`, `concepts/zigbee-binding.md`, `concepts/green-power.md`, `concepts/zigbee-aps-layer.md` (6个)
  - 覆盖: 5层协议栈, 30+ ZDO 命令, 7种安全构建块, Green Power, Inter-PAN, Sub GHz FSK
  - 来源: R22 38p, 7.2MB (当时基于旧 fallback extractor；2026-05-08 已修正为 599p)

- ✅ **Ingest #4**: Zigbee Spec R22/R23 + ZCL Rev7/Rev8 (批量低上下文)
  → `summaries/2026-05-01-zcl-rev8.md`, `summaries/2026-05-01-zigbee-r23-spec.md` (2个摘要)
  - 新建实体: `entities/spec-zcl-rev8.md`, `entities/spec-zcl-rev7.md`, `entities/spec-zigbee-r23.md`, `entities/spec-zigbee-r22.md` (4个)
  - 新建对比: `comparisons/zcl-rev7-vs-rev8.md`, `comparisons/zigbee-r22-vs-r23.md` (2个)
  - 新建综合: `syntheses/scanned-pdf-inventory.md` (当时记录为扫描版盘点；2026-05-08 已修正为 PDF 读取质量盘点)
  - 来源: ZCL v7/v8, Zigbee R22/R23 (均为大 PDF >5MB 或 >30p)

- ✅ **Ingest #2**: `raw/specs/docs-15-0014-05-0plo-LightingOccupancyDevice-Specification-V1.0-1.pdf`
  → `summaries/2026-05-01-lighting-occupancy-device-spec-v1.md`
  - 新建实体: `entities/spec-lighting-occupancy-device-v1.md`, `entities/device-on-off-light.md`, `entities/device-dimmable-light.md`, `entities/device-color-light.md`, `entities/device-occupancy-sensor.md` (5个)
  - 来源: L&O Device Spec v1.0, 121p, 15-0014-05, 15 种设备类型 (2026-05-08 已按 pdfinfo 修正为 122p)

- ✅ **Ingest #1**: `raw/specs/docs-13-0402-13-00zi-Base-Device-Behavior-Specification.pdf`
  → `summaries/2026-05-01-base-device-behavior-spec-v1.md`
  - 新建实体: `entities/spec-base-device-behavior-v1.md` (1个)
  - 新建概念: `concepts/bdb-commissioning.md`, `concepts/network-steering.md`, `concepts/finding-binding.md`, `concepts/touchlink-commissioning.md`, `concepts/bdb-security.md` (5个)
  - 来源: BDB Spec v1.0, 86p, 13-0402-13 (2026-05-08 已按 pdfinfo 修正为 87p)

- 🏗️ **Wiki 初始化**：建立目录骨架，编写 AGENTS.md Schema
  - 目录结构：raw/ → wiki/ → outputs/
  - 已就绪：specs/ 9 个 PDF，test-specs/ 24 个 PDF，presentations/ 1 个 PPTX，other/ 3 个 DOCX
