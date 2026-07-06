---
title: "EN50523 Appliance Control Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, appliance, en50523]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x001B"
status: reviewed
confidence: 0.84
---

# EN50523 Appliance Control Cluster (0x001B)

## 概述

EN50523 Appliance Control Cluster（Cluster ID `0x001B`）属于 ZCL Rev 7 的 Appliance 功能域，章节定位为 15.2。远程控制和编程家用电器的 start/stop/pause 等操作。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.903-p.913`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x001B` |
| 名称 | EN50523 Appliance Control |
| 功能域 | Appliance |
| Rev 7 章节 | 15.2 |
| 来源页 | p.903-p.913 |

### 规范摘要

Please see section 2.2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc This cluster provides an interface to remotely control and to program household appliances. Example of control is Start, Stop and Pause commands. The status “read” and “set” is compliant to the EN50523 “Signal State” and “Execute Command” functional blocks. Appliances parameters (e.g., Duration and Remaining Time) have been added, since they were missing from the original specs...

### 依赖

本次页级精读未抽取到独立的 Dependencies 小节；如实现依赖其他 cluster、profile 或设备类型，应回到来源页和应用规范一起确认。

### 属性

- 未从页级文本中稳定抽取到属性表行；该 cluster 可能以命令为主，或表格需要按来源页人工复核。

### 命令

- `0x00` Signal State Response
- `0x01` Signal State Notification
- `0x02` Write Functions
- `0x03` Overload Pause Resume
- `0x04` Overload Pause
- `0x05` Overload Warning

### 行为要点

- 15.2.1 Overview Please see section 2.2 for a general cluster overview defining cluster architecture, revision, classification, identification...
- Typical Usage of the Appliance Control Cluster 20145 Note: Where a physical node supports multiple endpoints it will often be the case that many of these settings will apply to the whole node, that is...
- Table 15-4 provides details about time encoding which is used for StartTime attribute organization.
- It represents the time remaining to complete the machine cycle and it is updated only during the RUNNING state of the Appliance.
- 15.2.4 Server Commands Received The command IDs for the Appliance Control cluster are listed in Table 15-5.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x001B` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
