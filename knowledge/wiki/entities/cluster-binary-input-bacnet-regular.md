---
title: "Binary Input (BACnet Regular) Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, protocol-interface, bacnet, io-value]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0608"
status: reviewed
confidence: 0.84
---

# Binary Input (BACnet Regular) Cluster (0x0608)

## 概述

Binary Input (BACnet Regular) Cluster（Cluster ID `0x0608`）属于 ZCL Rev 7 的 Protocol Interfaces 功能域，章节定位为 9.2-9.4。Binary Input (BACnet Regular) 是 Protocol Interfaces 章节中的协议隧道或 BACnet 风格 I/O/value cluster。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.545-p.548`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0608` |
| 名称 | Binary Input (BACnet Regular) |
| 功能域 | Protocol Interfaces |
| Rev 7 章节 | 9.2-9.4 |
| 来源页 | p.545-p.548 |

### 规范摘要

Binary Input (BACnet Regular) 是 Protocol Interfaces 章节中的协议隧道或 BACnet 风格 I/O/value cluster。

### 依赖

Any endpoint that supports this cluster must support the Analog Value (Basic) cluster and the Analog Value (BACnet Regular) cluster.

### 属性

- `0x0019` Deadband
- `0x0024` EventState enum8 - R 0 O
- `0x002D` HighLimit
- `0x003B` LowLimit
- `0x0082` EventTimeStamps - R - M

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- 9.4.7.4.3 Commands No cluster specific commands are received or generated.
- 9.4.8 Binary Input (BACnet Regular) The Binary Input (BACnet Regular) cluster provides an interface for accessing a number of commonly used BACnet based attributes of a binary measurement.
- 9.4.8.4.3 Commands No cluster specific commands are received or generated.
- 9.4.9 Binary Input (BACnet Extended) The Binary Input (BACnet Extended) cluster provides an interface for accessing a number of BACnet based attributes of a binary measurement.
- 9.4.9.4.3 Commands No cluster specific commands are received or generated.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0608` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
