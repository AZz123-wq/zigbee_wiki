---
title: "On/Off Switch Configuration Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, general, switch]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0007"
status: reviewed
confidence: 0.84
---

# On/Off Switch Configuration Cluster (0x0007)

## 概述

On/Off Switch Configuration Cluster（Cluster ID `0x0007`）属于 ZCL Rev 7 的 General 功能域，章节定位为 3.9。配置本地开关类型和开关动作映射。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.163-p.167`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0007` |
| 名称 | On/Off Switch Configuration |
| 功能域 | General |
| Rev 7 章节 | 3.9 |
| 来源页 | p.163-p.167 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. Attributes and commands for configuring On/Off switching devices.

### 依赖

Any endpoint that implements this server cluster SHALL also implement the On/Off client cluster.

### 属性

- `0x0007` On /Off Switch Configuration
- `0x0000` SwitchType enum8 0x00 to 0x01 R - M
- `0x0010` SwitchActions enum8 0x00 to 0x02 RW 0x00 M

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- This attribute SHALL be set to one of the nonreserved values listed in Table 3-52.
- Under some conditions it MAY send a toggle or in some other conditions a move command.
- 1 Sw i tch Acti o n s Att ri b u te The SwitchActions attribute is 8 bits in length and specifies the commands of the On/Off cluster (see 3.8) to be generated when the switch moves between its two states...
- Values of the SwitchActions Attribute Command Generated Command Generated Attribute Value When Arriving at State 2 From State 1 When Arriving at State 1 From State 2 0x00 On Off 0x01 Off On 0x02 Toggle Toggle 3.9.2...
- No cluster specific commands are generated or received by the client.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0007` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
