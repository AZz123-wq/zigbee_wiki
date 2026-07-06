---
title: "11073 Protocol Tunnel Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, protocol-interface, 11073, tunnel]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0614"
status: reviewed
confidence: 0.84
---

# 11073 Protocol Tunnel Cluster (0x0614)

## 概述

11073 Protocol Tunnel Cluster（Cluster ID `0x0614`）属于 ZCL Rev 7 的 Protocol Interfaces 功能域，章节定位为 9.7。11073 Protocol Tunnel 是 Protocol Interfaces 章节中的协议隧道或 BACnet 风格 I/O/value cluster。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.579-p.589`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0614` |
| 名称 | 11073 Protocol Tunnel |
| 功能域 | Protocol Interfaces |
| Rev 7 章节 | 9.7 |
| 来源页 | p.579-p.589 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. The 11073 Protocol Tunnel cluster provides the commands and attributes required to tunnel the 11073 protocol. The server cluster receives 11073 APDUs and the client cluster generates 11073 APDUs, thus it is necessary to have both server and client on an endpoint to tunnel 11073 messages in both directions. Commands and attributes are provided for establishing, querying the status of...

### 依赖

Any endpoint that supports the 11073 Protocol Tunnel server cluster shall also support the Generic Tunnel server cluster (see 9.2). The value of the ProtocolAddress attribute of the associated Generic Tunnel server cluster shall be set equal to the system ID of the 11073 device represented on that endpoint (see [H1]). The system ID, represented as a octet string, shall be 8 octets in Big Endian order...

### 属性

- `0x0000` DeviceIDList
- `0x0001` ManagerTarget IEEE address Any valid IEEE address R - O
- `0x0002` ManagerEndpoint uint8 0x01-0xff R - O
- `0x0003` Connected
- `0x0004` Preemptible

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- The 11073 Protocol Tunnel cluster provides the commands and attributes required to tunnel the 11073 protocol.
- Devices that support this cluster shall also comply with the ISO/IEEE 11073-20601 standard for Personal Health Device Communication [H1] and the applicable ISO/IEEE 11073 device specialization documents [H2] – [H12].
- The value of the ProtocolAddress attribute of the associated Generic Tunnel server cluster shall be set equal to the system ID of the 11073 device represented on that endpoint (see [H1]).
- The system ID, represented as a octet string, shall be 8 octets in Big Endian order.
- For a multifunction device as defined in [Z6], the DeviceIDList attribute is mandatory and shall contain a complete list of supported Device IDs (as defined in [Z6]) supported by the single instance of the 11073 Protocol...

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0614` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
