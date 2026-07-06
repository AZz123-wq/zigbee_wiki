---
title: "Multistate Input (BACnet Regular) Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, protocol-interface, bacnet, io-value]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x060E"
status: reviewed
confidence: 0.84
---

# Multistate Input (BACnet Regular) Cluster (0x060E)

## 概述

Multistate Input (BACnet Regular) Cluster（Cluster ID `0x060E`）属于 ZCL Rev 7 的 Protocol Interfaces 功能域，章节定位为 9.2-9.4。Multistate Input (BACnet Regular) 是 Protocol Interfaces 章节中的协议隧道或 BACnet 风格 I/O/value cluster。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.553-p.555`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x060E` |
| 名称 | Multistate Input (BACnet Regular) |
| 功能域 | Protocol Interfaces |
| Rev 7 章节 | 9.2-9.4 |
| 来源页 | p.553-p.555 |

### 规范摘要

Multistate Input (BACnet Regular) 是 Protocol Interfaces 章节中的协议隧道或 BACnet 风格 I/O/value cluster。

### 依赖

Any endpoint that supports this cluster must support the Binary Value (Basic) cluster and the Binary Value (BACnet Regular) cluster.

### 属性

- `0x0006` AlarmValue
- `0x0024` EventState enum8 - R 0 O
- `0x0082` EventTimeStamps - R - M

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- ZigBee Cluster Library Specification Chapter 9 ZigBee Document – 075123 Protocol Interfaces 9.4.12.4.4 Attribute Reporting No attribute reporting is mandated for this cluster.
- 9.4.13 Binary Value (BACnet Extended) The Binary Value (BACnet Extended) cluster provides an interface for accessing BACnet based characteristics of a binary value, typically used as a control system parameter.
- 9.4.13.4.3 Commands No cluster specific commands are received or generated.
- 9.4.14 Multistate Input (BACnet Regular) The Multistate Input (BACnet Regular) cluster provides an interface for accessing a number of commonly used BACnet based attributes of a multistate measurement.
- 9.4.14.4.3 Commands No cluster specific commands are received or generated.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x060E` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
- 本页保留来源页范围，后续实现、测试或差异分析应引用具体页码和章节。
- 本页区分 Rev 7 协议定义与测试规范要求；测试规范内容只作为认证验证入口。

## 交叉引用

- [[entities/spec-zcl-rev7]]
- [[summaries/2026-05-08-zcl-rev7]]
- [[index]]

## 待深入

- [ ] 按实现需求补齐完整属性表的类型、范围、access、默认值和 M/O 条件。
- [ ] 按 command payload 深读补齐 request/response 字段、状态码和时序。
- [ ] 若存在 profile/device type 约束，链接到对应 Device Type 或测试规范页面。
