---
title: "Green Power (Zigbee Green Power)"
type: concept
sources:
  - raw/specs/docs-05-3474-22-0csg-zigbee-specification-1.pdf
tags: [zigbee, green-power, energy-harvesting, inter-pan]
created: 2026-05-01
updated: 2026-05-01
---

# Green Power (Zigbee Green Power)

## 概述

Green Power (GP) 是 Zigbee R22 引入的功能，支持**无电池/能量采集设备**（如自供电开关、传感器）接入 Zigbee 网络。GP 设备使用特殊的帧格式和 Inter-PAN 通信方式。

## R22 中的 Green Power

| 特性 | 说明 |
|------|------|
| Green Power Device Frame | GP 设备专用帧格式 |
| Stub NWK Header (Inter-PAN) | 桩网络头，用于跨 PAN 通信 |
| Inter-PAN APS Header | 跨 PAN 的 APS 头部 |

## GP 角色

| 角色 | 说明 |
|------|------|
| Green Power Device (GPD) | 无电池设备（能量采集） |
| Green Power Proxy (GPP) | GP 网络代理，将 GP 帧转换为标准 Zigbee 帧 |
| Green Power Sink (GPS) | GP 命令的接收/处理端 |

## Inter-PAN 通信

GP 设备可能不属于任何 Zigbee PAN，通过 Inter-PAN 通信与网络中的 Proxy 设备交互。Proxy 将 Inter-PAN GP 帧转换为网络内标准帧。

## 能量采集类型

| 类型 | 示例 |
|------|------|
| 动能 | 按压式开关 |
| 光能 | 室内光传感器 |
| 温差 | 热电器件 |

## 在 R22 中的位置

见 [[entities/spec-zigbee-r22]]，GP 帧格式定义在附录中。

## 交叉引用

- [[entities/spec-zigbee-r22]]
- [[concepts/zigbee-nwk-layer]]
- [[concepts/zigbee-aps-layer]]
