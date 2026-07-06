---
title: "Zigbee Cluster Library Revision 7"
type: entity
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
tags: [zigbee, spec, zcl, cluster-library, revision-7]
created: 2026-05-01
updated: 2026-05-10
spec_version: "Revision 7"
spec_doc_id: "07-5123-07"
spec_date: "2018-02"
status: reviewed
confidence: 0.88
---

# Zigbee Cluster Library Revision 7

## 概述

ZCL Revision 7 是 Zigbee Cluster Library 的 2018 版本，也是 Rev 8 的直接前版本。它定义 ZCL Foundation 规则和 13 个功能域的标准 cluster，是旧设备、旧测试规范和 Rev 8 差异分析的重要基准。

## 版本信息

- **规范**: Zigbee Cluster Library
- **版本**: Revision 7
- **文档编号**: 07-5123-07
- **出版**: Zigbee Alliance, Feb 2018
- **页数**: 929 页 (pdfinfo, 9.2MB)
- **状态**: 可提取文本；`pdfinfo`/source-page-index 识别 929 页，旧 `/root/pdf_extract.py check` 只识别 894 页，不作为页码基准

## 章节与范围

| 章 | 范围 |
|----|------|
| Chapter 1 | Introduction、conformance、testing/certification 状态 |
| Chapter 2 | Foundation: frame、global command、reporting、data type、status enum |
| Chapter 3 | General clusters |
| Chapter 4 | Measurement and Sensing |
| Chapter 5 | Lighting |
| Chapter 6 | HVAC |
| Chapter 7 | Closures |
| Chapter 8 | Security and Safety |
| Chapter 9 | Protocol Interfaces |
| Chapter 10 | Smart Energy |
| Chapter 11 | Over-the-Air Upgrade |
| Chapter 12 | Telecommunication |
| Chapter 13 | Commissioning |
| Chapter 14 | Retail |
| Chapter 15 | Appliance |

## 精读结论

- Foundation 是 Rev 7 的实现底座，定义 client/server 模型、base/derived cluster instance model、Default Response、attribute reporting、structured attribute selector、addressing 范围和 data type 分类。见 [[concepts/zcl-foundation]]。
- General 章节覆盖常用基础 cluster，包括 Basic、Identify、Groups、Scenes、On/Off、Level、Time、Diagnostics、Poll Control 等。On/Off `0x0006` 已补充 Rev 7 细节，见 [[entities/cluster-on-off]]。
- Poll Control `0x0020` 明确是 ZCL 层对 sleepy end device polling 的管理机制，不等同于 NWK broadcast 或 MAC Data Poll 原语本身。
- OTA Upgrade `0x0019` 使用 client polling 作为基础流程，Image Notify 是可选；安全侧区分 image verification、transport 和 encryption。
- Commissioning `0x0015` 操作 Zigbee stack startup/join 参数，规范强调调用方授权和安全处理；Touchlink `0x1000` 使用 inter-PAN touchlink command set 和 standard unicast utility command set。

## 与 Rev 8 的关系

Rev 7 到 Rev 8 的精确差异应按章节和 cluster 定义比较；当前已确认页数基准为 Rev 7 929 页、Rev 8 1213 页。Rev 7 的 15 章结构已经重新确认，后续对比应优先从 Foundation、General、OTA、Commissioning、Smart Energy 入手。

见 [[comparisons/zcl-rev7-vs-rev8]] 待深入对比。

## 交叉引用

- [[entities/spec-zcl-rev8]]
- [[summaries/2026-05-08-zcl-rev7]]
- [[comparisons/zcl-rev7-vs-rev8]]
- [[concepts/zcl-foundation]]
- [[entities/cluster-on-off]]
