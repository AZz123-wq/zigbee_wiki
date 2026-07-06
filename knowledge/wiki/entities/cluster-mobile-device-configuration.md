---
title: "Mobile Device Configuration Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, retail, mobile-device]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0022"
status: reviewed
confidence: 0.84
---

# Mobile Device Configuration Cluster (0x0022)

## 概述

Mobile Device Configuration Cluster（Cluster ID `0x0022`）属于 ZCL Rev 7 的 Retail 功能域，章节定位为 14.3。配置移动设备 keepalive、rejoin 等网络管理参数。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.894-p.898`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0022` |
| 名称 | Mobile Device Configuration |
| 功能域 | Retail |
| Rev 7 章节 | 14.3 |
| 来源页 | p.894-p.898 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. This cluster provides an interface to enable the management of mobile devices in a network. If a stack supports neighbor entry aging, the mobile device will be able to use this cluster to refresh the information in the parent/neighbor. An application will be also able to configure aging timeout (using the Neighbor cleaning cluster) greater than KeepAliveTime...

### 依赖

This cluster should be supported by devices that are mobile in the network. The devices building the network infrastructure should use the Neighbor Cleaning Cluster to manage the loss of the mobile devices from the radio range.

### 属性

- `0x0000` KeepAliveTime uint16 0x0001- 0xFFFF RW Seconds M
- `0x0001` RejoinTimeout uint16 0x0000- 0xFFFF RW Seconds 0xFFFF (Never) M

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- This cluster provides an interface to enable the management of mobile devices in a network.
- If a stack supports neighbor entry aging, the mobile device will be able to use this cluster to refresh the information in the parent/neighbor.
- Please note that a value of this attribute equal to 0xFFFF means that the mobile device shall not send KeepAliveNotification messages.
- 14.3.2.2.2 RejoinTimeout Attribute The RejoinTimeout attribute specifies the time after which the device shall perform a secure network rejoin to clean the entries in the neighbor table for parent devices not cleaning th...
- (Note: The mobile device may choose to transmit a Network Leave frame to the short address being cleaned.) 14.3.2.3 Commands Received No cluster-specific commands are received by the server side of this cluster.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0022` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
