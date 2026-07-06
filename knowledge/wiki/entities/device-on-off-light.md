---
title: "On/Off Light Device"
type: entity
sources:
  - raw/specs/docs-15-0014-05-0plo-LightingOccupancyDevice-Specification-V1.0-1.pdf
  - raw/test-specs/docs-15-0310-05-pfnd-0x0006-OnOff-Cluster-Test-Specification.pdf
tags: [zigbee, device-type, lighting, on-off, zll, zha]
created: 2026-05-01
updated: 2026-05-01
device_type: "On/Off Light"
profile: "ZLL / ZHA"
---

# On/Off Light Device

## 概述

On/Off Light 是最基础的照明终端设备类型，支持简单的开关控制。定义于 [[entities/spec-lighting-occupancy-device-v1]]。

## Cluster 配置

### Server Clusters (必需)
| Cluster | ID | 功能 |
|---------|-----|------|
| Basic | 0x0000 | 设备基础信息 |
| Identify | 0x0003 | 设备识别 |
| Groups | 0x0004 | 群组控制 |
| Scenes | 0x0005 | 场景记忆 |
| On/Off | 0x0006 | 开关控制 |

### Client Clusters
| Cluster | ID | 功能 |
|---------|-----|------|
| (无) | - | - |

## 功能层级

On/Off Light 是照明设备的**最基础层级**，向上还包括：
- [[entities/device-dimmable-light]] — 增加亮度控制
- [[entities/device-color-light]] — 增加颜色控制

## 测试规范

- `raw/test-specs/docs-15-0310-05-pfnd-0x0006-OnOff-Cluster-Test-Specification.pdf` (1.2MB, 63p)

## 交叉引用

- [[entities/spec-lighting-occupancy-device-v1]]
- [[entities/cluster-on-off]]
