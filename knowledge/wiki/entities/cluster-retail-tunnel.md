---
title: "Retail Tunnel Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, retail, tunnel]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0617"
status: reviewed
confidence: 0.84
---

# Retail Tunnel Cluster (0x0617)

## 概述

Retail Tunnel Cluster（Cluster ID `0x0617`）属于 ZCL Rev 7 的 Retail 功能域，章节定位为 14.2。在 manufacturer-specific profile 与手持设备之间传输 retail tunnel APDU。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.891-p.895`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0617` |
| 名称 | Retail Tunnel |
| 功能域 | Retail |
| Rev 7 章节 | 14.2 |
| 来源页 | p.891-p.895 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. This cluster provides an interface for transferring information encoded through a specific Manufacturer specific Profile from a device (e.g., a backend application using a gateway) to a handheld device (e.g., the Retail HHD). The messages that are transferred use a transfer APDU command as for other tunneling clusters defined (e.g., 11073 Protocol tunnel, or ISO 7818 tunnel)...

### 依赖

This cluster may leverage on the Partition cluster in order to carry payloads not fitting into a single ZCL payload.

### 属性

- 未从页级文本中稳定抽取到属性表行；该 cluster 可能以命令为主，或表格需要按来源页人工复核。

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- This cluster provides an interface for transferring information encoded through a specific Manufacturer specific Profile from a device (e.g., a backend application using a gateway) to a handheld device (e.g....
- 14.2.2.3 Commands Received Table 14-3 lists the cluster-specific commands that are received by the server.
- Cluster-specific Commands Received by the Server Command identifier field value Description Mandatory / Optional 0x00 Transfer APDU M 14.2.2.3.1 Transfer APDU Command 14.
- 1 Payl o ad F o rmat The Transfer APDU command shall be formatted as illustrated in Figure 14-2.
- 3 Wh en G en erated Chapter 14 ZigBee Cluster Library Specification Retail ZigBee Document – 075123 This command is generated when a message has to be transferred across a MSP tunnel.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0617` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
