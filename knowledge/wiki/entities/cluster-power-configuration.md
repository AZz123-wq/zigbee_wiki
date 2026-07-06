---
title: "Power Configuration Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, general, power]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0001"
status: reviewed
confidence: 0.84
---

# Power Configuration Cluster (0x0001)

## 概述

Power Configuration Cluster（Cluster ID `0x0001`）属于 ZCL Rev 7 的 General 功能域，章节定位为 3.3。描述设备电源、电池、电压/频率监控和相关告警阈值。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.117-p.126`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0001` |
| 名称 | Power Configuration |
| 功能域 | General |
| Rev 7 章节 | 3.3 |
| 来源页 | p.117-p.126 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. Attributes for determining detailed information about a device’s power source(s) and for configuring under/over voltage alarms.

### 依赖

Any endpoint that implements this server cluster SHALL also implement the Basic server cluster. For the alarm functionality described in this cluster to be operational, any endpoint that implements the Power Configuration server cluster must also implement the Alarms server cluster (see sub-clause Alarms). Chapter 3 Zigbee Cluster Library Specification General Zigbee Alliance Document – 075123

### 属性

- `0x0001` Power Configuration
- `0x0000` MainsVoltage uint16 0x0000 to 0xffff R - O
- `0x0010` MainsAlarmMask map8 0000 00xx RW 0000 0000 O
- `0x0011` MainsVoltageMinThreshold uint16 0x0000 to 0xffff RW 0x0000 O
- `0x0012` MainsVoltageMaxThreshold uint16 0x0000 to 0xffff RW 0xffff O
- `0x0013` MainsVoltageDwellTripPoint uint16 0x0000 to 0xffff RW 0x0000 O
- `0x0020` BatteryVoltage uint8 0x00 to 0xff R - O
- `0x0021` BatteryPercentageRemaining uint8 0x00 to 0xff 0 O
- `0x0030` BatteryManufacturer
- `0x0031` BatterySize enum8 0x00 to 0xff RW 0xff O
- `0x0032` BatteryAHrRating uint16 0x0000 to 0xffff RW - O
- `0x0033` BatteryQuantity uint8 0x00 to 0xff RW - O
- `0x0034` BatteryRatedVoltage uint8 0x00 to 0xff RW - O
- `0x0035` BatteryAlarmMask map8 0000 000x RW 0000 0000 O
- `0x0036` BatteryVoltageMinThreshold uint8 0x00 to 0xff RW 0x0000 O

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- For the alarm functionality described in this cluster to be operational, any endpoint that implements the Power Configuration server cluster must also implement the Alarms server cluster (see sub-clause Alarms).
- Zigbee Cluster Library Specification Chapter 3 In the case of a DC supply, this attribute SHALL also have the value zero.
- If the Alarms cluster is not present on the same device, they MAY be omitted.
- 1 MainsAlarmMask Att ri b u te The MainsAlarmMask attribute is 8 bits in length and specifies which mains alarms MAY be generated, as listed in Table 3-20.
- The value of this attribute SHALL be less than MainsVoltageMaxThreshold.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0001` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
