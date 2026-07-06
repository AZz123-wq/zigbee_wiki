---
title: "Groups Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
  - raw/test-specs/docs-15-0306-05-pfnd-0x0004-Groups-Cluster-Test-Specification.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, general, groups]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0004"
status: reviewed
confidence: 0.84
---

# Groups Cluster (0x0004)

## 概述

Groups Cluster（Cluster ID `0x0004`）属于 ZCL Rev 7 的 General 功能域，章节定位为 3.6。管理 endpoint 的 group table，使多个设备可通过 group address 被共同寻址。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.133-p.142`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0004` |
| 名称 | Groups |
| 功能域 | General |
| Rev 7 章节 | 3.6 |
| 来源页 | p.133-p.142 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. Chapter 3 Zigbee Cluster Library Specification General Zigbee Alliance Document – 075123 The stack specification provides the capability for group addressing. That is, any endpoint on any device MAY be assigned to one or more groups, each labeled with a 16-bit identifier (0x0001 to 0xfff7), which acts for all intents and purposes like a network address. Once a group is established...

### 依赖

For correct operation of the 'Add group if identifying' command, any endpoint that implements the Groups server cluster SHALL also implement the Identify server cluster.

### 属性

- `0x0000` NameSupport map8 x0000000 R - M

### 命令

- `0x00` Add group response
- `0x01` View group response
- `0x02` Get group membership response
- `0x03` Remove group response
- `0x04` Remove all groups
- `0x05` Add group if identifying

### 行为要点

- Chapter 3 Zigbee Cluster Library Specification General Zigbee Alliance Document – 075123 The stack specification provides the capability for group addressing.
- That is, any endpoint on any device MAY be assigned to one or more groups, each labeled with a 16-bit identifier (0x0001 to 0xfff7), which acts for all intents and purposes like a network address.
- It is therefore not Mandatory but only optional to support the Groups and Scenes Server cluster if the device is a Sleeping end device (even when listed as Mandatory).
- Note that, since these commands are simply data frames sent using the APSDE_SAP, they must be addressed with respect to device and endpoint.
- In particular, the destination device and endpoint of a group management command must be unambiguous at the time of the issuance of the primitive either because: 1.

### 测试规范

- 对应测试规范摘要: [[summaries/2026-05-08-groups-cluster-test-spec]] (测试要求)

## 关键要点

- `0x0004` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
- 本页保留来源页范围，后续实现、测试或差异分析应引用具体页码和章节。
- 本页区分 Rev 7 协议定义与测试规范要求；测试规范内容只作为认证验证入口。

## 交叉引用

- [[entities/spec-zcl-rev7]]
- [[summaries/2026-05-08-zcl-rev7]]
- [[summaries/2026-05-08-groups-cluster-test-spec]]
- [[index]]

## 待深入

- [ ] 按实现需求补齐完整属性表的类型、范围、access、默认值和 M/O 条件。
- [ ] 按 command payload 深读补齐 request/response 字段、状态码和时序。
- [ ] 若存在 profile/device type 约束，链接到对应 Device Type 或测试规范页面。
