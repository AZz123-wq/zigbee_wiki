---
title: "Base Device Behavior Test Specification v1.0 — 摘要"
type: summary
sources:
  - raw/test-specs/docs-14-0439-22-pfnd-zi-bdb-test-specification.pdf
tags: [zigbee, test-spec, bdb, commissioning, security]
created: 2026-05-08
updated: 2026-05-08
status: draft
confidence: 0.75
---

# Base Device Behavior Test Specification v1.0 — 摘要

## 文档信息

- **来源文件**: `raw/test-specs/docs-14-0439-22-pfnd-zi-bdb-test-specification.pdf`
- **类型/大小**: pdf / 9.8MB
- **页数**: 508 页 (pdfinfo)
- **PDF Title**: docs-14-0439-22-pfnd-zi-draft-bdb-test-specification
- **PDF Author**: Victor Berrios
- **PDF Created**: Fri Apr 29 05:49:33 2016 CST
- **封面/结构线索**: 6 Base Device Behavior Test Specification / ZigBee Document 14-0439-22 / April 19th, 2016 / Accepted by This document has been accepted for release by the ZigBee / Alliance Board of Directors / Abstract This document defines the test cases for testing compliance with

## PDF 读取检查

- **页数基准**: pdfinfo=508, structural=508, pdf_extract=29, 采用=508 页 (pdfinfo)。
- **页级连贯性**: source-page-index 覆盖 508 页，页码 1..508 连续。
- **空白/近空页**: 未发现。
- **文本质量抽样**: sampled_pages=5, sample_chars=7011, garbled_ratio=0.001, extraction_errors=0, quality_score=1；页均 3888 字符。
- **结论**: fallback extractor mismatch: pdfinfo=508, pdf_extract=29。Poppler/pdfinfo 与页级索引可覆盖完整文档，但旧 fallback extractor 页数不可信；后续引用以 pdfinfo、source-page-index 和分段 pdftotext 为准。

## 概述

BDB Test Specification v1.0 定义 Base Device Behavior 的认证测试用例，覆盖组网、入网、network steering、touchlink、finding and binding、reset 和安全互操作行为。

## 正文

- 封面显示文档号 14-0439-22，April 19th, 2016，关键词 Test case、Base device、profile interoperability、ZigBee-PRO。
- 测试要求与 BDB 规范不同：本文件描述验证步骤、初始条件和预期结果，不应直接当作协议规范正文引用。
- 页级关键词显示 Device_annce、broadcast、parent、rx on when idle 等行为在测试中反复出现。
- 初步识别的 test case ID: `CN-CFS-TC-03`, `CN-NFS-TC-01`, `NFS-TC-02`, `DN-NFS-TC-05`, `CN-NSA-TC-01A`, `DN-DNS-TC-01`, `DN-DNS-TC-02A`, `DN-DNS-TC-03`, `DN-DNS-TC-04`, `DN-NFS-TC-02`, `CN-NST-TC-01A`, `CN-NST-TC-01B`, `DN-TLP-TC-14`, `DN-TLP-TC-01E`, `DN-TLP-TC-02C`, `DN-TLP-TC-03E`。

## 关键要点

- 本页是文档级 ingest，用于建立来源覆盖、读取质量和后续深挖入口。
- PDF/OOXML 读取结论属于资料处理观察，不等同于 Zigbee 协议或测试规范要求。
- 具体条款、属性、命令或测试步骤需要后续按页分段深读后再写入实体/概念页。

## 交叉引用

- [[summaries/2026-05-01-base-device-behavior-spec-v1]]
- [[concepts/bdb-commissioning]]
- [[concepts/network-steering]]
- [[concepts/finding-binding]]
- [[concepts/touchlink-commissioning]]
- [[index]]

## 待深入

- [ ] 按章节抽取关键测试项或规范条款。
- [ ] 将长期复用的结论沉淀到对应 entity/concept/synthesis 页面。
