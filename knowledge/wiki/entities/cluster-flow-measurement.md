---
title: "Flow Measurement Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, measurement, flow]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0404"
status: reviewed
confidence: 0.84
---

# Flow Measurement Cluster (0x0404)

## 概述

Flow Measurement Cluster（Cluster ID `0x0404`）属于 ZCL Rev 7 的 Measurement and Sensing 功能域，章节定位为 4.6。配置和报告流量测量值。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.312-p.316`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0404` |
| 名称 | Flow Measurement |
| 功能域 | Measurement and Sensing |
| Rev 7 章节 | 4.6 |
| 来源页 | p.312-p.316 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. The server cluster provides an interface to flow measurement functionality, including configuration and provision of notifications of flow measurements.

### 依赖

本次页级精读未抽取到独立的 Dependencies 小节；如实现依赖其他 cluster、profile 或设备类型，应回到来源页和应用规范一起确认。

### 属性

- `0xFFFF` means this attribute is not defined. See 4.1.3 for more details

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- The server cluster provides an interface to flow measurement functionality, including configuration and provision of notifications of flow measurements.
- 1 M easu red Val u e Attri b u te MeasuredValue represents the flow in m3/h as follows: MeasuredValue = 10 x Flow Where 0 m3/h <= Flow <= 6,553.4 m3/h, corresponding to a MeasuredValue in the range 0 to 0xfffe.
- A MeasuredValue of 0xffff indicates that the pressure measurement is unknown, otherwise the range SHALL be as described in 4.1.3.
- 4.6.2.2 Commands No cluster specific commands are generated or received by the server cluster.
- 4.6.2.3 Attribute Reporting This cluster shall support attribute reporting using the Report Attributes command and according to the minimum and maximum reporting interval and reportable change settings described in the Z...

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0404` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
