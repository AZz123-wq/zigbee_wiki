---
title: "Time Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
  - raw/test-specs/17-02828-001-0x000a-Time-Cluster-Test-Specification.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, general, time]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x000A"
status: reviewed
confidence: 0.84
---

# Time Cluster (0x000A)

## 概述

Time Cluster（Cluster ID `0x000A`）属于 ZCL Rev 7 的 General 功能域，章节定位为 3.12。提供 UTC 时间、本地时间、时区、夏令时和时间有效性状态。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.180-p.185`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x000A` |
| 名称 | Time |
| 功能域 | General |
| Rev 7 章节 | 3.12 |
| 来源页 | p.180-p.185 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. This cluster provides a basic interface to a real-time clock. The clock time MAY be read and also written, in order to synchronize the clock (as close as practical) to a time standard. This time standard is the number of seconds since 0 hrs 0 mins 0 sec on 1st January 2000 UTC (Universal Coordinated Time)...

### 依赖

本次页级精读未抽取到独立的 Dependencies 小节；如实现依赖其他 cluster、profile 或设备类型，应回到来源页和应用规范一起确认。

### 属性

- `0x0000` Time
- `0x0001` TimeStatus map8 0000 xxxx RW 0b00000000 M
- `0x0002` TimeZone int32 -86400 to +86400 RW 0x00000000 O
- `0x0003` DstStart uint32 0x00000000 to 0xfffffffe RW 0xffffffff O
- `0x0004` DstEnd uint32 0x00000000 to 0xfffffffe RW 0xffffffff O
- `0x0005` DstShift int32 -86400 to +86400 RW 0x00000000 O
- `0x0006` StandardTime uint32 0x00000000 to 0xfffffffe R 0xffffffff O
- `0x0007` LocalTime uint32 0x00000000 to 0xfffffffe R 0xffffffff O
- `0x0008` LastSetTime
- `0x0009` ValidUntilTime

### 命令

- Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。

### 行为要点

- This cluster provides a basic interface to a real-time clock.
- The clock time MAY be read and also written, in order to synchronize the clock (as close as practical) to a time standard.
- This attribute has data type UTCTime, but note that it MAY not actually be synchronized to UTC - see discussion of the TimeStatus attribute.
- If the Master bit of the TimeStatus attribute has a value of 0, writing to this attribute SHALL set the real time clock to the written value, otherwise it cannot be written.
- The Synchronized bit specifies whether Time has been set over the network to synchronize it (as close as MAY be practical) to the time standard (see 3.12.1).

### 测试规范

- 对应测试规范摘要: [[summaries/2026-05-08-time-cluster-test-spec]] (测试要求)

## 关键要点

- `0x000A` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
- 本页保留来源页范围，后续实现、测试或差异分析应引用具体页码和章节。
- 本页区分 Rev 7 协议定义与测试规范要求；测试规范内容只作为认证验证入口。

## 交叉引用

- [[entities/spec-zcl-rev7]]
- [[summaries/2026-05-08-zcl-rev7]]
- [[summaries/2026-05-08-time-cluster-test-spec]]
- [[index]]

## 待深入

- [ ] 按实现需求补齐完整属性表的类型、范围、access、默认值和 M/O 条件。
- [ ] 按 command payload 深读补齐 request/response 字段、状态码和时序。
- [ ] 若存在 profile/device type 约束，链接到对应 Device Type 或测试规范页面。
