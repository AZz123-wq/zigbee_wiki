---
title: "Zigbee IEEE 802.15.4 Test Specification — 摘要"
type: summary
sources:
  - raw/test-specs/docs-14-0332-01-tech-zigbee-ieee-.pdf
tags: [zigbee, test-spec, ieee-802-15-4, phy, mac]
created: 2026-05-08
updated: 2026-05-08
status: draft
confidence: 0.75
---

# Zigbee IEEE 802.15.4 Test Specification — 摘要

## 文档信息

- **来源文件**: `raw/test-specs/docs-14-0332-01-tech-zigbee-ieee-.pdf`
- **类型/大小**: pdf / 1.5MB
- **页数**: 220 页 (pdfinfo)
- **PDF Title**: Microsoft Word - docs-13-0332-01-tech-zigbee-ieee-802-15-4-test-spec.docx
- **PDF Author**: Clint
- **PDF Created**: Wed Oct 29 08:04:36 2014 CST
- **封面/结构线索**: 20 October, 2014 / 22 ZigBee Alliance / 2400 Camino Ramon, Suite 375, San Ramon, CA 94583, USA / Permission is granted to members of the ZigBee Alliance to reproduce this document for their own use or the use of other ZigBee Alliance / 37 Elements of ZigBee Alliance specifications may be subject to third party intellectual property rights, / 42 DISCLAIMS ALL WARRANTIES EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO

## PDF 读取检查

- **页数基准**: pdfinfo=220, structural=220, pdf_extract=81, 采用=220 页 (pdfinfo)。
- **页级连贯性**: source-page-index 覆盖 220 页，页码 1..220 连续。
- **空白/近空页**: p.8。
- **文本质量抽样**: sampled_pages=5, sample_chars=16925, garbled_ratio=0, extraction_errors=0, quality_score=1；页均 3399 字符。
- **结论**: fallback extractor mismatch: pdfinfo=220, pdf_extract=81。Poppler/pdfinfo 与页级索引可覆盖完整文档，但旧 fallback extractor 页数不可信；后续引用以 pdfinfo、source-page-index 和分段 pdftotext 为准。

## 概述

该测试规范覆盖 Zigbee 对 IEEE 802.15.4 PHY/MAC 层行为的测试要求，是协议栈底层合规测试资料。

## 正文

- 页级关键词显示 rx on when idle、broadcast、indirect transmission、parent 等 MAC/NWK 边界行为被测试覆盖。
- 它应与 Zigbee Core Spec 中 PHY/MAC、MAC Data Poll、间接传输和 sleepy device 行为结合阅读。
- 读取质量需要复核：Poppler 连续覆盖 220 页，但存在 p.8 等近空页；这类页多半是空白/分隔页。

## 关键要点

- 本页是文档级 ingest，用于建立来源覆盖、读取质量和后续深挖入口。
- PDF/OOXML 读取结论属于资料处理观察，不等同于 Zigbee 协议或测试规范要求。
- 具体条款、属性、命令或测试步骤需要后续按页分段深读后再写入实体/概念页。

## 交叉引用

- [[entities/spec-zigbee-r22]]
- [[concepts/zigbee-nwk-layer]]
- [[concepts/sleepy-end-device-broadcast]]
- [[index]]

## 待深入

- [ ] 按章节抽取关键测试项或规范条款。
- [ ] 将长期复用的结论沉淀到对应 entity/concept/synthesis 页面。
