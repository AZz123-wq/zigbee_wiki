---
title: "Zigbee PRO Compliant Platform Test Specification — 摘要"
type: summary
sources:
  - raw/test-specs/docs-07-5035-08-0zqg-zigbee-pro-compliant-platform-test-specification.pdf
tags: [zigbee, test-spec, pro-platform, compliance]
created: 2026-05-08
updated: 2026-05-08
status: draft
confidence: 0.75
---

# Zigbee PRO Compliant Platform Test Specification — 摘要

## 文档信息

- **来源文件**: `raw/test-specs/docs-07-5035-08-0zqg-zigbee-pro-compliant-platform-test-specification.pdf`
- **类型/大小**: pdf / 3.8MB
- **页数**: 490 页 (pdfinfo)
- **PDF Title**: zigbee PRO Compliant Platform Test Specification
- **PDF Author**: Rob Alexander
- **PDF Created**: Fri May 12 05:42:04 2017 CST
- **封面/结构线索**: 5 Specification / 8 April 19, 2017 / 18 Qualification, Certification / 20 Notice of use and disclosure / 25 Elements of zigbee alliance specifications may be subject to third party intellectual property / 37 NOT LIMITED TO (A) ANY WARRANTY THAT THE USE OF THE INFORMATION

## PDF 读取检查

- **页数基准**: pdfinfo=490, structural=490, pdf_extract=78, 采用=490 页 (pdfinfo)。
- **页级连贯性**: source-page-index 覆盖 490 页，页码 1..490 连续。
- **空白/近空页**: 未发现。
- **文本质量抽样**: sampled_pages=5, sample_chars=5718, garbled_ratio=0.001, extraction_errors=0, quality_score=1；页均 3071 字符。
- **结论**: fallback extractor mismatch: pdfinfo=490, pdf_extract=78。Poppler/pdfinfo 与页级索引可覆盖完整文档，但旧 fallback extractor 页数不可信；后续引用以 pdfinfo、source-page-index 和分段 pdftotext 为准。

## 概述

Zigbee PRO Compliant Platform Test Specification 描述 Zigbee PRO 平台层合规测试，覆盖网络、安全、广播、设备发现、数据轮询、父子关系等栈级行为。

## 正文

- 该文档不是单个 Cluster 测试规范，而是平台/栈级合规测试规范。
- 关键词命中显示 broadcast、parent、Device_annce、rx on when idle、data poll、MAC data poll、sleepy end device 等主题大量出现。
- 应与 Zigbee R22/R23 核心规范和 BDB Test Specification 交叉使用，区分平台栈测试与应用 Cluster 测试。
- 初步识别的 test case ID: `CN-NSA-TC-01C`, `CN-NSA-TC-01D`, `FB-PRE-TC-02`, `FB-PRE-TC-03B`, `FB-PRE-TC-03C`, `FB-PRE-TC-04A`, `FB-PRE-TC-04B`, `FB-PRE-TC-04C`, `FB-PRE-TC-07`, `FB-CDP-TC-01`, `FB-PIM-TC-01`, `DR-TAR-TC-03C`, `DR-TAR-TC-03D`, `DR-TAR-TC-03E`, `DR-TAR-TC-05C`, `DR-TAR-TC-05D`。

## 关键要点

- 本页是文档级 ingest，用于建立来源覆盖、读取质量和后续深挖入口。
- PDF/OOXML 读取结论属于资料处理观察，不等同于 Zigbee 协议或测试规范要求。
- 具体条款、属性、命令或测试步骤需要后续按页分段深读后再写入实体/概念页。

## 交叉引用

- [[entities/spec-zigbee-r22]]
- [[entities/spec-zigbee-r23]]
- [[concepts/zigbee-nwk-layer]]
- [[concepts/sleepy-end-device-broadcast]]
- [[index]]

## 待深入

- [ ] 按章节抽取关键测试项或规范条款。
- [ ] 将长期复用的结论沉淀到对应 entity/concept/synthesis 页面。
