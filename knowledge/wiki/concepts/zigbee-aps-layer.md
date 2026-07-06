---
title: "Zigbee APS (Application Support Sub-layer)"
type: concept
sources:
  - raw/specs/docs-05-3474-22-0csg-zigbee-specification-1.pdf
tags: [zigbee, aps, framing, application]
created: 2026-05-01
updated: 2026-05-01
---

# Zigbee APS (Application Support Sub-layer)

## 概述

APS (Application Support Sub-layer) 是 Zigbee 协议栈中位于 NWK 层和 ZDO/AF 之间的子层，负责**帧格式定义、安全封装和绑定支持**。

## 核心功能

### 1. 帧格式
| 帧元素 | 说明 |
|--------|------|
| General APS Frame Format | 通用 APS 帧结构 |
| Frame Control Field | 4 字节帧控制字段 |
| Extended Header | 扩展头部子层 |
| Extended Frame Control | 扩展帧控制字段 |
| Data Frame Format | 数据帧格式 |

### 2. 安全
- **APS Layer Security**: 使用 Link Key 的应用层加密
- **Secured APS Layer Frame Format**: 加密后的 APS 帧
- **Application Link Key Transport**: Link Key 传输格式

### 3. Inter-PAN
- **Stub NWK Header**: 用于 Inter-PAN 通信的桩 NWK 头
- **Inter-PAN APS Header**: 跨 PAN 的 APS 帧头
- 主要用于 Green Power 场景

## APS 在协议栈中的位置

```
ZDO / AF  (应用对象)
    ↕ SAP
  APS     ← 帧组装、安全封装、绑定处理
    ↕ SAP
  NWK     ← 路由、地址分配
```

## 交叉引用

- [[entities/spec-zigbee-r22]]
- [[concepts/zigbee-security-model]]
- [[concepts/green-power]]
- [[concepts/zigbee-binding]]
