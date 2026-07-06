---
title: "Poll Control Cluster (0x0020) Test Specification — 摘要"
type: summary
sources:
  - raw/test-specs/17-02841-001-0x0020-Poll-Control-Cluster-Test-Specification.pdf
tags: [zigbee, test-spec, zcl, poll-control, 0x0020]
created: 2026-05-08
updated: 2026-05-08
status: draft
confidence: 1
---

# Poll Control Cluster (0x0020) Test Specification — 摘要

## 文档信息

- **来源文件**: `raw/test-specs/17-02841-001-0x0020-Poll-Control-Cluster-Test-Specification.pdf`
- **类型/大小**: pdf / 477.5KB
- **页数**: 33 页 (pdfinfo)
- **PDF Title**: 17-02841-001-0x0020-Poll-Control-Cluster-Test-Specification-Editors
- **PDF Author**: Victor Berrios
- **PDF Created**: Fri Oct 19 23:31:11 2018 CST
- **封面/结构线索**: ZigBee Cluster Library / Poll Control Cluster (0x0020) / Test Specification / ZigBee Document 17-02841-001 / June 5th, 2017 / Accepted by This document has not yet been accepted for release by the

## PDF 读取检查

- **页数基准**: pdfinfo=33, structural=33, pdf_extract=33, 采用=33 页 (pdfinfo)。
- **页级连贯性**: source-page-index 覆盖 33 页，页码 1..33 连续。
- **空白/近空页**: 未发现。
- **文本质量抽样**: sampled_pages=5, sample_chars=3894, garbled_ratio=0.002, extraction_errors=0, quality_score=1；页均 2123 字符。
- **结论**: Poppler 页数、结构页数和页级索引一致，文本可连续检索；可用于后续分段深读和页码引用。

## 概述

该文档描述 Poll Control Cluster (0x0020) 的认证测试要求，版本 v0.9，发布日期 June 5th, 2017。封面标注尚未被 ZigBee Alliance Board of Directors 接受发布，使用时应保留 draft/未接受发布状态。

## 正文

- 覆盖 Poll Control Cluster 的 DUT 服务器/客户端行为、属性读取/写入、命令功能、初始条件和预期验证步骤。
- 这是测试规范：正文中的步骤、verification、PICS 覆盖项应标注为“测试要求”，不要与 ZCL 协议规范原文混写。
- 后续如需实体页，应从该测试规范抽取 test case 到对应 Cluster 页面，并交叉引用 ZCL Cluster 定义。
- 初步识别的 test case ID: `POLL-TC-01G`, `POLL-TC-01S`, `POLL-TC-02S`, `POLL-TC-01C`。

## 关键要点

- 本页是文档级 ingest，用于建立来源覆盖、读取质量和后续深挖入口。
- PDF/OOXML 读取结论属于资料处理观察，不等同于 Zigbee 协议或测试规范要求。
- 具体条款、属性、命令或测试步骤需要后续按页分段深读后再写入实体/概念页。

## 交叉引用

- [[concepts/sleepy-end-device-broadcast]]
- [[index]]

## 待深入

- [ ] 按章节抽取关键测试项或规范条款。
- [ ] 将长期复用的结论沉淀到对应 entity/concept/synthesis 页面。
