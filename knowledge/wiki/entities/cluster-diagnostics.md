---
title: "Diagnostics Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, general, diagnostics]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0B05"
status: reviewed
confidence: 0.84
---

# Diagnostics Cluster (0x0B05)

## 概述

Diagnostics Cluster（Cluster ID `0x0B05`）属于 ZCL Rev 7 的 General 功能域，章节定位为 3.15。提供硬件、MAC、NWK、APS、安全和邻居相关诊断计数器。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.248-p.255`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0B05` |
| 名称 | Diagnostics |
| 功能域 | General |
| Rev 7 章节 | 3.15 |
| 来源页 | p.248-p.255 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. The diagnostics cluster provides access to information regarding the operation of the stack over time. This information is useful to installers and other network administrators who wish to know how a particular device is functioning on the network. The Diagnostics Cluster needs to understand the performance of the network over time in order to isolate network routing issues...

### 依赖

本次页级精读未抽取到独立的 Dependencies 小节；如实现依赖其他 cluster、profile 或设备类型，应回到来源页和应用规范一起确认。

### 属性

- `0x0000` Hardware Information
- `0x0100` Stack/Network Information
- `0x0001` PersistentMemoryWrites uint16 0x0000 to 0xffff R 0x00000000 O
- `0x0101` MacTxBcast uint32 0x00000000 to 0xffffffff R 0 O
- `0x0102` MacRxUcast uint32 0x00000000 to 0xffffffff R 0 O
- `0x0103` MacTxUcast uint32 0x00000000 to 0xffffffff R 0 O
- `0x0104` MacTxUcastRetry uint16 0x0000 to 0xffff R 0 O
- `0x0105` MacTxUcastFail uint16 0x0000 to 0xffff R 0 O
- `0x0106` APSRxBcast uint16 0x0000 to 0xffff R 0 O
- `0x0107` APSTxBcast uint16 0x0000 to 0xffff R 0 O
- `0x0108` APSRxUcast uint16 0x0000 to 0xffff R 0 O
- `0x0109` APSTxUcastSuccess uint16 0x0000 to 0xffff R 0 O
- `0x010A` APSTxUcastRetry uint16 0x0000 to 0xffff R 0 O
- `0x010B` APSTxUcastFail uint16 0x0000 to 0xffff R 0 O
- `0x010C` RouteDiscInitiated uint16 0x0000 to 0xffff R 0 O
- `0x010D` NeighborAdded uint16 0x0000 to 0xffff R 0 O
- `0x010E` NeighborRemoved uint16 0x0000 to 0xffff R 0 O
- `0x010F` NeighborStale uint16 0x0000 to 0xffff R 0 O
- `0x0110` JoinIndication uint16 0x0000 to 0xffff R 0 O
- `0x0111` ChildMoved uint16 0x0000 to 0xffff R 0 O
- `0x0112` NWKFCFailure uint16 0x0000 to 0xffff R 0 O
- `0x0113` APSFCFailure uint16 0x0000 to 0xffff R 0 O
- `0x0114` APSUnauthorizedKey uint16 0x0000 to 0xffff R 0 O
- `0x0115` NWKDecryptFailures uint16 0x0000 to 0xffff R 0 O
- `0x0116` APSDecryptFailures uint16 0x0000 to 0xffff R 0 O
- `0x0117` PacketBufferAllocateFailures uint16 0x0000 to 0xffff R 0 O
- `0x0118` RelayedUcast uint16 0x0000 to 0xffff R 0 O
- `0x0119` PhytoMACqueuelimitreached uint16 0x0000 to 0xffff R 0 O

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- The diagnostics cluster provides access to information regarding the operation of the stack over time.
- 22 NW KDecr yp tF ai l u res Att ri b u te A counter that is incremented each time a NWK encrypted message was received but dropped because decryption failed.
- 23 APSDecr yp tF ai l u re s Attri b u te A counter that is incremented each time an APS encrypted message was received but dropped because decryption failed.
- 28 L astM e ssag eL Q I Att ri b u te This is the Link Quality Indicator for the last message received.
- For some implementations LQI is related directly to RSSI for others it is a function of the number of errors received over a fixed number of bytes in a given message.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0B05` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
