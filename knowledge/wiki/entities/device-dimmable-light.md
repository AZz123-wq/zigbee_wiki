---
title: "Dimmable Light Device"
type: entity
sources:
  - raw/specs/docs-15-0014-05-0plo-LightingOccupancyDevice-Specification-V1.0-1.pdf
tags: [zigbee, device-type, lighting, dimmable, zll, zha]
created: 2026-05-01
updated: 2026-05-01
device_type: "Dimmable Light"
profile: "ZLL / ZHA"
---

# Dimmable Light Device

## 概述

Dimmable Light 是可调光照明终端设备类型，在 On/Off Light 基础上增加亮度调节能力。

## Cluster 配置

### Server Clusters (必需)
| Cluster | ID | 功能 |
|---------|-----|------|
| Basic | 0x0000 | 设备基础信息 |
| Identify | 0x0003 | 设备识别 |
| Groups | 0x0004 | 群组控制 |
| Scenes | 0x0005 | 场景记忆 |
| On/Off | 0x0006 | 开关控制 |
| Level Control | 0x0008 | 亮度控制 |

## 功能层级

层次关系：
- [[entities/device-on-off-light]] (基础) → **Dimmable Light** (当前) → [[entities/device-color-light]] (高级)

## 测试规范

- `raw/test-specs/docs-15-0312-05-pfnd-0x0008-Level-Control-Test-Specification.pdf` (1.1MB, 64p)

## 交叉引用

- [[entities/spec-lighting-occupancy-device-v1]]
- [[entities/device-on-off-light]]
- [[entities/device-color-light]]
