---
title: "Touchlink Commissioning Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
  - raw/test-specs/docs-15-0320-05-pfnd-0x1000-Touchlink-Commissioning-Cluster-Test-Specification.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, commissioning, touchlink]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x1000"
status: reviewed
confidence: 0.80
---

# Touchlink Commissioning Cluster (0x1000)

## 概述

Touchlink Commissioning Cluster（Cluster ID `0x1000`）属于 ZCL Rev 7 的 Commissioning 功能域，章节定位为 13.3。定义 touchlink inter-PAN 命令集和 standard unicast commissioning utility 命令集。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.849-p.891`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x1000` |
| 名称 | Touchlink Commissioning |
| 功能域 | Commissioning |
| Rev 7 章节 | 13.3 |
| 来源页 | p.849-p.891 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. The touchlink commissioning cluster shall have a cluster identifier of 0x1000. Those commands in the touchlink commissioning command set shall be sent using the profile identifier, 0xc05e whereas those commands in the commissioning utility command set shall sent using the profile identifier, 0x0104.

### 依赖

本次页级精读未抽取到独立的 Dependencies 小节；如实现依赖其他 cluster、profile 或设备类型，应回到来源页和应用规范一起确认。

### 属性

- 未从页级文本中稳定抽取到属性表行；该 cluster 可能以命令为主，或表格需要按来源页人工复核。

### 命令

- `0x00` Scan request Mandatory
- `0x02` Device information request Mandatory
- `0x06` Identify request Mandatory
- `0x07` Reset to factory new request Mandatory
- `0x10` Network start request Mandatory
- `0x12` Network join router request Mandatory
- `0x14` Network join end device request Mandatory
- `0x16` Network update request Mandatory
- `0x41` Get group identifiers request Optional
- `0x42` Get endpoint list request Optional
- `0x01` Scan response Mandatory
- `0x03` Device information response Mandatory
- `0x11` Network start response Mandatory
- `0x13` Network join router response Mandatory
- `0x15` Network join end device response Mandatory
- `0x40` Endpoint information Optional

### 行为要点

- 13.3 Touchlink Commissioning The Touchlink Commissioning cluster provides commands to support touchlink commissioning.
- Chapter 13 ZigBee Cluster Library Specification Commissioning ZigBee Document – 075123 The touchlink commissioning command set has command identifiers in the range 0x00 – 0x3f and shall be transmitted using the inter-PAN...
- The commissioning utility command set has command identifiers in the range 0x40 – 0xff and shall be transmitted using the standard unicast transmission service, similar to that used for other ZCL cluster commands.
- A controller application endpoint may send an endpoint information command frame to another controller application endpoint to announce itself.
- The originator responds with a get group identifiers response command frame containing the requested information (which may have a start index field and a count field equal to 0, indicating no groups are used).

### 测试规范

- 对应测试规范摘要: [[summaries/2026-05-08-touchlink-commissioning-cluster-test-spec]] (测试要求)

## 关键要点

- `0x1000` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
- 本页保留来源页范围，后续实现、测试或差异分析应引用具体页码和章节。
- 本页区分 Rev 7 协议定义与测试规范要求；测试规范内容只作为认证验证入口。

## 交叉引用

- [[entities/spec-zcl-rev7]]
- [[summaries/2026-05-08-zcl-rev7]]
- [[summaries/2026-05-08-touchlink-commissioning-cluster-test-spec]]
- [[index]]

## 待深入

- [ ] 按实现需求补齐完整属性表的类型、范围、access、默认值和 M/O 条件。
- [ ] 按 command payload 深读补齐 request/response 字段、状态码和时序。
- [ ] 若存在 profile/device type 约束，链接到对应 Device Type 或测试规范页面。
