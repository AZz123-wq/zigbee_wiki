---
title: "Partition Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, protocol-interface, partition]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0016"
status: reviewed
confidence: 0.84
---

# Partition Cluster (0x0016)

## 概述

Partition Cluster（Cluster ID `0x0016`）属于 ZCL Rev 7 的 Protocol Interfaces 功能域，章节定位为 9.6。把大帧分区传输为多个片段，并定义 ACK/NACK、分区大小和重传计时相关属性。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.571-p.580`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0016` |
| 名称 | Partition |
| 功能域 | Protocol Interfaces |
| Rev 7 章节 | 9.6 |
| 来源页 | p.571-p.580 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. The 11073 Protocol Tunnel cluster provides the commands and attributes required to tunnel the 11073 protocol. The server cluster receives 11073 APDUs and the client cluster generates 11073 APDUs, thus it is necessary to have both server and client on an endpoint to tunnel 11073 messages in both directions. Commands and attributes are provided for establishing, querying the status of...

### 依赖

None

### 属性

- `0x0000` MaximumIncomingTransferSize uint16 0x0000-0xffff R 0x0500 M
- `0x0001` MaximumOutgoingTransferSize uint16 0x0000-0xffff R 0x0500 M
- `0x0002` PartionedFrameSize uint8 0x00-0xff RW 0x50 M
- `0x0003` LargeFrameSize uint16 0x0000-0xffff RW 0x0500 M
- `0x0004` NumberOfACKFrame uint8 0x00-0xff RW 0x64 M
- `0x0006` InterframeDelay uint8 Default-0xff RW M
- `0x0007` NumberOfSendRetries uint8 0x00-0xff R 0x03 M
- `0x0009` ReceiverTimeout uint16 Default-0xffff R InterframeDelay M

### 命令

- Server received `0x00` TransferPartitionedFrame
- Server received `0x01` ReadHandshakeParam
- Server received `0x02` WriteHandshakeParam
- Server generated `0x00` MultipleACK
- Server generated `0x01` ReadHandshakeParamResponse

### 行为要点

- Client and Server in Partition Cluster 12242 12243 A simple way to enable the use of the partition cluster should be to define a specific API that would support the sending/receive functionalities through the use of Part...
- This command may pass a handler to the sequence of bytes corresponding to the ZCL message of the specific cluster using the Partition Cluster.
- In order to operate using the Partition Cluster the application may want to manage the transmission and reception of large frames running the handshake phase described in 9.6.5.
- Rather than pushing the large frame to the application, the Partition Cluster may only inform the application that a packet has arrived (very short packet that can be fed through the stack).
- The ASDU referred to is the ZCL frame, including header and payload, of any command received by a Partition cluster on the same endpoint.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0016` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
