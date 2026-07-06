---
title: "Zigbee Specification R22"
type: entity
sources:
  - raw/specs/docs-05-3474-22-0csg-zigbee-specification-1.pdf
tags: [zigbee, spec, r22, core-spec, phy, mac, nwk, aps, zdo, security]
created: 2026-05-01
updated: 2026-05-08
spec_version: "R22 (Revision 22) v1.0"
spec_doc_id: "05-3474-22"
spec_date: "2017-04-19"
---

# Zigbee Specification R22

## 概述

Zigbee R22 (Revision 22) 是 Zigbee Alliance 在 2017 年 4 月发布的核心规范版本，首次整合了 Sub GHz FSK PHY/MAC 支持和 Green Power 设备框架。定义了完整的五层协议栈架构。

## 版本信息

- **规范**: Zigbee Specification
- **版本**: Revision 22, Version 1.0
- **文档编号**: 05-3474-22
- **发布日期**: April 19, 2017
- **页数**: 599 页 (pdfinfo, 7.2MB)
- **文字状态**: Poppler 文本可连续提取；旧 fallback extractor 只识别 38 页，不作为页码基准

## 协议栈架构 (五层)

| 层 | 功能 | 标准 |
|----|------|------|
| Application (AF) | 应用框架 | ZigBee Profile |
| ZDO / ZDP | 设备对象 / 设备 Profile | ZigBee Spec |
| APS | 应用支持子层 (帧/安全/绑定) | ZigBee Spec |
| NWK | 网络层 (路由/发现/维护) | ZigBee Spec |
| MAC | 介质访问控制 | IEEE 802.15.4 |
| PHY | 2.4GHz + Sub GHz FSK (R22 新增) | IEEE 802.15.4 |

## 关键特性

- **Sub GHz FSK PHY/MAC**: 新增多区域 Sub GHz 频段支持
- **Green Power**: 引入 Green Power 设备帧格式和 Inter-PAN 通信
- **ZDO 命令集**: 30+ 种设备发现、管理、绑定命令
- **安全分层**: NWK 级 (Network Key) + APS 级 (Link Key) 双重加密
- **APS 扩展帧**: Extended Header, Extended Frame Control
- **绑定管理**: 完整绑定/备份/恢复机制
- **安全构建块**: 7 种安全原语 (认证检查、哈希、密钥协商等)

## 核心组件

| 组件 | 功能 | 相关概念 |
|------|------|---------|
| ZDO | 设备对象 (30+ 命令) | [[concepts/zdo-device-discovery]] |
| NWK | 网络层 (路由/邻居/发现) | [[concepts/zigbee-nwk-layer]] |
| Security | 安全服务 (CCM*) | [[concepts/zigbee-security-model]] |
| Binding | 绑定管理 (ZDO 级) | [[concepts/zigbee-binding]] |
| Green Power | 绿色能源设备 | [[concepts/green-power]] |
| APS | 应用支持子层 | [[concepts/zigbee-aps-layer]] |

## ZDO 命令集 (R22 完整版)

见 [[concepts/zdo-device-discovery]] 详细列表。在 R23 中部分 ZDO 功能被废弃。

## 与 R23 的关系

R22 → R23 的重大演进见 [[comparisons/zigbee-r22-vs-r23]]

## 交叉引用

- [[summaries/2026-05-01-zigbee-r22-spec]]
- [[entities/spec-zigbee-r23]]
- [[comparisons/zigbee-r22-vs-r23]]
- [[concepts/zdo-device-discovery]]
- [[concepts/zigbee-security-model]]
- [[concepts/zigbee-nwk-layer]]
