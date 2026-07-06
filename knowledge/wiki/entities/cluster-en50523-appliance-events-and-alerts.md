---
title: "EN50523 Appliance Events and Alerts Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, appliance, en50523]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0B02"
status: reviewed
confidence: 0.84
---

# EN50523 Appliance Events and Alerts Cluster (0x0B02)

## 概述

EN50523 Appliance Events and Alerts Cluster（Cluster ID `0x0B02`）属于 ZCL Rev 7 的 Appliance 功能域，章节定位为 15.4。提供电器事件和告警结构、通知和确认接口。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.917-p.924`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0B02` |
| 名称 | EN50523 Appliance Events and Alerts |
| 功能域 | Appliance |
| Rev 7 章节 | 15.4 |
| 来源页 | p.917-p.924 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. Attributes and commands for transmitting or notifying the occurrence of an event, such as “temperature reached” and of an alert such as alarm, fault or warning. It is based on the “Signal event” syntax of EN50523 and completed where necessary. Chapter 15 ZigBee Cluster Library Specification Appliance ZigBee Document – 075123 Figure 15-7...

### 依赖

本次页级精读未抽取到独立的 Dependencies 小节；如实现依赖其他 cluster、profile 或设备类型，应回到来源页和应用规范一起确认。

### 属性

- 未从页级文本中稳定抽取到属性表行；该 cluster 可能以命令为主，或表格需要按来源页人工复核。

### 命令

- `0x00` Get Alerts Response
- `0x01` Alerts Notification
- `0x02` Event Notification

### 行为要点

- Received Commands IDs for the Events and Alerts Cluster Command Identifier Description M/O Field Value 0x00 Get Alerts M 20423 15.4.2.2...
- 2 Effects o n Recei p t On receipt of this command, the device SHALL generate a Get Alerts Response command.
- 15.4.2.3 Commands Generated The generated command IDs for the Appliance Events and Alerts Cluster are listed in Table 15-18.
- 1 Payl o ad F o rmat The payload SHALL be formatted as illustrated in Figure 15-8.
- Table 15-19 provides details about Alerts Count and Structure field organization.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0B02` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
