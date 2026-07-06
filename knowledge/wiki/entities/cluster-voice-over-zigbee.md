---
title: "Voice Over ZigBee Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, telecom, voice]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0904"
status: reviewed
confidence: 0.84
---

# Voice Over ZigBee Cluster (0x0904)

## 概述

Voice Over ZigBee Cluster（Cluster ID `0x0904`）属于 ZCL Rev 7 的 Telecommunication 功能域，章节定位为 12.4。定义 Zigbee 语音传输的 codec、采样和 voice stream 控制接口。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.823-p.833`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0904` |
| 名称 | Voice Over ZigBee |
| 功能域 | Telecommunication |
| Rev 7 章节 | 12.4 |
| 来源页 | p.823-p.833 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. This cluster provides attributes and commands for devices to receive/transmit their voice data. One of the devices plays a role of a receiver and the other does that of a sender. For example, a receiver receives voice data from the other MT (voice sender). An important thing to notice for this VoZ cluster is that there are two different types of service for this cluster...

### 依赖

None

### 属性

- `0x0000` CodecType enum8 RW M
- `0x0002` Codecrate enum8 RW M
- `0x0003` uint8 0x01-0xff - M
- `0x0004` CodecTypeSub1 enum8 - RW O
- `0x0005` CodecTypeSub2 enum8 - RW O
- `0x0006` CodecTypeSub3 enum8 - RW O
- `0x0007` CompressionType enum8 - O
- `0x0008` CompressionRate enum8 - - O
- `0x0009` OptionFlags map8 0x00-0xff RW O
- `0x000A` Threshold uint8 0x00-0xff RW O

### 命令

- `0x00` Establishment Response
- `0x01` Voice Transmission Response
- `0x02` Control
- `0x03` Control Response

### 行为要点

- 12.4 Voice Over ZigBee 12.4.1 Scope and Purpose This section specifies a single cluster, the VoZ cluster, which provides commands and attributes for voice receiving and transmitting among ZigBee devices.
- This cluster is to provide a standardized interface for the devices to receive/transmit voice data packets.
- The cluster specified in this document is typically used for telecom applications, but may be used in any other application domains.
- This cluster provides attributes and commands for devices to receive/transmit their voice data.
- It may response to the request from other devices and transmit the data to them, or it may actively request other devices to transmit the data to them.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0904` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
