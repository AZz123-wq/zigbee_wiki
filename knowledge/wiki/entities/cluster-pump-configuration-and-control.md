---
title: "Pump Configuration and Control Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, hvac, pump]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0200"
status: reviewed
confidence: 0.84
---

# Pump Configuration and Control Cluster (0x0200)

## 概述

Pump Configuration and Control Cluster（Cluster ID `0x0200`）属于 ZCL Rev 7 的 HVAC 功能域，章节定位为 6.2。配置和控制 pump 设备，并报告 pump 状态与告警。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.396-p.407`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0200` |
| 名称 | Pump Configuration and Control |
| 功能域 | HVAC |
| Rev 7 章节 | 6.2 |
| 来源页 | p.396-p.407 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. The Pump Configuration and Control cluster provides an interface for the setup and control of pump devices, and the automatic reporting of pump status information. Note that control of pump speed is not included – speed is controlled by the On/Off and Level Control clusters.

### 依赖

Where external pressure, flow, and temperature measurements are processed by this cluster (see Table 6-8), these are provided by a Pressure Measurement cluster (4.5), a Flow Measurement cluster (4.6), and a Temperature Measurement client cluster (4.4), respectively. These 3 client clusters are used for connection to a remote sensor device. The pump is able to use the sensor measurement provided by a remote sensor for regulation of the pump speed...

### 属性

- `0x0000` MaxPressure int16 0x8001-0x7fff R - M
- `0x0003` MinConstPressure int16 0x8001-0x7fff R - O
- `0x0004` MaxConstPressure int16 0x8001-0x7fff R - O
- `0x0005` MinCompPressure int16 0x8001-0x7fff R - O
- `0x0006` MaxCompPressure int16 0x8001-0x7fff R - O
- `0x0010` PumpStatus map16 - RP - O
- `0x0013` Capacity int16 0x0000-0x7fff RP - M
- `0x0014` Speed uint16 0x0000 - 0xfffe R - O
- `0x0015` LifetimeRunningHours uint24 0x000000 - 0xfffffe RW 0 O
- `0x0016` Power uint24 0x000000 - 0xfffffe RW - O
- `0x0017` LifetimeEnergyConsumed uint32 0x00000000 - 0xfffffffe R 0 O
- `0x0022` AlarmMask map16 - R - O

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- The Pump Configuration and Control cluster provides an interface for the setup and control of pump devices, and the automatic reporting of pump status information.
- For the alarms, described in Table 6-9, to be operational, the Alarms server cluster (3.11) SHALL be implemented on the same endpoint.
- Note that control of the pump setpoint is not included in this cluster – the On/Off and Level Control clusters (see Figure 6-1) MAY be used by a pump device to turn it on and off and control its setpoint.
- Note that the Pump Configuration and Control Cluster MAY override on/off/setpoint settings for specific operation modes (See section 6.2.2.2.3.1 for detailed description of the operation and control of the pump.).
- MaxConstTemp SHALL be greater than or equal to MinConstTemp ZigBee Cluster Library Specification Chapter 6 ZigBee Document – 075123 HVAC Valid range is –273.15 C to 327.67 C (steps of 0.01 C).

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0200` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
