---
title: "EN50523 Appliance Identification Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, appliance, en50523]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0B00"
status: reviewed
confidence: 0.84
---

# EN50523 Appliance Identification Cluster (0x0B00)

## 概述

EN50523 Appliance Identification Cluster（Cluster ID `0x0B00`）属于 ZCL Rev 7 的 Appliance 功能域，章节定位为 15.3。提供电器基本识别、厂商、品牌、型号和产品类型信息。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.912-p.918`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0B00` |
| 名称 | EN50523 Appliance Identification |
| 功能域 | Appliance |
| Rev 7 章节 | 15.3 |
| 来源页 | p.912-p.918 |

### 规范摘要

Please see section 2.2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. Attributes and commands for determining basic information about a device and setting user device information. The Appliance Identification Cluster is a transposition of EN50523 “Identify Product” functional block. Note: Where a physical node supports multiple endpoints it will often be the case that many of these settings will apply to the whole node...

### 依赖

本次页级精读未抽取到独立的 Dependencies 小节；如实现依赖其他 cluster、profile 或设备类型，应回到来源页和应用规范一起确认。

### 属性

- `0x0B00` EN50523 Appliance Identification
- `0x0000` BasicIdentification uint56 - R - M
- `0x0010` CompanyName
- `0x0011` CompanyId uint16 all R - O
- `0x0012` BrandName
- `0x0013` BrandId uint16 all R - O
- `0x0014` Model
- `0x0015` PartNumber
- `0x0016` ProductRevision
- `0x0017` SoftwareRevision
- `0x0018` ProductTypeName
- `0x0019` ProductTypeId uint16 all R - O
- `0x001A` CECEDSpecificationVersion uint8 all R - O

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- Note: Where a physical node supports multiple endpoints it will often be the case that many of these settings will apply to the whole node, that is they are the same for every endpoint on the device.
- BasicIdentification is mandatory and must be included as part of the minimum data set to be provided by the household appliance device.
- Table 15-13 provides attribute content specification.
- 0x37-0x30 20337 Table 15-13 provides Company ID and Brand ID fields content, according to [N2], Table 5.
- Table 15-14 provides Product Type IDs field content, again according to [N2] (see Table 6).

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0B00` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
