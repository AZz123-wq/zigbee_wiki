---
title: "Binary Input (Basic) Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, general, io-value]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x000F"
status: reviewed
confidence: 0.84
---

# Binary Input (Basic) Cluster (0x000F)

## 概述

Binary Input (Basic) Cluster（Cluster ID `0x000F`）属于 ZCL Rev 7 的 General 功能域，章节定位为 3.14.5。读取二值测量/输入状态及其基础状态属性。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.203-p.206`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x000F` |
| 名称 | Binary Input (Basic) |
| 功能域 | General |
| Rev 7 章节 | 3.14.5 |
| 来源页 | p.203-p.206 |

### 规范摘要

读取二值测量/输入状态及其基础状态属性。

### 依赖

本次页级精读未抽取到独立的 Dependencies 小节；如实现依赖其他 cluster、profile 或设备类型，应回到来源页和应用规范一起确认。

### 属性

- `0x0004` ActiveText
- `0x002E` InactiveText
- `0x0051` OutOfService
- `0x0054` Polarity enum8 - R 0 O
- `0x0055` PresentValue
- `0x006F` StatusFlags map8 0x00 to 0x0f R 0 M
- `0x0100` ApplicationType uint32 0 to 0xffffffff R - O

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- 3.14.5 Binary Input (Basic) The Binary Input (Basic) cluster provides an interface for reading the value of a binary measurement and accessing various characteristics of that measurement.
- 3.14.5.5 Commands No cluster specific commands are received or generated.
- 3.14.5.6 Attribute Reporting This cluster SHALL support attribute reporting using the Report Attributes and Configure Reporting commands, according to the minimum and maximum reporting interval...
- The following attributes SHALL be reported: StatusFlags, PresentValue 3.14.5.7 Client The client has no dependencies and no cluster specific attributes.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x000F` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
