---
title: "Zigbee Security Model (R22)"
type: concept
sources:
  - raw/specs/docs-05-3474-22-0csg-zigbee-specification-1.pdf
  - raw/specs/docs-05-3474-23-csg-zigbee-specificationR23.1.pdf
tags: [zigbee, security, nwk-security, aps-security, key-management, ccm]
created: 2026-05-01
updated: 2026-05-01
---

# Zigbee Security Model (R22)

## 概述

Zigbee R22 安全基于**对称密码学 CCM\* 模式**，采用分层安全架构：NWK 层使用 Network Key 保护网络级通信，APS 层使用 Link Key 保护应用级单播通信。

## 分层安全架构

```
┌──────────────────────────────────┐
│  APS Layer Security              │
│  密钥: Link Key                  │
│  范围: Application 单播          │
├──────────────────────────────────┤
│  NWK Layer Security              │
│  密钥: Network Key               │
│  范围: Network 广播/路由帧       │
├──────────────────────────────────┤
│  MAC Layer (802.15.4, 无内置)   │
└──────────────────────────────────┘
```

## 密钥体系

| 密钥类型 | 用途 | 传输方式 |
|---------|------|---------|
| **Network Key** | NWK 层广播/组播加密 | Network Key Transport |
| **Trust Center Link Key** | TC ↔ 设备单播信任 | Trust Center Link Key Transport |
| **Application Link Key** | 应用间对等单播 | Application Link Key Transport |

## 安全帧格式

| 帧元素 | 说明 |
|--------|------|
| Secured NWK Layer Frame | 加密后的 NWK 帧（含 Auxiliary Header） |
| Secured APS Layer Frame | 加密后的 APS 帧 |
| Auxiliary Frame Header | 辅助安全帧头（Frame Counter + Key ID） |
| Security Control Field | 安全控制字段 |

## 安全构建块 (7 种)

| 构建块 | 说明 |
|--------|------|
| Authentication Checking Transformation | 认证检查变换 |
| Cryptographic Hash Function | 密码学哈希函数 |
| Keyed Hash Function for MAC | 消息认证码 (HMAC-like) |
| Challenge Domain Parameters | 挑战-应答参数 |
| Key Authenticated Key Agreement | 密钥协商方案 |
| Key Entity Authentication | 密钥实体认证 |

## 关键安全流程

### 1. Joining a Secured Network
设备通过以下步骤加入安全网络：
1. MAC Association 加入网络
2. 向 Trust Center 请求 Network Key
3. TC 验证 Install Code / 预配置 Link Key
4. TC 加密分发 Network Key

### 2. Trust Center Rejoin
设备掉线后通过 Trust Center Rejoin 流程重新加入，无需完整 Commissioning。

### 3. End Application Key Establishment
两个应用间通过 Trust Center 中介建立 Application Link Key。

## R22 → R23 演进

| 特性 | R22 | R23 |
|------|-----|-----|
| 密码学 | 传统 ECC | **Curve25519** |
| Link Key | 静态 | **Dynamic Link Key (NFR)** |
| High Security | 移除 | — |
| CCM* | ✅ | ✅ |

## 交叉引用

- [[entities/spec-zigbee-r22]]
- [[entities/spec-zigbee-r23]]
- [[concepts/bdb-security]]
- [[concepts/zigbee-nwk-layer]]
- [[comparisons/zigbee-r22-vs-r23]]
