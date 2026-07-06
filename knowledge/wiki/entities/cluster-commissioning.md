---
title: "Commissioning Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, commissioning]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0015"
status: reviewed
confidence: 0.84
---

# Commissioning Cluster (0x0015)

## 概述

Commissioning Cluster（Cluster ID `0x0015`）属于 ZCL Rev 7 的 Commissioning 功能域，章节定位为 13.2。管理 Zigbee stack startup、join、end-device 和 concentrator 参数。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.833-p.850`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0015` |
| 名称 | Commissioning |
| 功能域 | Commissioning |
| Rev 7 章节 | 13.2 |
| 来源页 | p.833-p.850 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. This cluster provides attributes and commands pertaining to the commissioning and management of devices operating in a network. This cluster will typically be supported using a “Commissioning Tool.” But, depending on the application and installation scenario, this tool may take many forms. For purposes of this document...

### 依赖

None ZigBee Cluster Library Specification Chapter 13 ZigBee Document – 075123 Commissioning

### 属性

- `0x0015` Commissioning
- `0x0001` ExtendedPANId EUI64 0xffffffffffffffff RW M
- `0x0002` PANId uint16 0x0000 - 0xffff - RW M
- `0x0003` Channelmask map32 - RW M
- `0x0004` ProtocolVersion uint8 0x02 - RW M
- `0x0005` StackProfile uint8 0x01 - 0x02 - RW M
- `0x0006` StartupControl enum8 0x00 - 0x03 - RW M
- `0x0010` TrustCenterAddress EUI64 Any valid IEEE Address all zeros RW M
- `0x0011` TrustCenterMasterKey key128 Any 128-bit value all zeros RW O
- `0x0012` NetworkKey key128 Any 128-bit value all zeros RW M
- `0x0013` UseInsecureJoin
- `0x0014` PreconfiguredLinkKey key128 Any 128-bit value all zeros RW M
- `0x0016` NetworkKeyType enum8 Any valid key
- `0x0017` NetworkManagerAddress uint16 Any valid network address 0x000 RW M
- `0x0021` TimeBetweenScans uint16 0x0001 - 0xffff 0x64 RW O
- `0x0022` RejoinInterval uint16 0x0001 - MaxRejoinInterval 0x3c RW O
- `0x0023` MaxRejoinInterval uint16 0x0001 - 0xffff 0x0e10 RW O
- `0x0031` ParentRetryThreshold uint8 0x00 - 0xff - R O
- `0x0040` ConcentratorFlag
- `0x0041` ConcentratorRadius uint8 0x00 - 0xff 0x0f RW O
- `0x0042` ConcentratorDiscoveryTime uint8 0x00 - 0xff 0x0000 RW O

### 命令

- `0x00` Restart Device Response
- `0x01` Save Startup Parameters Response
- `0x02` Restore Startup Parameters Response
- `0x03` Reset Startup Parameters Response

### 行为要点

- This cluster provides attributes and commands pertaining to the commissioning and management of devices operating in a network.
- This cluster will typically be supported using a “Commissioning Tool.” But, depending on the application and installation scenario, this tool may take many forms.
- For purposes of this document, any device that implements the client side of this cluster may be considered a commissioning tool.
- As with all clusters defined in the Cluster Library, an application may have as many instances of this cluster as needed and may place them on any addressable endpoint.
- This, and any other methods used to authorize commissioning tools and other devices acting as a client for this cluster, shall be detailed in any Application Profile documents that use it.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0015` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
