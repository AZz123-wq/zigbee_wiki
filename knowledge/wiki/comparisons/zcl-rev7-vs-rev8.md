---
title: "ZCL Revision 7 vs Revision 8 对比"
type: comparison
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
  - raw/specs/07-5123-08-Zigbee-Cluster-Library-1.pdf
tags: [zigbee, zcl, comparison, revision-7, revision-8]
created: 2026-05-01
updated: 2026-05-10
---

# ZCL Revision 7 vs Revision 8 对比

## 基本信息

| 属性 | Rev 7 | Rev 8 | 变化 |
|------|-------|-------|------|
| 文档编号 | 07-5123-07 | 07-5123-08 | +1 |
| 页数 | 929 | 1213 | +284 |
| 文件大小 | 9.2MB | 11.2MB | +2.0MB |
| 版权年份 | 2007-2018 | 2007-2020 | +2yr |
| 章节数 | 15 | 15 | Rev 7 已在 2026-05-10 精读确认 |
| 可提取文本 | ✅，但 fallback 页数不可信 | ✅，但 fallback 页数不可信 | |

> 页数已按 `pdfinfo` 和 `runtime/data/source-page-index.json` 修正。旧 `/root/pdf_extract.py` fallback 曾分别只识别 894/834 页，不适合作为完整文档页码基准。

## 待深入对比项

- [x] 章节数确认
- [ ] 章节内容增减
- [ ] Cluster 新增/移除
- [ ] 属性定义变更
- [ ] 命令调整
- [ ] 数据类型更新
- [ ] Foundation 框架变更

## 交叉引用

- [[entities/spec-zcl-rev7]]
- [[entities/spec-zcl-rev8]]
- [[summaries/2026-05-08-zcl-rev7]]
- [[summaries/2026-05-01-zcl-rev8]]
