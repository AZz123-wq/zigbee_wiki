---
title: "Scenes Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
  - raw/test-specs/docs-15-0308-05-pfnd-0x0005-Scenes-Cluster-Test-Specification.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, general, scenes]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0005"
status: reviewed
confidence: 0.84
---

# Scenes Cluster (0x0005)

## 概述

Scenes Cluster（Cluster ID `0x0005`）属于 ZCL Rev 7 的 General 功能域，章节定位为 3.7。保存、调用和管理一组 cluster 属性快照，用于场景控制。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.141-p.156`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0005` |
| 名称 | Scenes |
| 功能域 | General |
| Rev 7 章节 | 3.7 |
| 来源页 | p.141-p.156 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. The scenes cluster provides attributes and commands for setting up and recalling scenes. Each scene corresponds to a set of stored values of specified attributes for one or more clusters on the same end point as the scenes cluster. In most cases scenes are associated with a particular group ID. Scenes MAY also exist without a group, in which case the value 0x0000 replaces the group ID...

### 依赖

Any endpoint that implements the Scenes server cluster SHALL also implement the Groups server cluster. Zigbee Cluster Library Specification Chapter 3

### 属性

- `0x0000` SceneCount uint8 0x00 to 0xff (see 3.7.2.3.2 ) R 0x00 M
- `0x0001` CurrentScene uint8 0x00 to 0xff (see 3.7.2.3.2) R 0x00 M
- `0x0002` CurrentGroup uint16 0x0000 to 0xfff7 R 0x00 M
- `0x0003` SceneValid
- `0x0004` NameSupport map8 x0000000 R - M
- `0x0005` LastConfiguredBy EUI64 - R - O

### 命令

- `0x00` Add Scene Response
- `0x01` View Scene Response
- `0x02` Remove Scene Response
- `0x03` Remove All Scenes Response
- `0x04` Store Scene Response
- `0x05` Recall Scene
- `0x06` Get Scene Membership Response
- `0x40` Enhanced Add Scene Response
- `0x41` Enhanced View Scene Response
- `0x42` Copy Scene Response

### 行为要点

- The scenes cluster provides attributes and commands for setting up and recalling scenes.
- Scenes MAY also exist without a group, in which case the value 0x0000 replaces the group ID.
- Note that extra care is required in these cases to avoid a scene ID collision, and that commands related to scenes without a group MAY only be unicast, i.e., they MAY not be multicast or broadcast.
- Support of scene names is optional, and is indicated by the NameSupport attribute.
- If scene names are not supported, any commands that write a scene name SHALL simply discard the name, and any command that returns a scene names SHALL return the null string.

### 测试规范

- 对应测试规范摘要: [[summaries/2026-05-08-scenes-cluster-test-spec]] (测试要求)

## 关键要点

- `0x0005` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
- 本页保留来源页范围，后续实现、测试或差异分析应引用具体页码和章节。
- 本页区分 Rev 7 协议定义与测试规范要求；测试规范内容只作为认证验证入口。

## 交叉引用

- [[entities/spec-zcl-rev7]]
- [[summaries/2026-05-08-zcl-rev7]]
- [[summaries/2026-05-08-scenes-cluster-test-spec]]
- [[index]]

## 待深入

- [ ] 按实现需求补齐完整属性表的类型、范围、access、默认值和 M/O 条件。
- [ ] 按 command payload 深读补齐 request/response 字段、状态码和时序。
- [ ] 若存在 profile/device type 约束，链接到对应 Device Type 或测试规范页面。
