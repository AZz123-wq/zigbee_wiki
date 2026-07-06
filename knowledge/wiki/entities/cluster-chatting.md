---
title: "Chatting Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, telecom, chatting]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0905"
status: reviewed
confidence: 0.84
---

# Chatting Cluster (0x0905)

## 概述

Chatting Cluster（Cluster ID `0x0905`）属于 ZCL Rev 7 的 Telecommunication 功能域，章节定位为 12.3。定义聊天用户、聊天室和聊天消息发送相关接口。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.811-p.824`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0905` |
| 名称 | Chatting |
| 功能域 | Telecommunication |
| Rev 7 章节 | 12.3 |
| 来源页 | p.811-p.824 |

### 规范摘要

This section specifies the Chatting cluster, which provides commands and attributes for sending chat messages among ZigBee devices. This cluster is to provide a standardized interface for people using ZigBee devices to chat with each other like they using instant messaging applications through Internet. The transaction sequence numbers used in the ZCL command frames for the Chatting cluster should be the same for the requests and responses...

### 依赖

This cluster does not depend on any other existing clusters. However, in order to successfully fulfill the chatting, Information cluster, Groups cluster and Billing cluster may also need to be implemented in the same device where the chatting cluster is implemented.

### 属性

- `0x0000` U_ID uint16 0x0000-0xffff R M
- `0x0001` Nickname
- `0x0010` C_ID uint16 0x0000-0xffff R M
- `0x0012` EnableAddChat

### 命令

- `0x00` Start Chat Response
- `0x01` Join Chat Response
- `0x02` User Left
- `0x03` User Joined
- `0x04` Search Chat Response
- `0x05` Switch Chairman Request
- `0x06` Switch Chairman Confirm
- `0x07` Switch Chairman Notification
- `0x08` Get Node Information Response

### 行为要点

- 12.3.1.1 Scope and Purpose This section specifies the Chatting cluster, which provides commands and attributes for sending chat messages among ZigBee devices.
- This cluster is to provide a standardized interface for people using ZigBee devices to chat with each other like they using instant messaging applications through Internet.
- The node entering the ZigBee network may search for the available chat sessions and join one of them after choosing one out of different available sessions.
- It is recommended to do so, since in the ad hoc scenario, the chairman can be any devices which may have low computing power and capability, and maintaining more than one session may be difficult for the devices.
- This identifier shall be unique among all the chat sessions in the networks.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0905` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
