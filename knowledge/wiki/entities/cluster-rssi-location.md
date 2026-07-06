---
title: "RSSI Location Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, general, location]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x000B"
status: reviewed
confidence: 0.84
---

# RSSI Location Cluster (0x000B)

## 概述

RSSI Location Cluster（Cluster ID `0x000B`）属于 ZCL Rev 7 的 General 功能域，章节定位为 3.13。交换位置、RSSI、信道参数，并可向中心节点报告定位数据。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.184-p.199`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x000B` |
| 名称 | RSSI Location |
| 功能域 | General |
| Rev 7 章节 | 3.13 |
| 来源页 | p.184-p.199 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. This cluster provides a means for exchanging Received Signal Strength Indication (RSSI) information among one hop devices as well as messages to report RSSI data to a centralized device that collects all the RSSI data in the network. An example of the usage of RSSI location cluster is shown in Figure 3-48. Zigbee Cluster Library Specification Chapter 3 Figure 3-48...

### 依赖

本次页级精读未抽取到独立的 Dependencies 小节；如实现依赖其他 cluster、profile 或设备类型，应回到来源页和应用规范一起确认。

### 属性

- `0x0000` LocationType data8 0000xxxx RW - M
- `0x0001` LocationMethod enum8 0x00 to 0xff RW - M
- `0x0002` LocationAge uint16 0x0000 to 0xffff R - O
- `0x0003` QualityMeasure uint8 0x00 to 0x64 R - O
- `0x0004` NumberOfDevices uint8 0x00 to 0xff R - O
- `0x0010` Coordinate1 int16 0x8000 to 0x7fff RW - M
- `0x0011` Coordinate2 int16 0x8000 to 0x7fff RW - M
- `0x0012` Coordinate3 int16 0x8000 to 0x7fff RW - O
- `0x0013` Power int16 0x8000 to 0x7fff RW - M
- `0x0014` PathLossExponent uint16 0x0000 to 0xffff RW - M
- `0x0015` ReportingPeriod uint16 0x0000 to 0xffff RW - O
- `0x0016` CalculationPeriod uint16 0x0000 to 0xffff RW - O
- `0x0017` NumberRSSIMeasurements uint8 0x01 to 0xff RW - M

### 命令

- `0x00` Device configuration response
- `0x01` Location data response
- `0x02` Location data notification
- `0x03` Compact location data notification
- `0x04` RSSI Ping
- `0x05` RSSI Request
- `0x06` Report RSSI Measurements
- `0x07` Request Own Location

### 行为要点

- This cluster provides a means for exchanging Received Signal Strength Indication (RSSI) information among one hop devices as well as messages to report RSSI data to a centralized device that collects all the RSSI data in...
- If the location information is two-dimensional, Coordinate 3 is unknown and SHALL be set to 0x8000.
- 2 L o cati o nM etho d Attri b u te The LocationMethod attribute SHALL be set to one of the non-reserved values in Table 3-74.
- 0x01 Signposting The location reported is the location of the neighboring device with the strongest received signal.
- (Note: no fixed confidence metric is mandated – the metric MAY be application and manufacturer dependent.) This field is not valid if the Absolute bit of the LocationType attribute is set to one.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x000B` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
