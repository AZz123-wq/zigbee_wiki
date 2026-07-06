---
title: "Chlorodibromomethane Concentration Measurement Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, measurement, chlorodibromomethane, concentration]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0427"
status: reviewed
confidence: 0.84
---

# Chlorodibromomethane Concentration Measurement Cluster (0x0427)

## 概述

Chlorodibromomethane Concentration Measurement Cluster（Cluster ID `0x0427`）属于 ZCL Rev 7 的 Measurement and Sensing 功能域，章节定位为 4.13。Chlorodibromomethane Concentration Measurement 是 Rev 7 Concentration Measurement 基础规范下的派生 cluster identifier，复用同一组 MeasuredValue/Min/Max/Tolerance 语义。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.348-p.352`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0427` |
| 名称 | Chlorodibromomethane Concentration Measurement |
| 功能域 | Measurement and Sensing |
| Rev 7 章节 | 4.13 |
| 来源页 | p.348-p.352 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. The server cluster provides an interface to concentration measurement functionality. The measurement is reportable and may be configured for reporting. Concentration measurements include, but are not limited to, levels in gases, such as CO, CO2, and ethylene, or in fluids and solids, such as dissolved oxygen, chemicals & pesticides.

### 依赖

本次页级精读未抽取到独立的 Dependencies 小节；如实现依赖其他 cluster、profile 或设备类型，应回到来源页和应用规范一起确认。

### 属性

- `0x0000` MeasuredValue
- `0x0001` MinMeasuredValue
- `0x0002` MaxMeasuredValue
- `0x0003` Tolerance

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- The server cluster provides an interface to concentration measurement functionality.
- The measurement is reportable and may be configured for reporting.
- More than one ambient substance may be supported by the same Cluster Id (e.g.
- A new Cluster Id may also be added that is limited to a single ambient substance to provide more specific self-description.
- 4.13.2.2 Commands No cluster specific commands are generated or received by the server cluster.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0427` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
