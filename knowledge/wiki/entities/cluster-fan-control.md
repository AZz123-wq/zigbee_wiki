---
title: "Fan Control Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
  - raw/test-specs/17-02840-001-0x0202-Fan-Control-Cluster-Test-Specification.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, hvac, fan]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0202"
status: reviewed
confidence: 0.84
---

# Fan Control Cluster (0x0202)

## 概述

Fan Control Cluster（Cluster ID `0x0202`）属于 ZCL Rev 7 的 HVAC 功能域，章节定位为 6.4。控制 HVAC fan 的模式和模式序列。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.430-p.433`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0202` |
| 名称 | Fan Control |
| 功能域 | HVAC |
| Rev 7 章节 | 6.4 |
| 来源页 | p.430-p.433 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. This cluster specifies an interface to control the speed of a fan as part of a heating / cooling system.

### 依赖

本次页级精读未抽取到独立的 Dependencies 小节；如实现依赖其他 cluster、profile 或设备类型，应回到来源页和应用规范一起确认。

### 属性

- 未从页级文本中稳定抽取到属性表行；该 cluster 可能以命令为主，或表格需要按来源页人工复核。

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- It SHALL be set to one of the nonreserved values in Table 6-41: 9606 Table 6-41.
- This MAY be accomplished by use of the Occupancy Sensing cluster (see 4.8).
- It SHALL be set to one of the non-reserved values in Table 6-42FanSequenceOperatio.
- FanSequenceOperation Attribute Values Attribute Value Description 0x00 Low/Med/High 0x01 Low/High 0x02 Low/Med/High/Auto 0x03 Low/High/Auto 0x04 On/Auto 6.4.2...
- No cluster specific commands are received by the server.

### 测试规范

- 对应测试规范摘要: [[summaries/2026-05-08-fan-control-cluster-test-spec]] (测试要求)

## 关键要点

- `0x0202` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
- 本页保留来源页范围，后续实现、测试或差异分析应引用具体页码和章节。
- 本页区分 Rev 7 协议定义与测试规范要求；测试规范内容只作为认证验证入口。

## 交叉引用

- [[entities/spec-zcl-rev7]]
- [[summaries/2026-05-08-zcl-rev7]]
- [[summaries/2026-05-08-fan-control-cluster-test-spec]]
- [[index]]

## 待深入

- [ ] 按实现需求补齐完整属性表的类型、范围、access、默认值和 M/O 条件。
- [ ] 按 command payload 深读补齐 request/response 字段、状态码和时序。
- [ ] 若存在 profile/device type 约束，链接到对应 Device Type 或测试规范页面。
