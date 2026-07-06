---
title: "ZCL Foundation"
type: concept
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, zcl, foundation, attributes, reporting, data-types]
created: 2026-05-10
updated: 2026-05-10
status: reviewed
confidence: 0.87
---

# ZCL Foundation

## 概述

ZCL Foundation 是 Zigbee Cluster Library 的通用底座。它定义所有 cluster 共享的数据模型、client/server 模型、ZCL frame、全局命令、attribute reporting、structured attribute 操作、addressing 范围、data type 和 status enum。

本页基于 ZCL Revision 7 Chapter 2 精读整理，主要来源窗口为 `raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.47-p.97`。

## 正文

### Cluster 和实例模型

- Cluster specification 定义独立功能实体，通常不应依赖自身应用域之外的功能。
- Cluster identifier 是 16-bit 值，用于标识 cluster specification 和 cluster instance 的目的。
- 一个抽象 cluster specification 可映射到多个更具体的 cluster identifier，例如 Concentration Measurement 族群。
- Derived cluster specification 必须保留 base cluster 的 mandatory requirements，可以把 base 中 optional 的要求收紧为 mandatory。
- 如果同一 endpoint 同时支持 base server cluster id 和 derived server cluster id，它们代表同一个 server instance；如果没有 base id 或未在同一 endpoint 出现，则每个 cluster id 代表独立实例。

### Client/Server 模型

- 通常保存 attributes 的一侧是 server，操纵或影响 attributes 的一侧是 client。
- Simple descriptor 中 input cluster list 表示 server clusters；output cluster list 表示 client clusters。
- Attribute read/write 常见方向是 client 到 server，attribute reporting 常见方向是 server 到 client。

### ZCL Frame

通用 ZCL frame 由以下部分组成：

| 字段 | 说明 |
|------|------|
| Frame control | frame type、manufacturer-specific、direction、disable default response、reserved bits |
| Manufacturer code | 只有 manufacturer-specific bit 为 1 时出现 |
| Transaction sequence number | 匹配同一 transaction 中的 request/response |
| Command identifier | global command 或 cluster-specific command id |
| Frame payload | 命令相关载荷 |

Transmission 规则要求 reserved/unspecified bits 发送时置 0；reception 规则要求非 manufacturer-specific command 在解析时忽略 reserved sub-fields 和追加 octets，以保持后向兼容。

### 全局命令

ZCL Rev 7 Foundation 定义的 global command 覆盖：

- `0x00..0x05`: Read/Write Attributes 及响应/无响应写入。
- `0x06..0x09`: Configure Reporting 与 Read Reporting Configuration。
- `0x0A`: Report Attributes。
- `0x0B`: Default Response。
- `0x0C..0x0D`: Discover Attributes 及响应。
- `0x0E..0x10`: Structured Read/Write Attributes 及响应。
- `0x11..0x16`: Discover Commands Received/Generated 与 Discover Attributes Extended。

实现 attributes 的 cluster 通常要支持 read/write/discover。Structured read/write 只在 cluster 支持 array、structure、set 或 bag 这类 structured data 时才有实际意义。

### Default Response

Default Response 在以下典型条件下生成：收到 unicast command、没有其他同 sequence number 的响应、disable default response 未禁止成功响应或发生错误、且不是响应 Default Response 本身。Broadcast/multicast 出错时不生成 Default Response。

这意味着实现时不能简单地把 Default Response 当成所有 command 的固定 ACK；是否发送取决于 unicast、错误状态、响应已存在与 frame control。

### Attribute Reporting

Configure Reporting 的 direction 字段区分两种配置：

| Direction | 含义 |
|-----------|------|
| `0x00` | 配置接收方如何发送 attribute reports，目的地由承载该 attribute 的 cluster binding 解析 |
| `0x01` | 配置接收方如何期待来自对端的 reports，并设置 timeout |

关键规则：

- Array、structure、set、bag 类型不能被 reporting。
- Maximum reporting interval 为 `0xFFFF` 时停止该 attribute 的 reporting 配置。
- Maximum 为 `0x0000` 且 minimum 不为 `0xFFFF` 时没有周期 reporting，但 change-based reporting 仍可工作。
- Discrete data type 任意变化可触发 report；analog data type 按 reportable change 阈值触发。
- Timer consolidation 允许减少实现资源，但不能增加 minimum 或 maximum interval，因为这可能破坏接收方的时序假设。

### Structured Attributes

Structured commands 引入 selector，用于访问 array、structure、set、bag 的整体或元素：

- Array/structure 元素从 1 开始编号。
- 0 号元素固定是 `uint16`，表示元素数量。
- Array 的 0 号元素可选可写，用于改变长度；structure 的 0 号元素不可写。
- Set/Bag 通过 selector 上半字节表示 whole write、add element、remove element。
- Set 不允许重复元素；Bag 允许重复元素。

### Addressing 和类型空间

| 空间 | 标准范围 | 厂商/保留边界 |
|------|----------|----------------|
| Profile ID | `0x0000..0x7FFF` | `0xC000..0xFFFF` 为 manufacturer-specific |
| Device ID | `0x0000..0xBFFF` | 其他保留 |
| Cluster ID | `0x0000..0x7FFF` | `0xFC00..0xFFFF` 为 manufacturer-specific |
| Attribute ID | `0x0000..0x4FFF` | `0xF000..0xFFFE` 为 global attributes |
| Command ID | `0x00..0x7F` | 其他保留；manufacturer-specific command 需配合 manufacturer code |

### Data Types

Rev 7 Foundation 把 data type 分为 discrete 和 analog。Discrete 包括 logical、bitmap、enum、string、identifier、EUI64、key128、array/structure/set/bag 等；analog 包括 signed/unsigned integer、floating point、time 等。Reporting 规则依赖这个分类。

## 关键要点

- ZCL Foundation 是所有 cluster 实现和互操作问题的共同来源。
- Default Response、reporting、manufacturer-specific extension、structured attribute selector 是实现最容易出错的部分。
- Base/derived cluster 与 same-instance 规则直接影响 endpoint simple descriptor、binding 和兼容性判断。
- Poll Control、On/Off、OTA、Commissioning 等具体 cluster 的解释应回到 Foundation 的 frame、command 和 attribute 规则。

## 交叉引用

- [[summaries/2026-05-08-zcl-rev7]]
- [[entities/spec-zcl-rev7]]
- [[entities/spec-zcl-rev8]]
- [[entities/cluster-on-off]]
- [[concepts/sleepy-end-device-broadcast]]

## 待深入

- 补一页 ZCL status enum 专表，覆盖 `UNSUPPORTED_ATTRIBUTE`, `INVALID_VALUE`, `UNREPORTABLE_ATTRIBUTE`, `UNSUPPORTED_CLUSTER` 等实现常用错误。
- 与 ZCL Rev 8 Foundation 做逐项差异对比。
