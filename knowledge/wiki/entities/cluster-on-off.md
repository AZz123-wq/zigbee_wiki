---
title: "On/Off Cluster"
type: entity
sources:
  - raw/test-specs/docs-15-0310-05-pfnd-0x0006-OnOff-Cluster-Test-Specification.pdf
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
  - raw/specs/07-5123-08-Zigbee-Cluster-Library-1.pdf
tags: [zigbee, cluster, on-off, zcl, general]
created: 2026-05-02
updated: 2026-05-10
cluster_id: "0x0006"
status: reviewed
confidence: 0.86
---

# On/Off Cluster (0x0006)

## 概述

On/Off Cluster（Cluster ID `0x0006`）是 Zigbee Cluster Library 中最基础的 General/Application cluster 之一。它提供设备开关状态、开关命令、全局场景协作和上电行为控制。

Rev 7 中该 cluster 位于 Chapter 3 General 的 3.8 小节，精读窗口为 `raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.157-p.160`。

## 属性

| 属性 | ID | 类型 | 说明 |
|------|-----|------|------|
| OnOff | 0x0000 | Boolean | 当前开关状态 (0=Off, 1=On) |
| GlobalSceneControl | 0x4000 | Boolean | 全局场景控制 |
| OnTime | 0x4001 | Unsigned 16-bit | 开启持续时间 |
| OffWaitTime | 0x4002 | Unsigned 16-bit | 关闭等待时间 |
| StartUpOnOff | 0x4003 | enum8 | ZLO 1.0 引入的上电开关行为，0x00=off, 0x01=on, 0x02=toggle, 0xff=previous |

## 命令

### Client → Server

| 命令 | ID | 说明 |
|------|-----|------|
| Off | 0x00 | 关闭 |
| On | 0x01 | 开启 |
| Toggle | 0x02 | 切换状态 |
| Off with effect | 0x40 | 可选，关闭并处理 effect/global scene |
| On with recall global scene | 0x41 | 可选，开启并恢复 global scene |
| On with timed off | 0x42 | 可选，按 OnTime/OffWaitTime 定时开启 |

## 行为要点

- On/Off 与 Level Control 有依赖关系：收到会把 `OnOff` 设为 `0x00` 的 Level Control command 时，`OnTime` 必须置为 `0x0000`；收到会把 `OnOff` 设为 `0x01` 的 Level Control command 时，如果 `OnTime` 为 `0x0000`，`OffWaitTime` 必须置为 `0x0000`。
- `GlobalSceneControl` 用于避免重复 Off 命令把“全部关闭”状态覆盖成 global scene，也避免重复 On 命令破坏当前设置。Global scene 使用 group id `0` 和 scene id `0`。
- `Off` command 无 payload，收到后进入设备相关的 off 状态，并把 `OnTime` 置为 `0x0000`。
- `On` command 无 payload，收到后进入设备相关的 on 状态；如果 `OnTime` 为 `0x0000`，`OffWaitTime` 置为 `0x0000`。
- `Toggle` command 无 payload，在 off 和 on 之间切换；如果切到 off 且 `OnTime` 为 `0x0000`，按 Rev 7 规则处理 `OffWaitTime`。

## 版本注意

- Rev 7 revision history 显示该 cluster revision 2 引入 `StartUpOnOff`。
- 测试规范中的 case 和 PICS 是 certification 要求，不应和 Rev 7 协议行为混写。

## 关联设备

最基础的照明设备 `On/Off Light` 必须支持此 Cluster。见 [[entities/device-on-off-light]]。

## 测试规范

- `raw/test-specs/docs-15-0310-05-pfnd-0x0006-OnOff-Cluster-Test-Specification.pdf` (1.2MB, 63p)

## 交叉引用

- [[entities/spec-zcl-rev8]]
- [[entities/spec-zcl-rev7]]
- [[entities/device-on-off-light]]
- [[summaries/2026-05-01-zcl-rev8]]
- [[summaries/2026-05-08-zcl-rev7]]
