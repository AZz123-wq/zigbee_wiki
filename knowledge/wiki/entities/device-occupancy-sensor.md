---
title: "Occupancy Sensor Device"
type: entity
sources:
  - raw/specs/docs-15-0014-05-0plo-LightingOccupancyDevice-Specification-V1.0-1.pdf
tags: [zigbee, device-type, sensor, occupancy, zll, zha]
created: 2026-05-01
updated: 2026-05-01
device_type: "Occupancy Sensor"
profile: "ZLL / ZHA"
---

# Occupancy Sensor Device

## 概述

Occupancy Sensor 是占用检测传感器设备类型，用于检测空间内是否有人，触发照明或自动化控制。

## Cluster 配置

| Cluster | ID | 角色 | 功能 |
|---------|-----|------|------|
| Basic | 0x0000 | Server | 设备基础信息 |
| Identify | 0x0003 | Server | 设备识别 |
| Occupancy Sensing | 0x0406 | Server | 占用检测 |

## 传感器类型

| 类型 | 说明 |
|------|------|
| Light Sensor | 光照度检测 |
| Occupancy Sensor | 人体占用检测 |
| Light Level Sensor | 光照度水平检测 |

## 测试规范

- `raw/test-specs/docs-15-0318-06-pfnd-0x0406-Occupancy-Sensing-Cluster-Test-Specification-Draft.pdf` (1.0MB, 47p)

## 交叉引用

- [[entities/spec-lighting-occupancy-device-v1]]
- [[entities/device-on-off-light]]
