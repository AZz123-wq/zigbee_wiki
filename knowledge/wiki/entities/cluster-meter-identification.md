---
title: "Meter Identification Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, general, metering]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0B01"
status: reviewed
confidence: 0.84
---

# Meter Identification Cluster (0x0B01)

## 概述

Meter Identification Cluster（Cluster ID `0x0B01`）属于 ZCL Rev 7 的 General 功能域，章节定位为 3.18。提供仪表厂商、型号、认证和软件版本等识别信息。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.288-p.293`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0B01` |
| 名称 | Meter Identification |
| 功能域 | General |
| Rev 7 章节 | 3.18 |
| 来源页 | p.288-p.293 |

### 规范摘要

Zigbee Cluster Library Specification Chapter 3 Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. This cluster provides attributes and commands for determining advanced information about utility metering device, as shown in Figure 3-83. Note: Where a physical node supports multiple endpoints it will often be the case that many of these settings will apply to the whole node, that is they are the same for every endpoint on the device...

### 依赖

本次页级精读未抽取到独立的 Dependencies 小节；如实现依赖其他 cluster、profile 或设备类型，应回到来源页和应用规范一起确认。

### 属性

- `0x0000` CompanyName
- `0x0001` MeterTypeID uint16 0x0000 to 0xffff R - M
- `0x0004` DataQualityID uint16 0x0000 to 0xffff R - M
- `0x0005` CustomerName
- `0x0006` Model
- `0x0007` PartNumber
- `0x0008` ProductRevision
- `0x000A` SoftwareRevision
- `0x000B` UtilityName
- `0x000C` POD
- `0x000D` AvailablePower int24 0x000000 to 0xffffff R - M
- `0x000E` PowerThreshold int24 0x000000 to 0xffffff R - M

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- This cluster provides attributes and commands for determining advanced information about utility metering device, as shown in Figure 3-83.
- Note: Where a physical node supports multiple endpoints it will often be the case that many of these settings will apply to the whole node, that is they are the same for every endpoint on the device.
- Table 3-143 provides Meter Type IDs field content.
- Table 3-144 provides Data Quality IDs field content.
- 3.18.2.1.11 AvailablePower Attribute AvailablePower represents the InstantaneousDemand that can be distributed to the customer (e.g., 3.3KW power) without any risk of overload.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0B01` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
