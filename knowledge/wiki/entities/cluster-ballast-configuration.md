---
title: "Ballast Configuration Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
  - raw/test-specs/16-02819-002-0x0301-Ballast-Configuration-Cluster-Test-Specification-Draft.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, lighting, ballast]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0301"
status: reviewed
confidence: 0.84
---

# Ballast Configuration Cluster (0x0301)

## 概述

Ballast Configuration Cluster（Cluster ID `0x0301`）属于 ZCL Rev 7 的 Lighting 功能域，章节定位为 5.3。配置照明 ballast 的物理/灯具信息和调光曲线参数。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.386-p.394`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0301` |
| 名称 | Ballast Configuration |
| 功能域 | Lighting |
| Rev 7 章节 | 5.3 |
| 来源页 | p.386-p.394 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. This cluster is used for configuring a lighting ballast.

### 依赖

For the alarm functionality specified by this cluster to be operational, the Alarms server cluster SHALL be implemented on the same endpoint. Chapter 5 ZigBee Cluster Library Specification Lighting ZigBee Document – 075123

### 属性

- `0x0002` BallastStatus map8 0000 00xx R 0000 0000 O94
- `0x0030` LampType
- `0x0031` LampManufacturer
- `0x0034` LampAlarmMode map8 0000 000x RW 0000 0000 O

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- This attribute SHALL be specified in the range 0x01 to 0xfe, and specifies the light output of the ballast according to the dimming light curve (see 5.3.4).
- Where a function is active, the corresponding bit SHALL be set to 1.
- Where a function is not active, the corresponding bit SHALL be set to 0.
- The value of this attribute SHALL be both greater than or equal to PhysicalMinLevel and less than or equal to MaxLevel.
- If an attempt is made to set this attribute to a level where these conditions are not met, a default response command SHALL be returned with status code set to INVALID_VALUE, and the level SHALL not be set.

### 测试规范

- 对应测试规范摘要: [[summaries/2026-05-08-ballast-configuration-cluster-test-spec]] (draft 测试要求)

## 关键要点

- `0x0301` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
- 本页保留来源页范围，后续实现、测试或差异分析应引用具体页码和章节。
- 本页区分 Rev 7 协议定义与测试规范要求；测试规范内容只作为认证验证入口。

## 交叉引用

- [[entities/spec-zcl-rev7]]
- [[summaries/2026-05-08-zcl-rev7]]
- [[summaries/2026-05-08-ballast-configuration-cluster-test-spec]]
- [[index]]

## 待深入

- [ ] 按实现需求补齐完整属性表的类型、范围、access、默认值和 M/O 条件。
- [ ] 按 command payload 深读补齐 request/response 字段、状态码和时序。
- [ ] 若存在 profile/device type 约束，链接到对应 Device Type 或测试规范页面。
