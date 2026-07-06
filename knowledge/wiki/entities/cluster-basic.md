---
title: "Basic Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
  - raw/test-specs/docs-15-0302-05-pfnd-0x0000-Basic-Cluster-Test-Specification-Draft.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, general, basic]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0000"
status: reviewed
confidence: 0.84
---

# Basic Cluster (0x0000)

## 概述

Basic Cluster（Cluster ID `0x0000`）属于 ZCL Rev 7 的 General 功能域，章节定位为 3.2。提供节点/物理设备基础信息、用户可配置位置、使能状态，以及恢复出厂默认值命令。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.106-p.117`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0000` |
| 名称 | Basic |
| 功能域 | General |
| Rev 7 章节 | 3.2 |
| 来源页 | p.106-p.117 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. This cluster supports an interface to the node or physical device. It provides attributes and commands for determining basic information, setting user information such as location, and resetting to factory defaults. Note: Where a node supports multiple endpoints, it will often be the case that many of these settings will apply to the whole node, that is...

### 依赖

For the alarms functionality of this cluster to be operational, the Alarms cluster server SHALL be implemented on the same endpoint.

### 属性

- `0x0000` ZCLVersion uint8 0x00 to 0xff R 0x03 M
- `0x0001` ApplicationVersion uint8 0x00 to 0xff R 0x00 O
- `0x0002` StackVersion uint8 0x00 to 0xff R 0x00 O
- `0x0003` HWVersion uint8 0x00 to 0xff R 0x00 O
- `0x0004` ManufacturerName
- `0x0005` ModelIdentifier
- `0x0006` DateCode
- `0x0007` PowerSource enum8 0x00 to 0xff R 0x00 M
- `0x0008` GenericDevice-Class8 enum8 0x00 to 0xff R 0xff O
- `0x0009` GenericDevice-
- `0x000A` ProductCode
- `0x000B` ProductURL
- `0x000C` ManufacturerVersionDetails
- `0x000D` SerialNumber
- `0x000E` ProductLabel
- `0x0010` LocationDescription
- `0x0011` PhysicalEnvironment enum8 0x00 to 0xff RW 0x00 O
- `0x0012` DeviceEnabled
- `0x0013` AlarmMask map8 000000xx RW 0x00 O
- `0x0014` DisableLocalConfig map8 000000xx RW 0x00 O
- `0x4000` SWBuildID

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- This cluster supports an interface to the node or physical device.
- It provides attributes and commands for determining basic information, setting user information such as location, and resetting to factory defaults.
- Note: Where a node supports multiple endpoints, it will often be the case that many of these settings will apply to the whole node, that is, they are the same for every endpoint on the node.
- For this version of the ZCL, this attribute SHALL be set to 0x03.
- The final 8 characters MAY include country, factory, line, shift or other related information at the option of the manufacturer.

### 测试规范

- 对应测试规范摘要: [[summaries/2026-05-08-basic-cluster-test-spec]] (draft 测试要求)

## 关键要点

- `0x0000` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
- 本页保留来源页范围，后续实现、测试或差异分析应引用具体页码和章节。
- 本页区分 Rev 7 协议定义与测试规范要求；测试规范内容只作为认证验证入口。

## 交叉引用

- [[entities/spec-zcl-rev7]]
- [[summaries/2026-05-08-zcl-rev7]]
- [[summaries/2026-05-08-basic-cluster-test-spec]]
- [[index]]

## 待深入

- [ ] 按实现需求补齐完整属性表的类型、范围、access、默认值和 M/O 条件。
- [ ] 按 command payload 深读补齐 request/response 字段、状态码和时序。
- [ ] 若存在 profile/device type 约束，链接到对应 Device Type 或测试规范页面。
