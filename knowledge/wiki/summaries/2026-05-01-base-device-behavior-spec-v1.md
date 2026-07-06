---
title: "Base Device Behavior Specification v1.0 — 摘要"
type: summary
sources:
  - raw/specs/docs-13-0402-13-00zi-Base-Device-Behavior-Specification.pdf
tags: [zigbee, bdb, commissioning, security, base-device]
created: 2026-05-01
updated: 2026-05-08
---

# Base Device Behavior Specification v1.0 — 摘要

## 文档信息

- **文档编号**: ZigBee Document 13-0402-13
- **版本**: Version 1.0
- **发布日期**: February 24th, 2016
- **编辑**: Phil Jamieson
- **页数**: 87 页 (pdfinfo)
- **赞助方**: ZigBee Alliance

## PDF 读取检查

- **页数基准**: pdfinfo=87, structural=87, pdf_extract=86, 采用 87 页。
- **页级连贯性**: `runtime/data/source-page-index.json` 覆盖 87 页，页码 1..87 连续，无缺页。
- **文本质量抽样**: sampled_pages=5, sample_chars=5198, garbled_ratio=0.001, extraction_errors=0, quality_score=1。
- **结论**: Poppler 页数、结构页数和页级索引一致，文本可连续检索；旧 fallback 少计 1 页。

## 概述

Base Device Behavior (BDB) 规范定义 ZigBee-PRO 网络上设备的**基础行为**，确保不同应用 Profile 之间的互操作性。这是 ZigBee 3.0 设备必须遵循的核心行为规范。

## 核心章节

| 章节 | 主题 | 页码 |
|------|------|------|
| 1 | 引言 (Scope, Purpose, Conformance) | 15 |
| 2 | 参考文献 | 17 |
| 3 | 定义、缩写 | 18 |
| 4 | 通用要求 | 20 |
| 5 | 节点程序 (PB Commissioning / Finding & Binding / Network Steering) | 30 |
| 6 | Commissioning 集群 | ~55 |
| 7 | Touchlink 程序 (Initiator & Target) | 56 |
| 8 | Reset (Basic Cluster / Touchlink / Leave / Mgmt_Leave / Local) | 70 |
| 9 | Security (Install Codes / Link Keys / Trust Center) | 73 |

## 关键要点

1. **BDB 定义了 5 类核心过程**：初始化、Commissioning（入网）、Finding & Binding、Touchlink、Reset
2. **Commissioning 机制**包括：Network Steering（网络引导）、Network Formation（组网）、Finding & Binding（查找与绑定）、Touchlink（近距离配网）
3. **安全**基于 Install Codes + Trust Center Link Keys 机制，定义了 Trust Center 行为和节点加入安全策略
4. **Revision History**显示该规范经历了 13 次迭代修订，从 2013 年 8 月首次草案到 2016 年 2 月最终发布
5. 本规范与 `raw/specs/16-02828-012-PRO-BDB-v3.0.1-Specification.pdf` (BDB v3.0.1) 为同系列可能更新版本的关系

## 交叉引用

- [[entities/spec-base-device-behavior-v1]]
- [[concepts/bdb-commissioning]]
- [[concepts/finding-binding]]
- [[concepts/network-steering]]
- [[concepts/touchlink-commissioning]]
- [[concepts/bdb-security]]

## 待深入

- [ ] 与 BDB v3.0.1 的版本关系确认：[[summaries/2026-05-08-pro-bdb-v3-0-1-specification]]
- [ ] Commissioning 各模式详细流程写入概念页
- [ ] Security Install Code 流程详细分析
