---
title: "Touchlink Commissioning"
type: concept
sources:
  - raw/specs/docs-13-0402-13-00zi-Base-Device-Behavior-Specification.pdf
tags: [zigbee, touchlink, commissioning, proximity]
created: 2026-05-01
updated: 2026-05-01
---

# Touchlink Commissioning

## 概述

Touchlink Commissioning 是 BDB 定义的一种基于**设备物理接近**的便捷配网机制。用户通过将两个设备靠近来触发网络加入和绑定流程，无需按键或其他操作。

## 两种角色

### Initiator（发起方）
- 通常是遥控器、网关等控制设备
- 扫描附近的 Target 设备并发起配网

### Target（目标方）
- 通常是灯、传感器等终端设备
- 响应 Initiator 的配网请求

## 在 BDB 中的位置

见 [[entities/spec-base-device-behavior-v1]] 第 56-69 页：
- §8.7 Touchlink procedure for an initiator (p.56)
- §8.8 Touchlink procedure for a target (p.63)

## 关键流程

1. Initiator 发起扫描，发现附近 Target
2. 根据信号强度判断物理接近程度
3. 执行网络建立或加入
4. 建立应用层绑定

## 交叉引用

- [[concepts/bdb-commissioning]]
- [[concepts/finding-binding]]
- [[entities/spec-base-device-behavior-v1]]

## 待深入

- [ ] Touchlink 与 ZLL (ZigBee Light Link) 的关系
- [ ] Touchlink Commissioning Cluster 命令详情
- [ ] Inter-PAN 通信机制
