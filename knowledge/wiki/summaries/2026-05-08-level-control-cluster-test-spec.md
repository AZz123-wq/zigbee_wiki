---
title: "Level Control Cluster (0x0008) Test Specification — 摘要"
type: summary
sources:
  - raw/test-specs/docs-15-0312-05-pfnd-0x0008-Level-Control-Test-Specification.pdf
tags: [zigbee, test-spec, zcl, level-control, 0x0008]
created: 2026-05-08
updated: 2026-05-08
status: draft
confidence: 1
---

# Level Control Cluster (0x0008) Test Specification — 摘要

## 文档信息

- **来源文件**: `raw/test-specs/docs-15-0312-05-pfnd-0x0008-Level-Control-Test-Specification.pdf`
- **类型/大小**: pdf / 1.1MB
- **页数**: 64 页 (pdfinfo)
- **PDF Title**: Test Specification
- **PDF Author**: Phil Jamieson
- **PDF Created**: Mon Apr 18 21:38:22 2016 CST
- **封面/结构线索**: ZigBee Cluster Library / Level Control Cluster (0x0008) / Test Specification / ZigBee Document 15-0312-05 / April 18th, 2016 / Accepted by This document has been accepted for release by the ZigBee

## PDF 读取检查

- **页数基准**: pdfinfo=64, structural=64, pdf_extract=64, 采用=64 页 (pdfinfo)。
- **页级连贯性**: source-page-index 覆盖 64 页，页码 1..64 连续。
- **空白/近空页**: 未发现。
- **文本质量抽样**: sampled_pages=5, sample_chars=4356, garbled_ratio=0.002, extraction_errors=0, quality_score=1；页均 2423 字符。
- **结论**: Poppler 页数、结构页数和页级索引一致，文本可连续检索；可用于后续分段深读和页码引用。

## 概述

该文档描述 Level Control Cluster (0x0008) 的认证测试要求，版本 v1.0，发布日期 April 18th, 2016。封面标注已被 ZigBee Alliance Board of Directors 接受发布。

## 正文

- 覆盖 Level Control Cluster 的 DUT 服务器/客户端行为、属性读取/写入、命令功能、初始条件和预期验证步骤。
- 这是测试规范：正文中的步骤、verification、PICS 覆盖项应标注为“测试要求”，不要与 ZCL 协议规范原文混写。
- 后续如需实体页，应从该测试规范抽取 test case 到对应 Cluster 页面，并交叉引用 ZCL Cluster 定义。
- 初步识别的 test case ID: `LC-TC-01G`, `LC-TC-01S`, `LC-TC-02S`, `LC-TC-03S`, `LC-TC-04S`, `LC-TC-05S`, `LC-TC-06S`, `LC-TC-07S`, `LC-TC-01C`, `LC-TC-03C`。

## 关键要点

- 本页是文档级 ingest，用于建立来源覆盖、读取质量和后续深挖入口。
- PDF/OOXML 读取结论属于资料处理观察，不等同于 Zigbee 协议或测试规范要求。
- 具体条款、属性、命令或测试步骤需要后续按页分段深读后再写入实体/概念页。

## 交叉引用

- [[summaries/2026-05-01-zcl-rev8]]
- [[index]]

## 待深入

- [ ] 按章节抽取关键测试项或规范条款。
- [ ] 将长期复用的结论沉淀到对应 entity/concept/synthesis 页面。
