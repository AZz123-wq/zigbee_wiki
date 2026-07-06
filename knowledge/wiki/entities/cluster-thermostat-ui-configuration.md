---
title: "Thermostat User Interface Configuration Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, hvac, thermostat-ui]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0204"
status: reviewed
confidence: 0.84
---

# Thermostat User Interface Configuration Cluster (0x0204)

## 概述

Thermostat User Interface Configuration Cluster（Cluster ID `0x0204`）属于 ZCL Rev 7 的 HVAC 功能域，章节定位为 6.6。配置 thermostat UI 的温度显示、按键锁定和调度编程可见性。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.435-p.440`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0204` |
| 名称 | Thermostat User Interface Configuration |
| 功能域 | HVAC |
| Rev 7 章节 | 6.6 |
| 来源页 | p.435-p.440 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. This cluster provides an interface to allow configuration of the user interface for a thermostat, or a thermostat controller device, that supports a keypad and LCD screen.

### 依赖

本次页级精读未抽取到独立的 Dependencies 小节；如实现依赖其他 cluster、profile 或设备类型，应回到来源页和应用规范一起确认。

### 属性

- 未从页级文本中稳定抽取到属性表行；该 cluster 可能以命令为主，或表格需要按来源页人工复核。

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- This cluster provides an interface to allow configuration of the user interface for a thermostat, or a thermostat controller device, that supports a keypad and LCD screen.
- This attribute SHALL be set to one of the non-reserved values in Table 6-50.
- This attribute SHALL be set to one of the non-reserved values Table 6-51KeypadLockou.
- The schedule programming MAY still be performed via a remote interface, and the thermostat MAY operate in schedule programming mode.
- This command is designed to prevent local tampering with or disabling of schedules that MAY have been programmed by users or service providers via a more capable remote interface.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0204` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
