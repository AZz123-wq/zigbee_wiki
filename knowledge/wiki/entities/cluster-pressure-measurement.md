---
title: "Pressure Measurement Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, measurement, pressure]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0403"
status: reviewed
confidence: 0.84
---

# Pressure Measurement Cluster (0x0403)

## 概述

Pressure Measurement Cluster（Cluster ID `0x0403`）属于 ZCL Rev 7 的 Measurement and Sensing 功能域，章节定位为 4.5。配置和报告压力测量值，并可提供 scaled pressure。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.309-p.313`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0403` |
| 名称 | Pressure Measurement |
| 功能域 | Measurement and Sensing |
| Rev 7 章节 | 4.5 |
| 来源页 | p.309-p.313 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. The server cluster provides an interface to pressure measurement functionality, including configuration and provision of notifications of pressure measurements.

### 依赖

本次页级精读未抽取到独立的 Dependencies 小节；如实现依赖其他 cluster、profile 或设备类型，应回到来源页和应用规范一起确认。

### 属性

- `0x8000` means this attribute is not defined. See 4.1.3 for more details
- `0x0011` MinScaledValue int16 0x8001-0x7ffe R 0x8000 O Note 1
- `0x0012` MaxScaledValue int16 0x8002-0x7fff R 0x8000 O Note 1

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- The server cluster provides an interface to pressure measurement functionality, including configuration and provision of notifications of pressure measurements.
- 1 M easu red Val u e Attri b u te MeasuredValue represents the pressure in kPa as follows: MeasuredValue = 10 x Pressure Where -3276.7 kPa <= Pressure <= 3276.7 kPa...
- A MeasuredValue of 0x8000 indicates that the pressure measurement is unknown, otherwise the range SHALL be as described in 4.1.3.
- Note 2: If this attribute is supported, all attributes in this set shall be supported.
- 1 Scal ed Val u e Att ri b u te ScaledValue represents the pressure in Pascals as follows: ScaledValue = 10Scale x Pressure in Pa Where -3276.7x10Scale Pa <= Pressure <= 3276...

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0403` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
