---
title: "Temperature Measurement Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
  - raw/test-specs/16-02817-003-0x0402-Temperature-Measurement-Cluster-Test-Specification-Draft.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, measurement, temperature]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0402"
status: reviewed
confidence: 0.84
---

# Temperature Measurement Cluster (0x0402)

## 概述

Temperature Measurement Cluster（Cluster ID `0x0402`）属于 ZCL Rev 7 的 Measurement and Sensing 功能域，章节定位为 4.4。配置和报告温度测量值。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.307-p.310`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0402` |
| 名称 | Temperature Measurement |
| 功能域 | Measurement and Sensing |
| Rev 7 章节 | 4.4 |
| 来源页 | p.307-p.310 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. The server cluster provides an interface to temperature measurement functionality, including configuration and provision of notifications of temperature measurements.

### 依赖

本次页级精读未抽取到独立的 Dependencies 小节；如实现依赖其他 cluster、profile 或设备类型，应回到来源页和应用规范一起确认。

### 属性

- `0x0000` MeasuredValue int16 RP 0xffff47 M

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- The server cluster provides an interface to temperature measurement functionality, including configuration and provision of notifications of temperature measurements.
- 1 M easu red Val u e Attri b u te MeasuredValue represents the temperature in degrees Celsius as follows: MeasuredValue = 100 x temperature in degrees Celsius.
- A MeasuredValue of 0x8000 indicates that the temperature measurement is unknown, otherwise the range SHALL be as described in 4.1.3.
- 4.4.2.2 Commands No cluster specific commands are generated or received by the server cluster.
- 4.4.2.3 Attribute Reporting This cluster shall support attribute reporting using the Report Attributes command and according to the minimum and maximum reporting interval and reportable change settings described in the Z...

### 测试规范

- 对应测试规范摘要: [[summaries/2026-05-08-temperature-measurement-cluster-test-spec]] (draft 测试要求)

## 关键要点

- `0x0402` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
- 本页保留来源页范围，后续实现、测试或差异分析应引用具体页码和章节。
- 本页区分 Rev 7 协议定义与测试规范要求；测试规范内容只作为认证验证入口。

## 交叉引用

- [[entities/spec-zcl-rev7]]
- [[summaries/2026-05-08-zcl-rev7]]
- [[summaries/2026-05-08-temperature-measurement-cluster-test-spec]]
- [[index]]

## 待深入

- [ ] 按实现需求补齐完整属性表的类型、范围、access、默认值和 M/O 条件。
- [ ] 按 command payload 深读补齐 request/response 字段、状态码和时序。
- [ ] 若存在 profile/device type 约束，链接到对应 Device Type 或测试规范页面。
