---
title: "Lighting & Occupancy Device Specification v1.0"
type: entity
sources:
  - raw/specs/docs-15-0014-05-0plo-LightingOccupancyDevice-Specification-V1.0-1.pdf
tags: [zigbee, spec, lighting, occupancy, zll, zha]
created: 2026-05-01
updated: 2026-05-08
spec_version: "1.0"
spec_doc_id: "15-0014-05"
spec_date: "2016-02-24"
---

# Lighting & Occupancy Device Specification v1.0

## 概述

ZigBee Alliance 发布的 L&O (Lighting & Occupancy) 设备规范，定义 ZigBee-PRO 平台上照明和占用传感器应用的设备类型、Cluster 要求和行为规范。

## 版本信息

- **规范**: Lighting & Occupancy Device Specification
- **版本**: Version 1.0
- **文档编号**: 15-0014-05
- **发布日期**: February 24th, 2016

## 设备类型层次

```
照明设备层级 (功能递增):
  On/Off Light → Dimmable Light → Color Temperature Light → Extended Color Light

控制设备层级:
  On/Off Switch → Dimmer Switch → Color Dimmer Switch

传感器设备:
  Light Sensor → Light Level Sensor
  Occupancy Sensor

特殊设备:
  On/Off Ballast → Dimmable Ballast
  On/Off Plug-in Unit → Dimmable Plug-in Unit
```

## 关联 Cluster

- Basic Cluster [0x0000]
- On/Off Cluster [0x0006]
- Level Control Cluster [0x0008]
- Color Control Cluster [0x0300]
- Groups Cluster [0x0004]
- Scenes Cluster [0x0005]
- Identify Cluster [0x0003]
- Illuminance Measurement [0x0400]
- Occupancy Sensing [0x0406]

## 关联实体

- [[entities/device-on-off-light]]
- [[entities/device-dimmable-light]]
- [[entities/device-color-light]]
- [[entities/device-occupancy-sensor]]

## 交叉引用

- [[summaries/2026-05-01-lighting-occupancy-device-spec-v1]]
- [[entities/spec-base-device-behavior-v1]]
