---
title: "Zigbee Cluster Library Revision 8"
type: entity
sources:
  - raw/specs/07-5123-08-Zigbee-Cluster-Library-1.pdf
tags: [zigbee, spec, zcl, cluster-library, revision-8]
created: 2026-05-01
updated: 2026-05-08
spec_version: "Revision 8"
spec_doc_id: "07-5123-08"
spec_date: "2020"
---

# Zigbee Cluster Library Revision 8

## 概述

Zigbee Cluster Library (ZCL) Revision 8 是 Zigbee Alliance 发布的 Cluster 库最新主版本。定义了所有 Zigbee 标准 Cluster 的属性、命令和数据类型。

## 版本信息

- **规范**: Zigbee Cluster Library
- **版本**: Revision 8
- **文档编号**: 075123 (07-5123-08)
- **出版**: Zigbee Alliance (2007-2020)
- **页数**: 1213 页 (pdfinfo)

## 功能域与关键 Cluster

### General (Ch.3) — 通用 Cluster
| Cluster | ID | 用途 |
|---------|-----|------|
| Basic | 0x0000 | 设备信息 |
| Identify | 0x0003 | 设备识别 |
| Groups | 0x0004 | 群组管理 |
| Scenes | 0x0005 | 场景存储 |
| On/Off | 0x0006 | 开关控制 |
| Level Control | 0x0008 | 等级控制 |
| Alarms | 0x0009 | 告警管理 |
| Time | 0x000A | 时间同步 |
| Poll Control | 0x0020 | 轮询控制 |

### Measurement & Sensing (Ch.4)
| Cluster | ID | 用途 |
|---------|-----|------|
| Illuminance Measurement | 0x0400 | 光照度 |
| Temperature Measurement | 0x0402 | 温度 |
| Occupancy Sensing | 0x0406 | 占用检测 |

### Lighting (Ch.5)
| Cluster | ID | 用途 |
|---------|-----|------|
| Color Control | 0x0300 | 颜色控制 |
| Ballast Configuration | 0x0301 | 镇流器配置 |

### HVAC (Ch.6)
| Cluster | ID | 用途 |
|---------|-----|------|
| Thermostat | 0x0201 | 温控器 |
| Fan Control | 0x0202 | 风扇控制 |

## 关联规范

- 前版本: [[entities/spec-zcl-rev7]] (Revision 7, 929p)
- 关联: [[entities/spec-lighting-occupancy-device-v1]] (设备类型引用 ZCL Cluster)
- 关联: [[entities/spec-base-device-behavior-v1]] (BDB 引用 ZCL)

## 交叉引用

- [[summaries/2026-05-01-zcl-rev8]]
- [[summaries/2026-05-01-lighting-occupancy-device-spec-v1]]
