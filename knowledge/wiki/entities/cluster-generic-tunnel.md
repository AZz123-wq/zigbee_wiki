---
title: "Generic Tunnel Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, protocol-interface, tunnel]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0600"
status: reviewed
confidence: 0.84
---

# Generic Tunnel Cluster (0x0600)

## 概述

Generic Tunnel Cluster（Cluster ID `0x0600`）属于 ZCL Rev 7 的 Protocol Interfaces 功能域，章节定位为 9.2-9.4。Generic Tunnel 是 Protocol Interfaces 章节中的协议隧道或 BACnet 风格 I/O/value cluster。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.532-p.536`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0600` |
| 名称 | Generic Tunnel |
| 功能域 | Protocol Interfaces |
| Rev 7 章节 | 9.2-9.4 |
| 来源页 | p.532-p.536 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. The generic cluster provides the minimum common commands and attributes required to discover protocol tunnelling devices. A protocol cluster specific to the protocol being tunneled shall be implemented on the same endpoint as the Generic Tunnel cluster. Note: The reverse is not true, as there may be tunnel clusters that do not require the Generic Tunnel cluster.

### 依赖

The maximum size of the ProtocolAddress attribute is dependent on the protocol supported by any associated specific protocol tunnel cluster supported on the same endpoint (see 9.2.2.2.3, ProtocolAddress Attribute).

### 属性

- `0x0609` Binary input (BACnet extended)
- `0x060A` Binary output (BACnet regular)
- `0x060B` Binary output (BACnet extended)
- `0x060F` Multistate input (BACnet extended)
- `0x0611` Multistate output (BACnet extended)
- `0x0615` ISO7816 Tunnel
- `0x0600` Generic Tunnel
- `0x0001` MaximumIncomingTransferSize uint16 0x0000 - 0xffff R 0x0000 M
- `0x0002` MaximumOutgoingTransferSize uint16 0x0000 - 0xffff R 0x0000 M
- `0x0003` ProtocolAddress

### 命令

- `0x00` Match Protocol Address Response
- `0x01` Advertise Protocol Address

### 行为要点

- The generic cluster provides the minimum common commands and attributes required to discover protocol tunnelling devices.
- A protocol cluster specific to the protocol being tunneled shall be implemented on the same endpoint as the Generic Tunnel cluster.
- Note: The reverse is not true, as there may be tunnel clusters that do not require the Generic Tunnel cluster.
- The ASDU referred to is the ZCL frame, including header and payload, of any command received by a protocol specific tunnel cluster on the same endpoint.
- The overall maximum size of the string is 255 octets, but devices need only support the actual maximum size required by that protocol 9.2.2...

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0600` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
