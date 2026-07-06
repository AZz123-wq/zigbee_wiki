---
title: "Metering Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, smart-energy, metering]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0702"
status: reviewed
confidence: 0.80
---

# Metering Cluster (0x0702)

## 概述

Metering Cluster（Cluster ID `0x0702`）属于 ZCL Rev 7 的 Smart Energy 功能域，章节定位为 10.4。提供 metering device 的能源读数、格式化、镜像和 profile 数据接口。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.640-p.677`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0702` |
| 名称 | Metering |
| 功能域 | Smart Energy |
| Rev 7 章节 | 10.4 |
| 来源页 | p.640-p.677 |

### 规范摘要

This cluster provides an interface for passing text messages between devices. Messages are expected to be delivered via the ESI and then unicast to all individually registered devices implementing the Messaging Cluster on the network, or just made available to all devices for later pickup. Nested and overlapping messages are not allowed. The current active message will be replaced if a new message is received by the ESI. Figure 10-36...

### 依赖

Subscribed reporting of Metering attributes.

### 属性

- `0x0000` CurrentSummationDelivered uint48 0x000000000000 to R - M
- `0x0001` CurrentSummationReceived uint48 R - O
- `0x0002` CurrentMaxDemandDelivered uint48 R - O
- `0x0003` CurrentMaxDemandReceived uint48 R - O
- `0x0004` DFTSummation uint48 R - O
- `0x0005` DailyFreezeTime uint16 0x0000 to 0x183C R 0x0000 O
- `0x0006` PowerFactor int8 -100 to +100 R 0x00 O
- `0x0007` ReadingSnapShotTime
- `0x0008` CurrentMaxDemandDeliveredTime
- `0x0009` CurrentMaxDemandReceivedTime
- `0x000A` DefaultUpdatePeriod uint8 0x00 to 0xFF R 0x1E O
- `0x000B` FastPollUpdatePeriod uint8 0x00 to 0xFF R 0x05 O
- `0x000C` CurrentBlockPeriodConsumptionDelivered uint48 R - O
- `0x000D` DailyConsumptionTarget uint24 R - O
- `0x000E` CurrentBlock enum8 0x00 to 0x10 R - O
- `0x000F` ProfileIntervalPeriod enum8 0x00 to 0xFF R - O
- `0x0010` IntervalReadReportingPeriod uint16 0x0000 to 0xFFFF R 0 O
- `0x0011` PresetReadingTime uint16 0x0000 to 0x173B R 0x0000 O
- `0x0012` VolumePerReport uint16 0x0000 to 0xFFFF R - O
- `0x0013` FlowRestriction uint8 0x00 to 0xFF R - O
- `0x0014` Supply Status enum8 0x00 to 0xFF R - O
- `0x0016` CurrentOutletEnergyCarrierSummation uint48 R - O
- `0x0019` ControlTemperature int24 R - O
- `0x001A` CurrentInletEnergyCarrierDemand int24 R - O
- `0x001B` CurrentOutletEnergyCarrierDemand int24 R - O
- `0x001C` PreviousBlockPeriodConsumptionDelivered uint48 R - O
- `0x0100` CurrentTier1SummationDelivered uint48 R - O
- `0x0101` CurrentTier1SummationReceived uint48 R - O

### 命令

- `0x00` Get Profile
- `0x01` Request Mirror Response
- `0x02` Mirror Removed
- `0x03` Request Fast Poll Mode

### 行为要点

- When received, the ESI will update its mailbox (EndPoint ID Y in Figure 10-28 and Figure 10-29) to reflect the latest data available.
- A reading must support at least one register which is the actual total summation of the delivered quantity (kWh, m³, ft³, ccf, US gl).
- Likewise, the term “Received” refers to the quantity of Energy, Gas, or Water that was received by the utility from the customer.
- This feature set may change before reaching certifiable status in a future revision of this specification.
- 1 Cu rren tSu mmati o n Del i vered Att ri b u te CurrentSummationDelivered represents the most recent summed value of Energy, Gas, or Water delivered and consumed in the premises.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0702` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
