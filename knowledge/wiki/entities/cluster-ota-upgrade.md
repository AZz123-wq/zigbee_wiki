---
title: "OTA Upgrade Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
  - raw/test-specs/16-02824-007-0x0019-OTA-Cluster-Test-Specification-Draft.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, ota, upgrade]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0019"
status: reviewed
confidence: 0.80
---

# OTA Upgrade Cluster (0x0019)

## 概述

OTA Upgrade Cluster（Cluster ID `0x0019`）属于 ZCL Rev 7 的 OTA Upgrade 功能域，章节定位为 11.3 / 11.10 / 11.13。定义 OTA image 查询、分块下载、升级结束和镜像通知流程。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.733-p.787`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0019` |
| 名称 | OTA Upgrade |
| 功能域 | OTA Upgrade |
| Rev 7 章节 | 11.3 / 11.10 / 11.13 |
| 来源页 | p.733-p.787 |

### 规范摘要

Please see section 2.2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. The cluster provides a standard way to upgrade devices in the network via OTA messages. Thus the upgrade process MAY be performed between two devices from different manufacturers. Devices are required to have application bootloader and additional memory space in order to successfully implement the cluster...

### 依赖

本次页级精读未抽取到独立的 Dependencies 小节；如实现依赖其他 cluster、profile 或设备类型，应回到来源页和应用规范一起确认。

### 属性

- `0x0000` UpgradeServerID EUI64 - R 0xffffffffffffffff M
- `0x0001` FileOffset uint32 all R 0xffffffff O
- `0x0002` CurrentFileVersion uint32 all R 0xffffffff O
- `0x0003` CurrentZigBeeStackVersion uint16 all R 0xffff O
- `0x0004` DownloadedFileVersion uint32 all R 0xffffffff O
- `0x0005` DownloadedZigBeeStackVersion uint16 all R 0xffff O
- `0x0006` ImageUpgradeStatus enum8 all R 0x00 M
- `0x0007` Manufacturer ID uint16 all R - O
- `0x0008` Image
- `0x0009` MinimumBlockPeriod uint16 0x0000-0xfffe127 R 0128 O
- `0x000A` Image Stamp uint32 all R O
- `0x000B` UpgradeActivationPolicy enum8 0x00-0x01 R 0x00 O
- `0x000C` UpgradeTimeout Policy enum8 0x00-0x01 R 0x00 O

### 命令

- `0x00` Query jitter
- `0x01` Query jitter and manufacturer code
- `0x02` Query jitter, manufacturer code, and image type
- `0x03` Query jitter, manufacturer code, image type, and new file version
- `0x04` Image Page Request
- `0x05` Image Block Response
- `0x06` Upgrade End Request
- `0x07` Upgrade End Response
- `0x08` Query Device Specific File Request
- `0x09` Query Device Specific File Response

### 行为要点

- The cluster provides a standard way to upgrade devices in the network via OTA messages.
- Thus the upgrade process MAY be performed between two devices from different manufacturers.
- The upgrade server MAY be notified of such information via the backend system.
- For ZR clients, the server MAY send a message to notify the device when an updated image is available.
- All clients (ZR and ZED) SHALL query (poll) the server periodically to determine whether the server has an image update for them.

### 测试规范

- 对应测试规范摘要: [[summaries/2026-05-08-ota-cluster-test-spec-draft]] (draft 测试要求)

## 关键要点

- `0x0019` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
- 本页保留来源页范围，后续实现、测试或差异分析应引用具体页码和章节。
- 本页区分 Rev 7 协议定义与测试规范要求；测试规范内容只作为认证验证入口。

## 交叉引用

- [[entities/spec-zcl-rev7]]
- [[summaries/2026-05-08-zcl-rev7]]
- [[summaries/2026-05-08-ota-cluster-test-spec-draft]]
- [[index]]

## 待深入

- [ ] 按实现需求补齐完整属性表的类型、范围、access、默认值和 M/O 条件。
- [ ] 按 command payload 深读补齐 request/response 字段、状态码和时序。
- [ ] 若存在 profile/device type 约束，链接到对应 Device Type 或测试规范页面。
