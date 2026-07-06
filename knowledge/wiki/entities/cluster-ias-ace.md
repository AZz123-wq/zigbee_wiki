---
title: "IAS ACE Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, ias, security-safety]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0501"
status: reviewed
confidence: 0.84
---

# IAS ACE Cluster (0x0501)

## 概述

IAS ACE Cluster（Cluster ID `0x0501`）属于 ZCL Rev 7 的 Security and Safety 功能域，章节定位为 8.3。定义 IAS 面板/ACE 的 arm、bypass、zone 状态和 panel 状态交互。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.510-p.526`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0501` |
| 名称 | IAS ACE |
| 功能域 | Security and Safety |
| Rev 7 章节 | 8.3 |
| 来源页 | p.510-p.526 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. The IAS ACE cluster defines an interface to the functionality of any Ancillary Control Equipment of the IAS system. Using this cluster, an ACE device can access a IAS CIE device and manipulate the IAS system, on behalf of a level- 2 user (see [N1]). The client is usually implemented by the IAS ACE device. It allows the IAS ACE device to control the IAS CIE device...

### 依赖

本次页级精读未抽取到独立的 Dependencies 小节；如实现依赖其他 cluster、profile 或设备类型，应回到来源页和应用规范一起确认。

### 属性

- 未从页级文本中稳定抽取到属性表行；该 cluster 可能以命令为主，或表格需要按来源页人工复核。

### 命令

- `0x00` Arm Response
- `0x01` Get Zone ID Map Response
- `0x02` Get Zone Information Response
- `0x03` Zone Status Changed
- `0x04` Panel Status Changed
- `0x05` Get Panel Status Response
- `0x06` Set Bypassed Zone List
- `0x07` Bypass Response
- `0x09` Get Zone Status
- `0x08` Get Zone Status Response

### 行为要点

- 8.3.2.3 Commands Received The received command IDs for the IAS ACE server cluster are listed in Table 8-13Received Command IDs for the IAS ACE Cluster.
- 1 Payl o ad F o rmat The Arm command payload SHALL be formatted as illustrated in Figure 8-6.
- 2 Arm Mo d e F i el d The Arm Mode field SHALL have one of the values shown in Table 8-14Arm Mode Field Values.
- 3 Arm/ Di sa rm Co d e F i el d The Arm/Disarm Code SHALL be a code entered into the ACE client (e.g., security keypad) or system by the user upon arming/disarming.
- The server MAY validate the Arm/Disarm Code received from the IAS ACE client in Arm command payload before arming or disarming the system.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0501` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
