---
title: "Pulse Width Modulation Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, general, level, pwm]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x001C"
status: reviewed
confidence: 0.84
---

# Pulse Width Modulation Cluster (0x001C)

## 概述

Pulse Width Modulation Cluster（Cluster ID `0x001C`）属于 ZCL Rev 7 的 General 功能域，章节定位为 3.20。作为 Level 派生 cluster，控制 PWM 输出、频率和等级边界。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.296-p.298`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x001C` |
| 名称 | Pulse Width Modulation |
| 功能域 | General |
| Rev 7 章节 | 3.20 |
| 来源页 | p.296-p.298 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. This cluster provides an interface for controlling the Pulse Width Modulation (PWM) characteristics of a device. Typical applications include heating element and fan control (10-100Hz), DC electric motors and power efficient LED control (5-10kHz), and switching power supplies (>20kHz). For the purposes of PWM, the value of level is effectively a duty cycle...

### 依赖

本次页级精读未抽取到独立的 Dependencies 小节；如实现依赖其他 cluster、profile 或设备类型，应回到来源页和应用规范一起确认。

### 属性

- 未从页级文本中稳定抽取到属性表行；该 cluster 可能以命令为主，或表格需要按来源页人工复核。

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- This cluster provides an interface for controlling the Pulse Width Modulation (PWM) characteristics of a device.
- The frequency and level (duty cycle) values are reportable and may be configured for reporting.
- 3.20.2.1 Attributes The Pulse Width Modulation server cluster supports the base attributes below.
- 3.20.2.1.2 CurrentFrequency Attribute The CurrentFrequency attribute represents the frequency in 10Hz (hertz) increments up to 655.34 kHz.
- 3.20.2.2 Commands Received The command IDs for the cluster are listed below: Table 3-150.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x001C` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
