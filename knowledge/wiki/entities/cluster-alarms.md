---
title: "Alarms Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, general, alarms]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0009"
status: reviewed
confidence: 0.84
---

# Alarms Cluster (0x0009)

## 概述

Alarms Cluster（Cluster ID `0x0009`）属于 ZCL Rev 7 的 General 功能域，章节定位为 3.11。复位、获取和上报其他 cluster 或设备基础告警。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.176-p.181`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0009` |
| 名称 | Alarms |
| 功能域 | General |
| Rev 7 章节 | 3.11 |
| 来源页 | p.176-p.181 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. Attributes and commands for sending alarm notifications and configuring alarm functionality. Alarm conditions and their respective alarm codes are described in individual clusters, along with an alarm mask field. Alarm notifications are reported to subscribed targets using binding. Where an alarm table is implemented, all alarms, masked or otherwise...

### 依赖

Any endpoint which implements time stamping SHALL also implement the Time server cluster.

### 属性

- `0x0009` Alarms
- `0x0000` AlarmCount uint16 0x00 to maximum R 0x00 O

### 命令

- `0x00` Alarm
- `0x01` Get alarm response
- `0x02` Get Alarm
- `0x03` Reset alarm log

### 行为要点

- Where an alarm table is implemented, all alarms, masked or otherwise, are recorded and MAY be retrieved on demand.
- Alarms MAY either reset automatically when the conditions that cause are no longer active, or MAY need to be explicitly reset.
- This attribute SHALL be specified in the range 0x00 to the maximum defined in the profile using this cluster.
- If alarm logging is not implemented this attribute SHALL always take the value 0x00.
- 3.11.2.3 Alarm Table The alarm table is used to store details of alarms generated within the devices.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0009` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
