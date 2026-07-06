---
title: "Device Temperature Configuration Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, general, temperature]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0002"
status: reviewed
confidence: 0.84
---

# Device Temperature Configuration Cluster (0x0002)

## 概述

Device Temperature Configuration Cluster（Cluster ID `0x0002`）属于 ZCL Rev 7 的 General 功能域，章节定位为 3.4。暴露设备内部温度与过温/欠温告警配置。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.126-p.130`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0002` |
| 名称 | Device Temperature Configuration |
| 功能域 | General |
| Rev 7 章节 | 3.4 |
| 来源页 | p.126-p.130 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. Attributes for determining information about a device’s internal temperature, and for configuring under/over temperature alarms for temperatures that are outside the device's operating range.

### 依赖

For the alarm functionality described in this cluster to be operational, any endpoint that implements the Device Temperature Configuration server cluster SHALL also implement the Alarms server cluster (see 3.11).

### 属性

- `0x0002` Device Temperature Configuration
- `0x0000` CurrentTemperature int16 -200 to +200 R - M
- `0x0001` MinTempExperienced int16 -200 to +200 R - O
- `0x0003` OverTempTotalDwell uint16 0x0000 to 0xffff R 0 O
- `0x0010` DeviceTempAlarmMask map8 0000 00xx RW 0000 0000 O
- `0x0011` LowTempThreshold int16 -200 to +200 RW - O
- `0x0012` HighTempThreshold int16 -200 to +200 RW - O
- `0x0013` LowTempDwellTripPoint uint24 0x000000 to 0xffffff RW - O
- `0x0014` HighTempDwellTripPoint uint24 0x000000 to 0xffffff RW - O

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- This attribute SHALL be specified in the range –200 to +200.
- If the Alarms cluster is not present on the same device, they MAY be omitted.
- 1 DeviceTempAlarmMask Attri b u te The DeviceTempAlarmMask attribute is 8 bits in length and specifies which alarms MAY be generated, as listed in Table 3-30.
- The value of this attribute SHALL be less than HighTempThreshold.
- Zigbee Cluster Library Specification Chapter 3 If the value of CurrentTemperature drops below the threshold specified by LowTempThreshold, the device SHALL start a timer to expire after LowTempDwellTripPoint seconds.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0002` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
