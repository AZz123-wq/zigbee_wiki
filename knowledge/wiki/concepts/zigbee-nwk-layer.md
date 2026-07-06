---
title: "Zigbee Network (NWK) Layer"
type: concept
sources:
  - raw/specs/docs-05-3474-22-0csg-zigbee-specification-1.pdf
tags: [zigbee, nwk, network, routing, discovery, broadcast, sleepy-end-device]
created: 2026-05-01
updated: 2026-05-08
---

# Zigbee Network (NWK) Layer

## 概述

Zigbee NWK (Network) 层是协议栈的核心层之一，负责**网络形成、设备发现、路由、地址分配和网络维护**。位于 IEEE 802.15.4 MAC 层之上，APS 层之下。

## 核心实体

| 实体 | 全称 | 职责 |
|------|------|------|
| NLDE | Network Layer Data Entity | 数据传输服务 |
| NLME | Network Layer Management Entity | 网络管理服务 |

> 层间通过 SAP (Service Access Point) 暴露服务原语。

## 关键机制

### Network Discovery & Formation
- **Network Formation**: Coordinator 创建 PAN
- **Network Discovery**: 设备扫描信道发现可用网络
- **Network Join**: 设备通过 MAC Association 加入网络
- **NWK Information in MAC Beacons**: MAC Beacon 中携带 NWK 层信息

### Network Maintenance
- **Network Status Command**: 报告网络状态变更
- **Network Report Command**: 网络报告
- **Network Update Command**: 网络参数更新通知
- **Child Keepalive**: 子节点保活 (MAC Data Poll Method)
- **Aging out Children**: 超时子节点自动移除

### Routing
- 基于 AODV (Ad-hoc On-demand Distance Vector) 的多跳路由
- 支持 Mesh 拓扑中的路径发现和维护
- Sub GHz 路由增强（R22 新增）

### Broadcast
- Broadcast Transaction Message Sequence Chart
- 网络级广播传输
- 休眠/低功耗邻居的广播递送需要结合 `macRxOnWhenIdle`、父节点转发和间接传输理解，见 [[concepts/sleepy-end-device-broadcast]]

## 与 MAC 的交互

- **PSDU**: 通用 MAC 帧的 PSDU 格式
- **MAC Data Poll**: 子节点轮询父节点数据
- **Multiple MAC Interfaces**: 支持多 MAC 接口
- **Poll Control Cluster**: ZCL 层 check-in/fast poll 配置机制，不等同于 MAC Data Poll，见 [[concepts/sleepy-end-device-broadcast]]

## 交叉引用

- [[entities/spec-zigbee-r22]]
- [[concepts/zigbee-security-model]]
- [[concepts/zdo-device-discovery]]
- [[concepts/network-steering]]
