---
title: "Power Profile Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, general, energy]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x001A"
status: reviewed
confidence: 0.84
---

# Power Profile Cluster (0x001A)

## 概述

Power Profile Cluster（Cluster ID `0x001A`）属于 ZCL Rev 7 的 General 功能域，章节定位为 3.17。描述设备功率阶段、能源远程控制和电价相关交互。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.263-p.289`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x001A` |
| 名称 | Power Profile |
| 功能域 | General |
| Rev 7 章节 | 3.17 |
| 来源页 | p.263-p.289 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. This cluster provides an interface for transferring power profile information from a device (e.g., White Goods) to a controller (e.g., the Home Gateway). The Power Profile can be solicited by client side (request command) or can be notified directly from the device (server side). The Power Profile represents a forecast of the energy that a device is able to predict...

### 依赖

The Power Profile Cluster is dependent upon the Appliance Control Cluster for the parts regarding the status notification and power management commands. Other specific clusters for actuation for devices different than Smart Appliances. Due to the possible length of the Power Profile commands, the devices supporting the Power Profile cluster MAY leverage on Partitioning if required by the application. Zigbee Cluster Library Specification Chapter 3

### 属性

- `0x0000` TotalProfileNum uint8 0x01 to 0xfe R 1 M
- `0x0001` MultipleScheduling
- `0x0003` EnergyRemote
- `0x0004` ScheduleMode map8 0x00 to 0xff RWP 0x00 M

### 命令

- Server received `0x00` PowerProfileRequest
- Server received `0x01` PowerProfileStateRequest
- Server received `0x02` GetPowerProfilePriceResponse
- Server received `0x03` GetOverallSchedulePriceResponse
- Server received `0x04` EnergyPhasesScheduleNotification
- Server received `0x05` EnergyPhasesScheduleResponse
- Server received `0x06` PowerProfileScheduleConstraintsRequest
- Server received `0x07` EnergyPhasesScheduleStateRequest
- Server received `0x08` GetPowerProfilePriceExtendedResponse
- Server generated `0x00` PowerProfileNotification
- Server generated `0x01` PowerProfileResponse
- Server generated `0x02` PowerProfileStateResponse
- Server generated `0x03` GetPowerProfilePrice
- Server generated `0x04` PowerProfilesStateNotification
- Server generated `0x05` GetOverallSchedulePrice
- Server generated `0x06` EnergyPhasesScheduleRequest
- Server generated `0x07` EnergyPhasesScheduleStateResponse
- Server generated `0x08` EnergyPhasesScheduleStateNotification
- Server generated `0x09` PowerProfileScheduleConstraintsNotification
- Server generated `0x0A` PowerProfileScheduleConstraintsResponse
- Server generated `0x0B` GetPowerProfilePriceExtended

### 行为要点

- This cluster provides an interface for transferring power profile information from a device (e.g., White Goods) to a controller (e.g., the Home Gateway).
- The Power Profile represents a forecast of the energy that a device is able to predict.
- The data carried in the Power Profile can be updated during the different states of a Power Profile; since it represents a forecast of energy, duration and peak power of energy phases...
- The Power Profile MAY also be used by an energy management system, together with other specific interfaces supported by the device...
- Due to the possible length of the Power Profile commands, the devices supporting the Power Profile cluster MAY leverage on Partitioning if required by the application.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x001A` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
