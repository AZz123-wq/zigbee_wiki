---
title: "Key Establishment Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, smart-energy, security]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0800"
status: reviewed
confidence: 0.80
---

# Key Establishment Cluster (0x0800)

## 概述

Key Establishment Cluster（Cluster ID `0x0800`）属于 ZCL Rev 7 的 Smart Energy 功能域，章节定位为 10.7。通过证书和密钥协商流程在两个 Zigbee 设备之间建立共享 secret。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.699-p.731`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0800` |
| 名称 | Key Establishment |
| 功能域 | Smart Energy |
| Rev 7 章节 | 10.7 |
| 来源页 | p.699-p.731 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. This cluster provides attributes and commands to perform mutual authentication and establish keys between two ZigBee devices. Figure 10-58 depicts a diagram of a successful key establishment negotiation. 15222 Chapter 10 ZigBee Cluster Library Specification Smart Energy ZigBee Document – 075123 Figure 10-58. Key Establishment Command Exchange 15224 15225 As depicted above...

### 依赖

本次页级精读未抽取到独立的 Dependencies 小节；如实现依赖其他 cluster、profile 或设备类型，应回到来源页和应用规范一起确认。

### 属性

- `0x0800` Key Establishment (Smart Energy)
- `0x0000` KeyEstablishmentSuite enum16 0x0000 - 0xFFFF R 0x0000 M

### 命令

- `0x00` Initiate Key Establishment Response
- `0x01` Ephemeral Data Response
- `0x02` Confirm Key Data Response
- `0x03` Terminate Key Establishment

### 行为要点

- For PKKE schemes, this represents a combination of the 64-bit device address [Z11] and the device’s static public key.
- For PKKE schemes, this represents the public key of a randomly generated key pair.
- This ensures the same key is generated at both ends.
- U and V both calculate the corresponding MAC and compare it with the data received.
- For our purposes, any device that implements the client side of this cluster may be considered the initiator of the secure communication transaction.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0800` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
- 本页保留来源页范围，后续实现、测试或差异分析应引用具体页码和章节。
- 本页区分 Rev 7 协议定义与测试规范要求；测试规范内容只作为认证验证入口。

## 交叉引用

- [[entities/spec-zcl-rev7]]
- [[summaries/2026-05-08-zcl-rev7]]
- [[index]]

## 待深入

- [ ] 按实现需求补齐完整属性表的类型、范围、access、默认值和 M/O 条件。
- [ ] 按 command payload 深读补齐 request/response 字段、状态码和时序。
- [ ] 若存在 profile/device type 约束，链接到对应 Device Type 或测试规范页面。
