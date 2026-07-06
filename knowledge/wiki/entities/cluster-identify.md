---
title: "Identify Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
  - raw/test-specs/docs-15-0304-05-pfnd-0x0003-Identify-Cluster-Test-Specification-Draft.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, general, identify]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0003"
status: reviewed
confidence: 0.84
---

# Identify Cluster (0x0003)

## 概述

Identify Cluster（Cluster ID `0x0003`）属于 ZCL Rev 7 的 General 功能域，章节定位为 3.5。控制设备进入识别状态，并支持查询识别剩余时间。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.129-p.134`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0003` |
| 名称 | Identify |
| 功能域 | General |
| Rev 7 章节 | 3.5 |
| 来源页 | p.129-p.134 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. Attributes and commands to put a device into an Identification mode (e.g., flashing a light), that indicates to an observer – e.g., an installer - which of several devices it is, also to request any device that is identifying itself to respond to the initiator...

### 依赖

本次页级精读未抽取到独立的 Dependencies 小节；如实现依赖其他 cluster、profile 或设备类型，应回到来源页和应用规范一起确认。

### 属性

- `0x0003` Identify
- `0x0000` IdentifyTime uint16 0x0000 to 0xffff RW 0x0000 M

### 命令

- `0x00` Identify Query Response
- `0x01` Breathe e.g., Light turned on/off over 1 second and repeated 15 times.
- `0x40` Trigger effect
- `0x02` Okay e.g., Colored light turns green for 1 second; noncolored light flashes
- `0x0B` Channel change e.g., Colored light turns orange for 8 seconds; noncolored light
- `0xFE` Finish effect Complete the current effect sequence before terminating. e.g., if in
- `0xFF` Stop effect Terminate the effect as soon as possible.

### 行为要点

- If this attribute is set to a value other than 0x0000 then the device SHALL enter its identification procedure, in order to indicate to an observer which of several devices it is.
- The IdentifyTime attribute SHALL be decremented every second.
- If this attribute reaches or is set to the value 0x0000 then the device SHALL terminate its identification procedure.
- 3.5.2.2 Commands Received The server side of the identify cluster is capable of receiving the commands listed in Table 3-32.
- Received Command IDs for the Identify Cluster Command Identifier Description M/O 0x00 Identify M 0x01 Identify Query M 0x40 Trigger effect O 3.5.2.2...

### 测试规范

- 对应测试规范摘要: [[summaries/2026-05-08-identify-cluster-test-spec]] (draft 测试要求)

## 关键要点

- `0x0003` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
- 本页保留来源页范围，后续实现、测试或差异分析应引用具体页码和章节。
- 本页区分 Rev 7 协议定义与测试规范要求；测试规范内容只作为认证验证入口。

## 交叉引用

- [[entities/spec-zcl-rev7]]
- [[summaries/2026-05-08-zcl-rev7]]
- [[summaries/2026-05-08-identify-cluster-test-spec]]
- [[index]]

## 待深入

- [ ] 按实现需求补齐完整属性表的类型、范围、access、默认值和 M/O 条件。
- [ ] 按 command payload 深读补齐 request/response 字段、状态码和时序。
- [ ] 若存在 profile/device type 约束，链接到对应 Device Type 或测试规范页面。
