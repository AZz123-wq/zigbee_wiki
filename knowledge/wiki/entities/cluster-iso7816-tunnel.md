---
title: "ISO7816 Tunnel Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, protocol-interface, iso7816, tunnel]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0615"
status: reviewed
confidence: 0.84
---

# ISO7816 Tunnel Cluster (0x0615)

## 概述

ISO7816 Tunnel Cluster（Cluster ID `0x0615`）属于 ZCL Rev 7 的 Protocol Interfaces 功能域，章节定位为 9.5。ISO7816 Tunnel 是 Protocol Interfaces 章节中的协议隧道或 BACnet 风格 I/O/value cluster。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.565-p.572`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0615` |
| 名称 | ISO7816 Tunnel |
| 功能域 | Protocol Interfaces |
| Rev 7 章节 | 9.5 |
| 来源页 | p.565-p.572 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. This cluster provides attributes and commands to tunnel ISO7816 APDUs, enabling solution such as Mobile Office, i.e., a mechanism to authenticate and authorize Users on shared Computer System (said Target Device) by means of a Virtual Smartcard (generically said User Token). A Target Device, enabled by the server side of this cluster...

### 依赖

Since ISO7816 protocol may use APDU frames larger than typical payload, stack fragmentation or Partition cluster shall be supported by the devices supporting this cluster.

### 属性

- `0x0001` Status uint8 0x00-0x01 R 0x00 M

### 命令

- `0x00` Transfer APDU
- `0x01` Insert SmartCard
- `0x02` Extract SmartCard

### 行为要点

- 9.5 ISO 7818 Protocol Tunnel 9.5.1 Scope and Purpose This section specifies a single cluster, the ISO7816 Tunnel cluster, which provides commands and attributes for mobile office solutions.
- This cluster is to provide a standardized interface to enable a scenario of authorization management on mobile office devices (e.g., access to PC resources) 9.5...
- This cluster provides attributes and commands to tunnel ISO7816 APDUs, enabling solution such as Mobile Office, i.e., a mechanism to authenticate and authorize Users on shared Computer System (said Target Device) by mean...
- Server supports only one client connection at a time.
- Status Values Meaning Values 0x00 FREE 0x01 BUSY 9.5.5.3 Commands Received The cluster specific commands received by the ISO7816 Tunnel server cluster are listed in Table 9-27.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0615` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
