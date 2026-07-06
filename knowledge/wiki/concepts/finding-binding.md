---
title: "Finding & Binding"
type: concept
sources:
  - raw/specs/docs-13-0402-13-00zi-Base-Device-Behavior-Specification.pdf
tags: [zigbee, binding, commissioning, finding-binding]
created: 2026-05-01
updated: 2026-05-01
---

# Finding & Binding

## 概述

Finding & Binding 是 BDB Commissioning 中的一种机制，用于在两个已加入同一网络的 ZigBee 设备之间建立应用层绑定关系。通过绑定，设备之间可以自动进行属性报告和控制命令传递。

## 两种角色

### Initiator Endpoint（发起端点）
- 主动发起 Finding & Binding 流程
- 寻找匹配的 Target 端点并建立绑定

### Target Endpoint（目标端点）
- 响应发起方的绑定请求
- 提供自身 Cluster 能力信息

## 在 BDB 中的位置

见 [[entities/spec-base-device-behavior-v1]] 第 51-55 页：
- §8.5 Finding & binding procedure for a target endpoint (p.51)
- §8.6 Finding & binding procedure for an initiator endpoint (p.52)

## 与其他机制对比

| 机制 | 近距离 | 需要预先加入网络 |
|------|--------|-----------------|
| Finding & Binding | 否 | 是 |
| Touchlink | 是 | 否（可跨网络）|

## 交叉引用

- [[concepts/bdb-commissioning]]
- [[concepts/touchlink-commissioning]]
- [[entities/spec-base-device-behavior-v1]]

## 待深入

- [ ] Identify 模式下 Finding & Binding 详细流程
- [ ] EZ-Mode 与标准模式的差异
