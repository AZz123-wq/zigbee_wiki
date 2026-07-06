---
title: "Color Light Device"
type: entity
sources:
  - raw/specs/docs-15-0014-05-0plo-LightingOccupancyDevice-Specification-V1.0-1.pdf
tags: [zigbee, device-type, lighting, color, zll, zha]
created: 2026-05-01
updated: 2026-05-01
device_type: "Color Light (含 Color Dimmable / Color Temperature / Extended Color)"
profile: "ZLL / ZHA"
---

# Color Light Device

## 概述

Color Light 是支持颜色控制的高级照明设备类型。L&O 规范定义了三个颜色子类型：

| 子类型 | 说明 | 页码 |
|--------|------|------|
| Color Dimmable Light | 基础的 RGB 颜色控制 | 33 |
| Color Temperature Light | 色温调节（CCT） | 76 |
| Extended Color Light | 完整的颜色 + 色温控制 | 82 |

## Cluster 配置 (Extended Color Light)

### Server Clusters
| Cluster | ID | 功能 |
|---------|-----|------|
| Basic | 0x0000 | 设备基础信息 |
| Identify | 0x0003 | 设备识别 |
| Groups | 0x0004 | 群组控制 |
| Scenes | 0x0005 | 场景记忆 |
| On/Off | 0x0006 | 开关控制 |
| Level Control | 0x0008 | 亮度控制 |
| Color Control | 0x0300 | 颜色控制 |

## 功能层级

完整层次：
- [[entities/device-on-off-light]] → [[entities/device-dimmable-light]] → **Color Light**

## 测试规范

- `raw/test-specs/docs-15-0314-05-pfnd-0x0300-Color-Control-Cluster-Test-Specification.pdf` (1.7MB, 102p)

## 交叉引用

- [[entities/spec-lighting-occupancy-device-v1]]
- [[entities/device-dimmable-light]]
