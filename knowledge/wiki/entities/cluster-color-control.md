---
title: "Color Control Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
  - raw/test-specs/docs-15-0314-05-pfnd-0x0300-Color-Control-Cluster-Test-Specification.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, lighting, color-control]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0300"
status: reviewed
confidence: 0.80
---

# Color Control Cluster (0x0300)

## 概述

Color Control Cluster（Cluster ID `0x0300`）属于 ZCL Rev 7 的 Lighting 功能域，章节定位为 5.2。控制可变色灯具的 hue/saturation、xy、色温和增强色彩相关行为。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.354-p.387`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0300` |
| 名称 | Color Control |
| 功能域 | Lighting |
| Rev 7 章节 | 5.2 |
| 来源页 | p.354-p.387 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. This cluster provides an interface for changing the color of a light. Color is specified according to the Commission Internationale de l'Éclairage (CIE) specification CIE 1931 Color Space, [I1]. Color control is carried out in terms of x,y values, as defined by this specification. Additionally, color MAY optionally be controlled in terms of color temperature...

### 依赖

5.2.2.1.1 Coupling color temperature to Level Control67 If the Level Control for Lighting cluster identifier 0x0008 is supported on the same endpoint as the Color Control cluster and color temperature is supported, it is possible to couple changes in the current level to the color temperature...

### 属性

- `0x0003` CurrentX uint16 0x0000 - 0xfeff M3
- `0x0004` CurrentY uint16 0x0000 - 0xfeff RPS M3
- `0x0006` CompensationText
- `0x0007` ColorTemperatureMireds uint16 0x0000 - 0xfeff RPS68 M4
- `0x000F` Options69 map8 RW 0x00 M
- `0x400D` CoupleColorTempToLevelMinMireds71 uint16 ColorTempPhysicalMaxMireds
- `0xFFFF` indicates an invalid value
- `0x0013` Primary1Intensity uint8 0x00 - 0xff R - M0
- `0x0014` Reserved - - - - -
- `0x0017` Primary2Intensity uint8 0x0000- 0xff R - M1
- `0x0018` Reserved - - - - -
- `0x001B` Primary3Intensity uint8 0x00 - 0xff R - M2
- `0x0023` Reserved - - - - -
- `0x0027` Reserved - - - - -
- `0x0035` Reserved - - - - -
- `0x0039` Reserved - - - - -

### 命令

- `0x00` Decrement the hue in the color loop.
- `0x01` Increment the hue in the color loop.
- `0x02` Activate the color loop from the value of the EnhancedCurrentHue attribute.
- `0x03` Move to Saturation M0
- `0x04` Move Saturation M0
- `0x05` Step Saturation M0
- `0x06` Move to Hue and Saturation M0
- `0x07` Move to Color M3
- `0x08` Move Color M3
- `0x09` Step Color M3
- `0x0A` Move to Color Temperature M4
- `0x40` Enhanced Move to Hue M1
- `0x41` Enhanced Move Hue M1
- `0x42` Enhanced Step Hue M1
- `0x43` Enhanced Move to Hue and Saturation M1
- `0x44` Color Loop
- `0x47` Stop Move Step M0,1,3,4
- `0x4B` Move Color Temperature M4
- `0x4C` Step Color Temperature M4

### 行为要点

- This cluster provides an interface for changing the color of a light.
- Additionally, color MAY optionally be controlled in terms of color temperature, or as hue and saturation values based on optionally variable RGB and W color points.
- This relationship is manufacturer specific, with the qualification that the maximum value of the CurrentLevel attribute SHALL correspond to a ColorTemperatureMired attribute value equal to the CoupleColorTempToLevelMinMi...
- This relationship is one-way so a change to the ColorTemperatureMireds attribute SHALL NOT have any effect on the CurrentLevel attribute.
- In order to simulate the behavior of an incandescent bulb, a low value of the CurrentLevel attribute SHALL be associated with a high value of the ColorTemperatureMireds attribute (i.e....

### 测试规范

- 对应测试规范摘要: [[summaries/2026-05-08-color-control-cluster-test-spec]] (测试要求)

## 关键要点

- `0x0300` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
- 本页保留来源页范围，后续实现、测试或差异分析应引用具体页码和章节。
- 本页区分 Rev 7 协议定义与测试规范要求；测试规范内容只作为认证验证入口。

## 交叉引用

- [[entities/spec-zcl-rev7]]
- [[summaries/2026-05-08-zcl-rev7]]
- [[summaries/2026-05-08-color-control-cluster-test-spec]]
- [[index]]

## 待深入

- [ ] 按实现需求补齐完整属性表的类型、范围、access、默认值和 M/O 条件。
- [ ] 按 command payload 深读补齐 request/response 字段、状态码和时序。
- [ ] 若存在 profile/device type 约束，链接到对应 Device Type 或测试规范页面。
