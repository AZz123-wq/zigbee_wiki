---
title: "Dehumidification Control Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, hvac, dehumidification]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0203"
status: reviewed
confidence: 0.84
---

# Dehumidification Control Cluster (0x0203)

## 概述

Dehumidification Control Cluster（Cluster ID `0x0203`）属于 ZCL Rev 7 的 HVAC 功能域，章节定位为 6.5。配置除湿设备的相对湿度目标、死区和锁定行为。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.432-p.436`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0203` |
| 名称 | Dehumidification Control |
| 功能域 | HVAC |
| Rev 7 章节 | 6.5 |
| 来源页 | p.432-p.436 |

### 规范摘要

This cluster provides an interface to dehumidification functionality.

### 依赖

本次页级精读未抽取到独立的 Dependencies 小节；如实现依赖其他 cluster、profile 或设备类型，应回到来源页和应用规范一起确认。

### 属性

- `0x0001` DehumidificationCooling uint8 0 - DehumidificationMaxCool RP - M

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- 6.5 Dehumidification Control 6.5.1 Overview This cluster provides an interface to dehumidification functionality.
- 1 Rel ati veHu mi d i ty Attri b u te The RelativeHumidity attribute is an 8-bit value that represents the current relative humidity (in %) measured by a local or remote sensor.
- 1 RHDeh u mi d i fi cati o n Setp oi n t Attri b u te The RHDehumidificationSetpoint attribute is an 8-bit value that represents the relative humidity (in %) at which dehumidification occurs.
- It SHALL be set to one of the values below: Table 6-46.
- It SHALL be set to one of the values below: Table 6-47.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0203` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
