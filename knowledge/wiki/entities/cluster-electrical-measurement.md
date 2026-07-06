---
title: "Electrical Measurement Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, measurement, electrical]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0B04"
status: reviewed
confidence: 0.84
---

# Electrical Measurement Cluster (0x0B04)

## 概述

Electrical Measurement Cluster（Cluster ID `0x0B04`）属于 ZCL Rev 7 的 Measurement and Sensing 功能域，章节定位为 4.9。提供 DC/AC 电压、电流、功率、谐波、相位和告警阈值等电气测量属性。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.321-p.344`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0B04` |
| 名称 | Electrical Measurement |
| 功能域 | Measurement and Sensing |
| Rev 7 章节 | 4.9 |
| 来源页 | p.321-p.344 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. This cluster provides a mechanism for querying data about the electrical properties as measured by the device. This cluster may be implemented on any device type and be implemented on a per-endpoint basis. For example, a power strip device could represent each outlet on a different endpoint and report electrical information for each individual outlet...

### 依赖

For the alarm functionality in this cluster to be operational, any endpoint that implements the Electrical Measurement server cluster shall also implement the Alarms server cluster.

### 属性

- `0x0510` PowerFactor int8 -100 to +100 R 0x00 O
- `0xFFFF` is returned
- `0x8000` until a measurement is made
- `0x0700` DCOverloadAlarmsMask map8 0000 00xx RW 0000 0000 O
- `0x0800` ACAlarmsMask map16 0000 xxxx RW 0000 0000 O
- `0x0910` PowerFactorPhB int8 -100 to +100 R 0x00 O
- `0x0A10` PowerFactorPhC int8 -100 to +100 R 0x00 O

### 命令

- `0x00` Get Profile Info Command
- `0x01` Get Measurement Profile Command

### 行为要点

- This cluster provides a mechanism for querying data about the electrical properties as measured by the device.
- This cluster may be implemented on any device type and be implemented on a per-endpoint basis.
- For example, a power strip device could represent each outlet on a different endpoint and report electrical information for each individual outlet.
- The only caveat is that if you implement an attribute that has an associated multiplier and divisor, then you must implement the associated multiplier and divisor attributes.
- For example if you implement DCVoltage, you must also implement DCVoltageMultiplier and DCVoltageDivisor.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0B04` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
