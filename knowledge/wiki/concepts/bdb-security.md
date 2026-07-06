---
title: "BDB Security (Install Codes & Trust Center)"
type: concept
sources:
  - raw/specs/docs-13-0402-13-00zi-Base-Device-Behavior-Specification.pdf
tags: [zigbee, security, install-code, trust-center, link-key]
created: 2026-05-01
updated: 2026-05-01
---

# BDB Security (Install Codes & Trust Center)

## 概述

BDB 安全模型基于 **Install Codes** 和 **Trust Center Link Keys** 机制，确保 ZigBee 3.0 设备在 Commissioning 过程中的安全密钥交换。

## 核心概念

### Install Codes
- 设备出厂时预置的 128 位密钥
- 通过物理标签（QR 码、打印标签）提供给用户
- 通过哈希函数派生 Trust Center Link Key

### Trust Center Link Keys
- 用于加密 Trust Center 与加入节点之间的通信
- 节点加入网络后通过 Link Key 交换协议获取

### Trust Center
- 网络中负责安全管理的中央节点
- 验证新加入节点的 Install Code
- 分发网络密钥和应用层 Link Keys

## 在 BDB 中的位置

见 [[entities/spec-base-device-behavior-v1]] 第 73-81 页：
- §10.1 Install codes (p.73)
- §10.1.1 Install code format (p.74)
- §10.1.2 Hashing Function (p.75)
- §10.2 Node operations / Link Keys (p.75-80)
- §10.3 Trust Center behavior (p.80)

## 关键流程

1. **Install Code 添加**: Trust Center 接收并存储 Install Code
2. **Link Key 请求**: 加入节点向 Trust Center 请求 Link Key
3. **Link Key 交换**: Trust Center 通过加密通道分发 Link Key
4. **网络密钥分发**: Trust Center 向节点分发加密的网络密钥

## 交叉引用

- [[concepts/bdb-commissioning]]
- [[entities/spec-base-device-behavior-v1]]

## 待深入

- [ ] Install Code Hashing 算法详情 (MMO Hash?)
- [ ] 不同 Security Level 下的密钥长度
- [ ] Certificate-Based Commissioning (R23 新增)
