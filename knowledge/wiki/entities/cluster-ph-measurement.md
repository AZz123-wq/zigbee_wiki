---
title: "pH Measurement Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, measurement, ph]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0409"
status: reviewed
confidence: 0.84
---

# pH Measurement Cluster (0x0409)

## 概述

pH Measurement Cluster（Cluster ID `0x0409`）属于 ZCL Rev 7 的 Measurement and Sensing 功能域，章节定位为 4.11。报告 pH 测量值，分辨率为 0.01 pH。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.345-p.347`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0409` |
| 名称 | pH Measurement |
| 功能域 | Measurement and Sensing |
| Rev 7 章节 | 4.11 |
| 来源页 | p.345-p.347 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. The server cluster provides an interface to pH measurement functionality.

### 依赖

本次页级精读未抽取到独立的 Dependencies 小节；如实现依赖其他 cluster、profile 或设备类型，应回到来源页和应用规范一起确认。

### 属性

- `0x0000` MeasuredValue uint16 RP 0xffff M
- `0x0001` MinMeasuredValue uint16 0x0000 to MaxMeasuredValue-1 R 0xffff M
- `0x0002` MaxMeasuredValue uint16 MinMeasuredValue+1 to 0x0578 R 0xffff M
- `0x0003` Tolerance uint16 0x0000 to 0x00c8 R O

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- The server cluster provides an interface to pH measurement functionality.
- A MeasuredValue of 0xffff SHALL indicate an unknown value, otherwise the range SHALL be as described in 4.1.3.
- Zigbee Cluster Library Specification Chapter 4 4.11.2.2 Commands No cluster specific commands are generated or received by the server cluster.
- 4.11.3 Client The client cluster has no dependencies, cluster specific attributes nor specific commands generated or received.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0409` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
