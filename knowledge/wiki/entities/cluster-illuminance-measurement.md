---
title: "Illuminance Measurement Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
  - raw/test-specs/docs-15-0316-06-pfnd-0x0400-Illuminance-measurement-Cluster-Test-Specification-Draft.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, measurement, illuminance]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0400"
status: reviewed
confidence: 0.84
---

# Illuminance Measurement Cluster (0x0400)

## 概述

Illuminance Measurement Cluster（Cluster ID `0x0400`）属于 ZCL Rev 7 的 Measurement and Sensing 功能域，章节定位为 4.2。配置和报告照度测量值。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.302-p.305`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0400` |
| 名称 | Illuminance Measurement |
| 功能域 | Measurement and Sensing |
| Rev 7 章节 | 4.2 |
| 来源页 | p.302-p.305 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. The server cluster provides an interface to illuminance measurement functionality, including configuration and provision of notifications of illuminance measurements.

### 依赖

本次页级精读未抽取到独立的 Dependencies 小节；如实现依赖其他 cluster、profile 或设备类型，应回到来源页和应用规范一起确认。

### 属性

- `0x0000` MeasuredValue uint16 0x0000 to 0xffff RP 0x0000 M
- `0x0002` MaxMeasuredValue uint16 2 to 0xfffe R ms M
- `0xFFFF` indicates that this attribute is not defined. See 4.1.3 for more details

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- The server cluster provides an interface to illuminance measurement functionality, including configuration and provision of notifications of illuminance measurements.
- This attribute shall be set to one of the non-reserved values listed in Table 4-6.
- Values of the LightSensorType Attribute Attribute Value Description 0x00 Photodiode 0x01 CMOS 0x40 – 0xfe Reserved for manufacturer specific light sensor types 0xff Unknown 4.2.2...
- The following attributes shall be reported: MeasuredValue 4.2.3 Client The client cluster has no dependencies, cluster specific attributes nor specific commands generated or received.

### 测试规范

- 对应测试规范摘要: [[summaries/2026-05-08-illuminance-measurement-cluster-test-spec]] (draft 测试要求)

## 关键要点

- `0x0400` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
- 本页保留来源页范围，后续实现、测试或差异分析应引用具体页码和章节。
- 本页区分 Rev 7 协议定义与测试规范要求；测试规范内容只作为认证验证入口。

## 交叉引用

- [[entities/spec-zcl-rev7]]
- [[summaries/2026-05-08-zcl-rev7]]
- [[summaries/2026-05-08-illuminance-measurement-cluster-test-spec]]
- [[index]]

## 待深入

- [ ] 按实现需求补齐完整属性表的类型、范围、access、默认值和 M/O 条件。
- [ ] 按 command payload 深读补齐 request/response 字段、状态码和时序。
- [ ] 若存在 profile/device type 约束，链接到对应 Device Type 或测试规范页面。
