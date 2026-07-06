---
title: "Base Device Behavior Specification v1.0"
type: entity
sources:
  - raw/specs/docs-13-0402-13-00zi-Base-Device-Behavior-Specification.pdf
tags: [zigbee, spec, bdb, base-device-behavior]
created: 2026-05-01
updated: 2026-05-08
spec_version: "1.0"
spec_doc_id: "13-0402-13"
spec_date: "2016-02-24"
---

# Base Device Behavior Specification v1.0

## 概述

ZigBee Alliance 发布的 Base Device Behavior (BDB) 规范，定义基于 ZigBee-PRO 协议栈的设备的**基础行为要求**，是 ZigBee 3.0 核心规范之一。目的是确保不同应用 Profile 之间的互操作性。

## 版本信息

- **规范**: Base Device Behavior Specification
- **版本**: Version 1.0
- **文档编号**: 13-0402-13
- **发布日期**: February 24th, 2016
- **编辑**: Phil Jamieson
- **修订次数**: 13 次迭代 (Rev 00 → Rev 13)

## 覆盖范围

1. **设备基础环境** (General Requirements)
2. **初始化程序** (Initialization)
3. **Commissioning 程序** (Push Button / Finding & Binding / Network Steering / Touchlink)
4. **Reset 程序** (Basic Cluster / Touchlink / Leave / Mgmt_Leave / Local)
5. **安全程序** (Install Codes / Link Keys / Trust Center)

## 关键实体

- [[concepts/bdb-commissioning]]
- [[concepts/finding-binding]]
- [[concepts/network-steering]]
- [[concepts/touchlink-commissioning]]
- [[concepts/bdb-security]]

## 关联规范

- ZigBee Specification R22 (`raw/specs/docs-05-3474-22-0csg-zigbee-specification-1.pdf`)
- ZigBee Specification R23 (`raw/specs/docs-05-3474-23-csg-zigbee-specificationR23.1.pdf`)
- BDB v3.0.1: [[summaries/2026-05-08-pro-bdb-v3-0-1-specification]] — 可提取文本，但旧 fallback extractor 页数不可信

## 交叉引用

- [[summaries/2026-05-01-base-device-behavior-spec-v1]]
