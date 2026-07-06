---
title: "Price Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, smart-energy, price]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0700"
status: reviewed
confidence: 0.84
---

# Price Cluster (0x0700)

## 概述

Price Cluster（Cluster ID `0x0700`）属于 ZCL Rev 7 的 Smart Energy 功能域，章节定位为 10.2。发布价格、块阈值、税费、转换因子和 billing period 等 Smart Energy 价格信息。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.589-p.614`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0700` |
| 名称 | Price |
| 功能域 | Smart Energy |
| Rev 7 章节 | 10.2 |
| 来源页 | p.589-p.614 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. The Price Cluster provides the mechanism for communicating Gas, Energy, or Water pricing information within the premises. This pricing information is distributed to the ESI from either the utilities or from regional energy providers...

### 依赖

• Events carried using this cluster include a timestamp with the assumption that target devices maintain a real time clock. Devices can acquire and synchronize their internal clocks via the ZCL Time server. • If a device does not support a real time clock it is assumed that the device will interpret and utilize the “Start Now” value within the Time field. • Anonymous Inter-PAN transmission mechanism.

### 属性

- `0x0000` Tier1PriceLabel
- `0x0001` Tier2PriceLabel
- `0x0002` Tier3PriceLabel
- `0x0003` Tier4PriceLabel
- `0x0004` Tier5PriceLabel
- `0x0005` Tier6PriceLabel
- `0x0006` Tier7PriceLabel
- `0x0007` Tier8PriceLabel
- `0x0008` Tier9PriceLabel
- `0x0009` Tier10PriceLabel
- `0x000A` Tier11PriceLabel
- `0x000B` Tier12PriceLabel
- `0x000C` Tier13PriceLabel
- `0x000D` Tier14PriceLabel
- `0x000E` Tier15PriceLabel
- `0x000F` NoTierBlock16Price uint32 R - O
- `0x0010` Tier1Block1Price uint32 R - O
- `0x0011` Tier1Block2Price uint32 R - O
- `0x0012` Tier1Block3Price uint32 R - O
- `0x001F` Tier1Block16Price uint32 R - O
- `0x0020` Tier2Block1Price uint32 R - O
- `0x002F` Tier2Block16Price uint32 R - O
- `0x0030` Tier3Block1Price uint32 R - O
- `0x003F` Tier3Block16Price uint32 R - O
- `0x0040` Tier4Block1Price uint32 R - O
- `0x004F` Tier4Block16Price uint32 R - O
- `0x0050` Tier5Block1Price uint32 R - O

### 命令

- `0x00` Publish Price
- `0x01` Publish Block Period
- `0x02` Publish Conversion Factor
- `0x03` Publish Calorific Value
- `0x04` GetConversionFactor
- `0x05` GetCalorificValue

### 行为要点

- The Price Cluster provides the mechanism for communicating Gas, Energy, or Water pricing information within the premises.
- The ESI conveys the information (via the Price Cluster mechanisms) to both Smart Energy devices in secure method and/or optionally conveys it anonymously in an unsecure to very simple devices that may not be part of the...
- • If a device does not support a real time clock it is assumed that the device will interpret and utilize the “Start Now” value within the Time field.
- This feature set may change before reaching certifiable status in a future revision of this specification.
- 1 T i erNPri ceL ab el Attri b u tes Chapter 10 ZigBee Cluster Library Specification Smart Energy ZigBee Document – 075123 The TierNPriceLabel attributes provide a method for utilities to assign a label to the Price Tier...

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0700` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
