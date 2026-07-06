---
title: "Zigbee Specification R23"
type: entity
sources:
  - raw/specs/docs-05-3474-23-csg-zigbee-specificationR23.1.pdf
tags: [zigbee, spec, r23, csa, core-spec]
created: 2026-05-01
updated: 2026-05-08
spec_version: "R23 (Revision 23)"
spec_doc_id: "05-3474-23"
spec_date: "2024"
---

# Zigbee Specification R23

## 概述

Zigbee R23 是 Connectivity Standards Alliance (CSA, 原 Zigbee Alliance) 发布的 Zigbee 核心规范最新版本。涵盖 PHY/MAC/Network/APS/ZDO 各层协议定义。

## 版本信息

- **规范**: Zigbee Specification
- **版本**: Revision 23 (R23)
- **文档编号**: 05-3474-23
- **出版**: CSA (Connectivity Standards Alliance), 2024
- **页数**: 649 页 (pdfinfo)
- **开发周期**: R23 0.5 (2018/07) → R23 1.0 (2024), 约 6 年

## 关键特性

1. **Curve25519** 椭圆曲线加密支持
2. **CSL** (Coordinated Sampled Listening) 低功耗机制
3. **Dynamic Link Key** (NFR) 安全增强
4. **Sub GHz FSK** PHY/MAC 支持
5. **ZDO 废弃** — 协议栈精简
6. **WWAH** 集成
7. **路由更新** + Sub Gig 路由

## 关联规范

- 前版本: [[entities/spec-zigbee-r22]]
- 对比: [[comparisons/zigbee-r22-vs-r23]]
- 上层: [[entities/spec-base-device-behavior-v1]], [[entities/spec-zcl-rev8]]

## 交叉引用

- [[summaries/2026-05-01-zigbee-r23-spec]]
- [[concepts/bdb-security]]
