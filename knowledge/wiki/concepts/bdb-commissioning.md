---
title: "BDB Commissioning"
type: concept
sources:
  - raw/specs/docs-13-0402-13-00zi-Base-Device-Behavior-Specification.pdf
tags: [zigbee, commissioning, bdb, network-join]
created: 2026-05-01
updated: 2026-05-01
---

# BDB Commissioning

## 概述

BDB Commissioning 是 ZigBee 3.0 Base Device Behavior 规范中定义的一套设备入网机制，确保设备能安全、可靠地加入 ZigBee-PRO 网络并绑定到正确的应用层服务。

## Commissioning 模式

根据 [[entities/spec-base-device-behavior-v1]] 规范，BDB 定义了以下 Commissioning 机制：

### 1. Network Steering（网络引导）
- 设备扫描可用网络并选择合适网络加入
- 适用于节点尚未在网络上时的入网流程
- 见 [[concepts/network-steering]]

### 2. Network Formation（组网）
- 由 Coordinator/Router 创建新网络
- 定义网络参数（PAN ID、Channel、Security Level）
- 见 [[concepts/network-steering]]

### 3. Finding & Binding（查找与绑定）
- 在已入网设备之间建立应用层绑定关系
- 分为 Initiator（发起方）和 Target（目标方）两种角色
- 见 [[concepts/finding-binding]]

### 4. Touchlink Commissioning（近距离配网）
- 基于邻近检测的便捷配网方式
- 同样分为 Initiator 和 Target 两个角色
- 见 [[concepts/touchlink-commissioning]]

## 触发方式

- **Push Button Commissioning**: 通过物理按键触发
- **Touchlink**: 通过设备接近触发
- **Automatic**: 设备上电自动触发（如出厂设备）

## 安全基础

所有 Commissioning 过程依赖 Trust Center 和 Install Code 机制保证安全性。见 [[concepts/bdb-security]]。

## 交叉引用

- [[entities/spec-base-device-behavior-v1]]
- [[concepts/network-steering]]
- [[concepts/finding-binding]]
- [[concepts/touchlink-commissioning]]
- [[concepts/bdb-security]]

## 待深入

- [ ] Network Steering 详细流程步骤
- [ ] Commissioning Cluster 命令细节
- [ ] 各模式下 Timeout / 重试策略
