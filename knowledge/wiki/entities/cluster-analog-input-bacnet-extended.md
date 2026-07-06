---
title: "Analog Input (BACnet Extended) Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, protocol-interface, bacnet, io-value]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0603"
status: reviewed
confidence: 0.84
---

# Analog Input (BACnet Extended) Cluster (0x0603)

## 概述

Analog Input (BACnet Extended) Cluster（Cluster ID `0x0603`）属于 ZCL Rev 7 的 Protocol Interfaces 功能域，章节定位为 9.2-9.4。Analog Input (BACnet Extended) 是 Protocol Interfaces 章节中的协议隧道或 BACnet 风格 I/O/value cluster。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.539-p.541`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0603` |
| 名称 | Analog Input (BACnet Extended) |
| 功能域 | Protocol Interfaces |
| Rev 7 章节 | 9.2-9.4 |
| 来源页 | p.539-p.541 |

### 规范摘要

Analog Input (BACnet Extended) 是 Protocol Interfaces 章节中的协议隧道或 BACnet 风格 I/O/value cluster。

### 依赖

Any endpoint that supports this cluster must support the Analog Input (Basic) cluster.

### 属性

- `0x0016` COVIncrement
- `0x001F` DeviceType
- `0x004B` ObjectIdentifier
- `0x004D` ObjectName
- `0x004F` ObjectType enum16 - R - M
- `0x00A8` ProfileName

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- ZigBee Cluster Library Specification Chapter 9 ZigBee Document – 075123 Protocol Interfaces 9.4.2.4 Server 9.4.2.4.1 Dependencies Any endpoint that supports this cluster must support the Analog Input (Basic) cluster.
- 9.4.2.4.3 Commands No cluster specific commands are received or generated.
- 9.4.2.4.4 Attribute Reporting No attribute reporting is mandated for this cluster.
- 9.4.3 Analog Input (BACnet Extended) The Analog Input (BACnet Extended) cluster provides an interface for accessing a number of BACnet based attributes of an analog measurement.
- 9.4.3.4.3 Commands No cluster specific commands are received or generated.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0603` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
