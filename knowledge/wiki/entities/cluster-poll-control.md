---
title: "Poll Control Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
  - raw/test-specs/17-02841-001-0x0020-Poll-Control-Cluster-Test-Specification.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, general, poll-control, sleepy-end-device]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0020"
status: reviewed
confidence: 0.84
---

# Poll Control Cluster (0x0020)

## 概述

Poll Control Cluster（Cluster ID `0x0020`）属于 ZCL Rev 7 的 General 功能域，章节定位为 3.16。允许 sleepy end device 通过 check-in/fast poll 机制被客户端临时拉高轮询频率。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.254-p.263`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0020` |
| 名称 | Poll Control |
| 功能域 | General |
| Rev 7 章节 | 3.16 |
| 来源页 | p.254-p.263 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. This cluster provides a mechanism for the management of an end device’s MAC Data Request rate. For the purposes of this cluster, the term “poll” always refers to the sending of a MAC Data Request from the end device to the end device’s parent...

### 依赖

本次页级精读未抽取到独立的 Dependencies 小节；如实现依赖其他 cluster、profile 或设备类型，应回到来源页和应用规范一起确认。

### 属性

- `0x0000` Check-inInterval uint32 0x0 to 0x6E0000 RW 0x3840 (1 hr.) M
- `0x0001` LongPoll Interval uint32 0x04 to 0x6E0000 R 0x14 (5 sec) M
- `0x0002` ShortPollInterval uint16 0x01 to 0xffff R 0x02 (2 qs) M
- `0x0003` FastPollTimeout uint16 0x01 to 0xffff RW 0x28 (10 sec.) M
- `0x0004` Check-inIntervalMin uint32 - R 0 O
- `0x0005` LongPollIntervalMin uint32 - R 0 O
- `0x0006` FastPollTimeoutMax uint16 - R 0 O

### 命令

- `0x00` Check-in Response
- `0x01` Fast Poll Stop
- `0x02` Set Long Poll Interval
- `0x03` Set Short Poll Interval

### 行为要点

- This cluster provides a mechanism for the management of an end device’s MAC Data Request rate.
- Therefore if an end device wants to retrieve messages from its parent, it must send a MAC Data Request every 7.68 seconds.
- This cluster provides a mechanism for forcing this state to make the end device responsive to asynchronous messaging.
- The entire purpose of this cluster is to provide a means of managing when an end device goes into and out of Fast Poll Mode so that it can be made responsive for a controlling device.
- 3.16.3 Commissioning Process Poll Control Cluster Clients SHALL configure bindings on the device implementing the Poll Control Cluster Server so that they will receive the regular check-in command on the configured Check...

### 测试规范

- 对应测试规范摘要: [[summaries/2026-05-08-poll-control-cluster-test-spec]] (测试要求)

## 关键要点

- `0x0020` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
- 本页保留来源页范围，后续实现、测试或差异分析应引用具体页码和章节。
- 本页区分 Rev 7 协议定义与测试规范要求；测试规范内容只作为认证验证入口。

## 交叉引用

- [[entities/spec-zcl-rev7]]
- [[summaries/2026-05-08-zcl-rev7]]
- [[summaries/2026-05-08-poll-control-cluster-test-spec]]
- [[index]]

## 待深入

- [ ] 按实现需求补齐完整属性表的类型、范围、access、默认值和 M/O 条件。
- [ ] 按 command payload 深读补齐 request/response 字段、状态码和时序。
- [ ] 若存在 profile/device type 约束，链接到对应 Device Type 或测试规范页面。
