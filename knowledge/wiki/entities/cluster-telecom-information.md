---
title: "Information Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, telecom, information]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0900"
status: reviewed
confidence: 0.84
---

# Information Cluster (0x0900)

## 概述

Information Cluster（Cluster ID `0x0900`）属于 ZCL Rev 7 的 Telecommunication 功能域，章节定位为 12.2。为 telecom 信息节点、移动终端和接入点提供信息内容分发接口。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.789-p.812`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0900` |
| 名称 | Information |
| 功能域 | Telecommunication |
| Rev 7 章节 | 12.2 |
| 来源页 | p.789-p.812 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. This cluster provides attributes and commands for Information Delivery Service.

### 依赖

None ZigBee Cluster Library Specification Chapter 12 ZigBee Document – 075123 Telecommunication

### 属性

- `0x0000` NodeDescription
- `0x0001` DeliveryEnable
- `0x0002` PushInformationTimer uint32 R O
- `0x0003` EnableSecureConfiguration
- `0x0010` NumberOfContents uint16 0x0000 - 0xFFFF R O
- `0x0011` ContentRootID uint16 0x0000 - 0xFFFF R O

### 命令

- `0x00` Request Information Response M Operation
- `0x01` Push Information M Operation
- `0x02` Send Preference Response O Operation
- `0x03` Server Request Preference O Operation
- `0x04` Request Preference Confirmation O Operation
- `0x05` Update Response O Configuration
- `0x06` Delete Response O Configuration
- `0x07` Configure Delivery Enable O Configuration
- `0x08` Configure Push Information Timer O Configuration
- `0x09` Configure

### 行为要点

- This cluster provides attributes and commands for Information Delivery Service.
- Besides, cluster can provides push-based delivery so the server cluster in the IN sends contents to client cluster in the MT (if properly configured).
- ZigBee Cluster Library Specification Chapter 12 ZigBee Document – 075123 Telecommunication Content may have links to the other contents.
- Content may be one of three explicitly specified types: octet strings, character strings or RSS feed, so that the browser in the MT can understand easily what content it should access.
- Cluster also provides such function that the client cluster in the AP can update contents and delete them in the IN.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0900` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
