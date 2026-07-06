---
title: "Lighting & Occupancy Device Specification v1.0 — 摘要"
type: summary
sources:
  - raw/specs/docs-15-0014-05-0plo-LightingOccupancyDevice-Specification-V1.0-1.pdf
tags: [zigbee, lighting, occupancy, zll, zha, device-types]
created: 2026-05-01
updated: 2026-05-08
---

# Lighting & Occupancy Device Specification v1.0 — 摘要

## 文档信息

- **文档编号**: ZigBee Document 15-0014-05
- **版本**: Version 1.0
- **发布日期**: February 24th, 2016
- **页数**: 122 页 (pdfinfo)
- **赞助方**: ZigBee Alliance

## PDF 读取检查

- **页数基准**: pdfinfo=122, structural=122, pdf_extract=121, 采用 122 页。
- **页级连贯性**: `runtime/data/source-page-index.json` 覆盖 122 页，页码 1..122 连续，无缺页。
- **文本质量抽样**: sampled_pages=5, sample_chars=4420, garbled_ratio=0.002, extraction_errors=0, quality_score=1。
- **结论**: Poppler 页数、结构页数和页级索引一致，文本可连续检索；旧 fallback 少计 1 页。

## 概述

该规范定义 ZigBee-PRO 平台上**照明和占用传感器**应用的协议基础设施和服务。覆盖 ZLL (ZigBee Light Link) 和 ZHA (ZigBee Home Automation) 两个应用 Profile 的设备类型定义。

## 定义的设备类型 (15种)

| # | 设备类型 | 类别 | 页码 |
|---|---------|------|------|
| 1 | On/Off Light | 照明终端 | 23 |
| 2 | Dimmable Light | 照明终端 | 28 |
| 3 | Color Dimmable Light | 照明终端 | 33 |
| 4 | On/Off Light Switch | 控制设备 | 39 |
| 5 | Dimmer Switch | 控制设备 | 42 |
| 6 | Color Dimmer Switch | 控制设备 | 46 |
| 7 | Light Sensor | 传感器 | 50 |
| 8 | Occupancy Sensor | 传感器 | 53 |
| 9 | On/Off Ballast | 照明终端 | 56 |
| 10 | Dimmable Ballast | 照明终端 | 61 |
| 11 | On/Off Plug-in Unit | 照明终端 | 66 |
| 12 | Dimmable Plug-in Unit | 照明终端 | 71 |
| 13 | Color Temperature Light | 照明终端 | 76 |
| 14 | Extended Color Light | 照明终端 | 82 |
| 15 | Light Level Sensor | 传感器 | 88 |

## 核心 Cluster 增强

规范对以下 Cluster 进行了 L&O 领域的特定增强：
- Basic Cluster [0x0000]
- On/Off Cluster [0x0006]
- Level Control Cluster [0x0008]
- Color Control Cluster [0x0300]

## 关键要点

1. **统一 ZLL/ZHA**: 本规范合并了 ZLL 和 ZHA 两个 Profile 的设备类型，实现统一照明设备模型
2. **设备分层**: 从简单 On/Off 到 Extended Color Light，功能逐层递增
3. **传感器支持**: 涵盖 Light Sensor、Occupancy Sensor、Light Level Sensor
4. **Ballast 设备**: 支持荧光灯镇流器设备类型（On/Off Ballast, Dimmable Ballast）
5. 每个设备类型定义包含：Device Configuration、Supported Clusters、Required Attributes、Required Commands、PICS

## 交叉引用

- [[entities/spec-lighting-occupancy-device-v1]]
- [[entities/device-on-off-light]]
- [[entities/device-dimmable-light]]
- [[entities/device-color-light]]
- [[entities/device-occupancy-sensor]]
- [[concepts/bdb-commissioning]]

## 待深入

- [ ] 各设备类型 Cluster 支持矩阵详表
- [ ] PICS (Protocol Implementation Conformance Statement) 差异
- [ ] ZLL vs ZHA 在设备定义层面的差异
