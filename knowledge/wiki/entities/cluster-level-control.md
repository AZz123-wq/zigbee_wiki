---
title: "Level Control Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
  - raw/test-specs/docs-15-0312-05-pfnd-0x0008-Level-Control-Test-Specification.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, general, level]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0008"
status: reviewed
confidence: 0.84
---

# Level Control Cluster (0x0008)

## 概述

Level Control Cluster（Cluster ID `0x0008`）属于 ZCL Rev 7 的 General 功能域，章节定位为 3.10 / 3.19。控制可调等级，并在 Lighting 派生规范中定义与 On/Off 联动的灯光等级行为。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.166-p.176; p.293-p.297 (Level Control for Lighting derived behavior)`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0008` |
| 名称 | Level Control |
| 功能域 | General |
| Rev 7 章节 | 3.10 / 3.19 |
| 来源页 | p.166-p.176; p.293-p.297 (Level Control for Lighting derived behavior) |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. This cluster provides an interface for controlling a characteristic of a device that can be set to a level, for example the brightness of a light, the degree of closure of a door, or the power output of a heater. NOTE: This cluster specification is a base cluster for generic level control. Also, in this document, is the Level Control for Lighting cluster specification...

### 依赖

For many applications, a close relationship between this cluster and the On/Off cluster is needed. This section describes the dependencies that are required when an endpoint that implements this server cluster and also implements the On/Off server cluster. The OnOff attribute of the On/Off cluster and the CurrentLevel attribute of the Level Control cluster are intrinsically independent variables, as they are on different clusters. However...

### 属性

- `0x0000` CurrentLevel uint8 MinLevel to MaxLevel RPS 0xff M
- `0x0001` RemainingTime uint16 0x0000 to 0xffff R 0x0000 O
- `0x0002` MinLevel18 uint8 0x00 to MaxLevel R 0x00 O
- `0x0003` MaxLevel19 uint8 MinLevel to 0xff R 0xff O
- `0x0004` CurrentFrequency20 uint16 MinFrequency to MaxFrequency RPS 0x0000 O
- `0x0005` MinFrequency21 uint16 0x0000 to MaxFrequency R 0x0000 O
- `0x0006` MaxFrequency22 uint16 MinFrequency to 0xffff R 0x0000 O
- `0x0010` OnOffTransitionTime uint16 0x0000 to 0xffff RW 0x0000 O
- `0x0011` OnLevel uint8 MinLevel to MaxLevel RW 0xff O
- `0x0012` OnTransitionTime uint16 0x0000 to 0xfffe RW 0xffff O
- `0x0013` OffTransitionTime uint16 0x0000 to 0xfffe RW 0xffff O
- `0x0014` DefaultMoveRate uint16 0x00 to 0xfe RW MS O
- `0x000F` Options23 map8 RW 0x00 O
- `0x4000` StartUpCurrentLevel24 uint8 0x00 to 0xff RW MS O

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- This cluster provides an interface for controlling a characteristic of a device that can be set to a level, for example the brightness of a light, the degree of closure of a door, or the power output of a heater.
- This base cluster specification MAY be used for generic level control; however, it is recommended to derive another cluster to better define the application and domain requirements.
- If one of more derived cluster identifiers and the base identifier exists on a device endpoint, then they SHALL all represent a single instance of the device level control.
- However, when both clusters are implemented on the same endpoint, dependencies MAY be introduced between them.
- If another of these commands is received, before the transition is completed, the originally stored CurrentLevel shall be preserved and restored17.

### 测试规范

- 对应测试规范摘要: [[summaries/2026-05-08-level-control-cluster-test-spec]] (测试要求)

## 关键要点

- `0x0008` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
- 本页保留来源页范围，后续实现、测试或差异分析应引用具体页码和章节。
- 本页区分 Rev 7 协议定义与测试规范要求；测试规范内容只作为认证验证入口。

## 交叉引用

- [[entities/spec-zcl-rev7]]
- [[summaries/2026-05-08-zcl-rev7]]
- [[summaries/2026-05-08-level-control-cluster-test-spec]]
- [[index]]

## 待深入

- [ ] 按实现需求补齐完整属性表的类型、范围、access、默认值和 M/O 条件。
- [ ] 按 command payload 深读补齐 request/response 字段、状态码和时序。
- [ ] 若存在 profile/device type 约束，链接到对应 Device Type 或测试规范页面。
