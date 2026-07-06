---
title: "Home Automation Profile Test Specification (0x0104) — 摘要"
type: summary
sources:
  - raw/test-specs/HA-profile-test-Spec.pdf
tags: [zigbee, test-spec, home-automation, profile-0x0104]
created: 2026-05-08
updated: 2026-05-08
status: draft
confidence: 0.75
---

# Home Automation Profile Test Specification (0x0104) — 摘要

## 文档信息

- **来源文件**: `raw/test-specs/HA-profile-test-Spec.pdf`
- **类型/大小**: pdf / 2.8MB
- **页数**: 330 页 (pdfinfo)
- **PDF Created**: Wed Oct 15 10:59:25 2014 CST
- **封面/结构线索**: ZigBee Document 075340r14 / Home Automation Test Specification (0x0104) / ZigBee Alliance / Qualification, Certification, Home Automation Qualification, Certification, Home Automation / Elements of ZigBee Alliance specifications may be subject to third party intellectual property / ZigBee DISCLAIMS ALL WARRANTIES EXPRESS OR IMPLIED, INCLUDING BUT NOT

## PDF 读取检查

- **页数基准**: pdfinfo=330, structural=330, pdf_extract=21, 采用=330 页 (pdfinfo)。
- **页级连贯性**: source-page-index 覆盖 330 页，页码 1..330 连续。
- **空白/近空页**: p.4。
- **文本质量抽样**: sampled_pages=5, sample_chars=8952, garbled_ratio=0.067, extraction_errors=0, quality_score=0.78；页均 2286 字符。
- **结论**: fallback extractor mismatch: pdfinfo=330, pdf_extract=21; sample text has garbled ratio 0.067。Poppler/pdfinfo 与页级索引可覆盖完整文档，但旧 fallback extractor 页数不可信；后续引用以 pdfinfo、source-page-index 和分段 pdftotext 为准。

## 概述

Home Automation Test Specification (0x0104) 描述 Home Automation Profile 的认证测试结构、测试目的和设备/Cluster 相关测试要求。

## 正文

- 文档按 Test Purpose/Test Case 组织，区分 behavior valid (BV) 与 behavior invalid (BI)。
- 目录和样本文本显示覆盖 ZDO 配置、Home Automation device description、cluster command extensions、required tests per device、attribute reporting 等主题。
- 读取质量需要复核：Poppler 可连续提取 330 页，但样本文本有 0.067 乱码比例，p.4 为空白/近空页。

## 关键要点

- 本页是文档级 ingest，用于建立来源覆盖、读取质量和后续深挖入口。
- PDF/OOXML 读取结论属于资料处理观察，不等同于 Zigbee 协议或测试规范要求。
- 具体条款、属性、命令或测试步骤需要后续按页分段深读后再写入实体/概念页。

## 交叉引用

- [[entities/device-on-off-light]]
- [[entities/device-dimmable-light]]
- [[entities/device-color-light]]
- [[entities/device-occupancy-sensor]]
- [[index]]

## 待深入

- [ ] 按章节抽取关键测试项或规范条款。
- [ ] 将长期复用的结论沉淀到对应 entity/concept/synthesis 页面。
