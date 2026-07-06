---
title: "Door Lock Cluster"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, cluster, zcl, zcl-rev7, closures, door-lock]
created: 2026-05-10
updated: 2026-05-10
cluster_id: "0x0101"
status: reviewed
confidence: 0.80
---

# Door Lock Cluster (0x0101)

## 概述

Door Lock Cluster（Cluster ID `0x0101`）属于 ZCL Rev 7 的 Closures 功能域，章节定位为 7.3。提供门锁状态、用户/PIN/RFID、日程和操作事件相关接口。

Rev 7 精读范围：`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.444-p.489`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。

## 正文

### 定位

| 字段 | 内容 |
|------|------|
| Cluster ID | `0x0101` |
| 名称 | Door Lock |
| 功能域 | Closures |
| Rev 7 章节 | 7.3 |
| 来源页 | p.444-p.489 |

### 规范摘要

Please see Chapter 2 for a general cluster overview defining cluster architecture, revision, classification, identification, etc. The door lock cluster provides an interface to a generic way to secure a door. The physical object that provides the locking functionality is abstracted from the cluster. The cluster has a small list of mandatory attributes and functions and a list of optional features.

### 依赖

本次页级精读未抽取到独立的 Dependencies 小节；如实现依赖其他 cluster、profile 或设备类型，应回到来源页和应用规范一起确认。

### 属性

- `0x0000` LockState enum8 RP - M
- `0x0001` LockType enum8 R - M
- `0x0002` ActuatorEnabled
- `0x0003` DoorState enum8 RP - O
- `0x0004` DoorOpenEvents uint32 RW - O
- `0x0005` DoorClosedEvents uint32 RW - O
- `0x0010` NumberOfLogRecordsSupported uint16 R 0 O
- `0x0011` NumberOfTotalUsersSupported uint16 R 0 O
- `0x0012` NumberOfPINUsersSupported uint16 R 0 O
- `0x0013` NumberOfRFIDUsersSupported uint16 R 0 O
- `0x0014` NumberOfWeekDaySchedulesSupportedPerUser uint8 R 0 O
- `0x0015` NumberOfYearDaySchedulesSupportedPerUser uint8 R 0 O
- `0x0016` NumberOfHolidaySchedulesSupported uint8 R 0 O
- `0x0017` MaxPINCodeLength uint8 R 0x08 O
- `0x0018` MinPINCodeLength uint8 R 0x04 O
- `0x0019` MaxRFIDCodeLength uint8 R 0x14 O
- `0x001A` MinRFIDCodeLength uint8 R 0x08 O
- `0x0020` EnableLogging
- `0x0021` Language
- `0x0026` SupportedOperatingModes map16 R 0x0001 O
- `0x0027` DefaultConfigurationRegister map16 RP 0x0000 O
- `0x0028` EnableLocalProgramming
- `0x0029` EnableOneTouchLocking
- `0x002A` EnableInsideStatusLED
- `0x002B` EnablePrivacyModeButton
- `0x0032` SendPINOverTheAir
- `0x0033` RequirePINforRFOperation
- `0x0034` SecurityLevel enum8 RP 0 O

### 命令

- `0x00` Lock Door Response
- `0x01` Unlock Door Response
- `0x02` Toggle Response
- `0x03` Unlock with Timeout Response
- `0x04` Get Log Record Response
- `0x05` Set PIN Code Response
- `0x06` Get PIN Code Response
- `0x07` Clear PIN Code Response
- `0x08` Clear All PIN Codes Response
- `0x09` Set User Status Response
- `0x0A` Get User Status Response
- `0x0B` Set Weekday Schedule Response
- `0x0C` Get Weekday Schedule Response
- `0x0D` Clear Weekday Schedule Response
- `0x0E` Set Year Day Schedule Response
- `0x0F` Get Year Day Schedule Response
- `0x10` Clear Year Day Schedule Response
- `0x11` Set Holiday Schedule Response
- `0x12` Get Holiday Schedule Response
- `0x13` Clear Holiday Schedule Response
- `0x14` Set User Type Response
- `0x15` Get User Type Response
- `0x16` Set RFID Code Response
- `0x17` Get RFID Code Response
- `0x18` Clear RFID Code Response
- `0x19` Clear All RFID Codes Response
- `0x20` Operating Event Notification
- `0x21` Programming Event Notification

### 行为要点

- The door lock cluster provides an interface to a generic way to secure a door.
- The physical object that provides the locking functionality is abstracted from the cluster.
- Chapter 7 ZigBee Cluster Library Specification Closures ZigBee Document – 075123 7.3.2.1.1 Alarms The door lock cluster provides several alarms which can be sent when there is a critical state on the door lock.
- Format of the Alarm Cluster Octets 1 2 Data Type enum8 Cluster ID Field Name Alarm Code Cluster Identifier Field Value 0x00 0x0101 7.3.2.1...
- Report example: If an application wants to know each time a programming change is made on the door lock, it can use the reporting mechanism to be informed of changes to the Operating Mode attribute.

### 测试规范

- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。

## 关键要点

- `0x0101` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。
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
