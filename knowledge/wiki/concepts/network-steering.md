---
title: "Network Steering"
type: concept
sources:
  - raw/specs/docs-13-0402-13-00zi-Base-Device-Behavior-Specification.pdf
tags: [zigbee, network-steering, joining, commissioning]
created: 2026-05-01
updated: 2026-05-01
---

# Network Steering

## 概述

Network Steering（网络引导）是 BDB Commissioning 的核心机制之一。当一个 ZigBee 设备尚未加入任何网络时，通过 Network Steering 扫描可用网络并自动加入合适的网络。

## 与 Network Formation 的关系

- **Network Steering**: 设备作为 Joiner 加入已有网络
- **Network Formation**: 设备作为 Coordinator/Router 创建新网络

两者在 BDB 规范中同属一个章节（§8 Network Steering procedure），分别覆盖"节点不在网络上"和"创建网络"两种场景。

## 在 BDB 中的位置

见 [[entities/spec-base-device-behavior-v1]] 第 44-49 页：
- §8.3 Network steering procedure for a node not on a network (p.44)
- §8.4 Network formation procedure (p.49)

## 交叉引用

- [[concepts/bdb-commissioning]]
- [[concepts/bdb-security]]
- [[entities/spec-base-device-behavior-v1]]

## 待深入

- [ ] Network Steering 具体扫描和选择算法
- [ ] Network Formation PAN ID / Channel 选择策略
- [ ] 失败的 fallback 策略
