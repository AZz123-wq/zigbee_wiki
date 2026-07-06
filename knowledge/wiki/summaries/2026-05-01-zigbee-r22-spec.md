---
title: "Zigbee Specification R22 (Revision 22) — 详细摘要"
type: summary
sources:
  - raw/specs/docs-05-3474-22-0csg-zigbee-specification-1.pdf
tags: [zigbee, r22, core-spec, phy, mac, nwk, aps, zdo, security, green-power]
created: 2026-05-01
updated: 2026-05-08
---

# Zigbee Specification R22 (Revision 22) — 详细摘要

## 文档信息

- **文档编号**: ZigBee Document 05-3474-22
- **标题**: Zigbee Specification, Revision 22, Version 1.0
- **发布日期**: April 19, 2017
- **赞助方**: Zigbee Alliance
- **页数**: 599 页 (pdfinfo, 7.2MB)
- **关键词**: ZigBee Stack, Network, Application, Profile, Framework, Device, Binding, Security

## PDF 读取检查

- **页数基准**: pdfinfo=599, structural=599, pdf_extract=38, 采用 599 页。
- **页级连贯性**: `runtime/data/source-page-index.json` 覆盖 599 页，页码 1..599 连续，无缺页。
- **文本质量抽样**: sampled_pages=5, sample_chars=4945, garbled_ratio=0.002, extraction_errors=0, quality_score=1。
- **结论**: Poppler/pdfinfo 与结构页数一致，正文可连续检索；旧 fallback 只识别 38 页，旧摘要中的“38 页”是 fallback 误读，不应用作引用基准。

## 概述

Zigbee R22 是 2017 年发布的核心协议规范。定义了从 PHY/MAC 到应用层的完整 ZigBee 协议栈架构。该版本首次引入 Sub GHz FSK PHY/MAC 支持和 Green Power 设备框架。

## R22 vs R21 新增/变更

| 变更 | 说明 |
|------|------|
| **Sub GHz FSK PHY/MAC** | 新增 Sub GHz 频段物理层和 MAC 支持 |
| **Removal of High Security** | 移除 High Security 级别 |
| **R21 Errata 集成** | R21 已知勘误修复和关键 CCB 集成 |
| **Green Power** | 引入 Green Power 设备帧格式和 Inter-PAN 通信 |

---

## 协议栈架构

```
┌─────────────────────────────┐
│     Application Layer       │
│  ┌───────┐ ┌──────┐ ┌─────┐ │
│  │  APS  │ │ ZDO  │ │ AF  │ │
│  │       │ │(ZDP) │ │     │ │
│  └───────┘ └──────┘ └─────┘ │
├─────────────────────────────┤
│     Network Layer (NWK)     │
├─────────────────────────────┤
│  IEEE 802.15.4 MAC Layer    │
├─────────────────────────────┤
│  IEEE 802.15.4 PHY Layer    │
│   (2.4GHz + Sub GHz FSK)    │
└─────────────────────────────┘
```

> 每一层提供**数据实体**（数据传输）和**管理实体**（服务管理）。层间通过 SAP (Service Access Point) 交互，SAP 支持一组服务原语。

---

## 一、IEEE 802.15.4 PHY/MAC 层

R22 集成了 IEEE 802.15.4-2011 定义的 PHY 和 MAC 层：

### PHY 层
- **2.4 GHz**: O-QPSK 调制，250 kbps，16 个信道 (11-26)
- **Sub GHz FSK** (R22 新增): FSK 调制，多区域频段支持

### MAC 层
- PSDU (PHY Service Data Unit) 帧格式
- MAC Data Poll 子层机制
- Child Keepalive: MAC Data Poll Method
- Aging out Children: MAC Data Poll 方法

---

## 二、Network Layer (NWK)

### 核心功能
| 功能 | 说明 |
|------|------|
| NLDE | Network Layer Data Entity — 数据传输 |
| NLME | Network Layer Management Entity — 网络管理 |
| Network Status | 网络状态命令 |
| Network Report | 网络报告命令 |
| Network Update | 网络更新命令 |
| Network Discovery | 网络发现与维护 |

### 关键机制
- **NWK Beacons**: MAC Beacon 中包含 NWK 层信息
- **Multiple MAC Interfaces**: 支持多 MAC 接口
- **Child Keepalive**: 子节点保活 (MAC Data Poll)
- **Aging out Children**: 子节点超时老化
- **Routing**: 多跳路由发现和维护
- **Broadcast**: 广播交易消息序列

---

## 三、Application Layer

### 3.1 APS (Application Support Sub-layer)

ZigBee 应用支持子层，提供：
- **General APS Frame Format**: 通用帧格式定义
- **Frame Control Field**: 4 字节帧控制
- **Extended Header**: 扩展头部子层
- **Extended Frame Control**: 扩展帧控制
- **Data Frame Format**: 数据帧格式
- **Inter-PAN**: Inter-PAN 的 Stub NWK Header + APS Header

### 3.2 ZDO (ZigBee Device Objects)

ZDO 定义设备管理服务，**是 R22 的核心组件**：

#### Device Discovery 命令
| 命令 | 功能 |
|------|------|
| Complex_Desc_req | 请求复杂描述符 |
| User_Desc_req | 请求用户描述符 |
| Device_annce | 设备广播通知 |
| Discovery_Cache_req | 请求发现缓存 |
| System_Server_Discovery_req | 系统服务器发现 |
| Extended_Simple_Desc_req | 扩展简单描述符请求 |
| Extended_Active_EP_req | 扩展活跃端点请求 |

#### Cache Management 命令
| 命令 | 功能 |
|------|------|
| Discovery_store_req | 存储发现信息 |
| Node_Desc_store_req | 存储节点描述符 |
| Power_Desc_store_req | 存储电源描述符 |
| Active_EP_store_req | 存储活跃端点 |
| Simple_Desc_store_req | 存储简单描述符 |
| Remove_node_cache_req | 移除节点缓存 |
| Find_node_cache_req | 查找节点缓存 |
| User_Desc_set | 设置用户描述符 |

#### Binding 命令
| 命令 | 功能 |
|------|------|
| End_Device_Bind_req | 终端设备绑定请求 |
| Bind_req / Unbind_req | 绑定/解绑请求 |
| Bind_Register_req | 绑定注册请求 |
| Replace_Device_req | 设备替换请求 |
| Store_Bkup_Bind_Entry_req | 存储绑定条目备份 |
| Remove_Bkup_Bind_Entry_req | 移除绑定条目备份 |
| Backup_Bind_Table_req | 备份绑定表 |
| Recover_Bind_Table_req | 恢复绑定表 |
| Backup_Source_Bind_req | 备份源绑定 |
| Recover_Source_Bind_req | 恢复源绑定 |

#### Device Profile (ZDP)
- `ChildInfo` 结构格式定义
- 设备端点和服务管理

---

## 四、Security Services

R22 安全基于 **CCM\*** 模式和对称密钥体系：

### 安全架构

| 层级 | 安全范围 |
|------|---------|
| NWK Level | 网络层帧加密（Network Key） |
| APS Level | 应用层帧加密（Link Key） |

### 密钥体系

| 密钥类型 | 用途 | 传输方式 |
|---------|------|---------|
| Network Key | 网络层组播/广播加密 | Network Key Transport |
| Trust Center Link Key | TC ↔ 设备单播 | Trust Center Link Key Transport |
| Application Link Key | 应用间单播 | Application Link Key Transport |

### 安全构建块

| 构建块 | 说明 |
|--------|------|
| Authentication Checking Transformation | 认证检查变换 |
| Cryptographic Hash Function | 密码学哈希函数 |
| Keyed Hash Function for MAC | 带密钥的消息认证码哈希 |
| Challenge Domain Parameters | 挑战-应答域参数 |
| Key Authenticated Key Agreement | 密钥认证的密钥协商 |
| Key Entity Authentication | 密钥实体认证 |

### 安全帧格式

| 帧元素 | 说明 |
|--------|------|
| Secured NWK Layer Frame | 加密的 NWK 帧格式 |
| Secured APS Layer Frame | 加密的 APS 帧格式 |
| Auxiliary Frame Header | 辅助安全帧头 |
| Security Control Field | 安全控制字段 |

### 安全流程

| 流程 | 说明 |
|------|------|
| Joining a Secured Network | 加入安全网络流程 |
| Trust Center Rejoin | Trust Center 重加入 |
| Network Key Req → Transport | 网络密钥分发 |
| End Application Key Establishment | 终端应用密钥建立 |

---

## 五、Green Power (R22 新增)

| 特性 | 说明 |
|------|------|
| Green Power Device Frame | GP 设备帧格式 |
| Stub NWK Header for Inter-PAN | Inter-PAN 桩网络头 |
| Inter-PAN APS Header | Inter-PAN APS 头 |

---

## 六、附录内容

| 附录 | 说明 |
|------|------|
| Frame Format Overview | ZigBee 帧格式总览 |
| PSDU Format | 通用 MAC 帧 PSDU |
| MAC Command Frame | MAC 命令帧格式 |
| Key Command Frame | 密钥命令帧 |
| Tunnel Command Frame | 隧道命令帧 |
| Power Control Info Table | 功率控制信息表 |
| Rejoin IE Content Field | 重加入 IE 内容字段 |

---

## 关键要点

1. **R22 是 2017 年版本**，核心协议栈分为 PHY → MAC (802.15.4) → NWK → APS → ZDO/AF 五层
2. **ZDO 是协议核心**，提供设备发现、缓存管理、绑定管理等 30+ 种命令服务
3. **安全分层**：NWK 级使用 Network Key，APS 级使用 Link Key；支持 Trust Center 密钥分发
4. **Sub GHz FSK** 和 **Green Power** 是本版本主要新增特性
5. R22 的 ZDO 命令集（Complex_Desc, User_Desc, Discovery_Cache 等）在 R23 中被大量废弃
6. 安全模型基于对称密码学（CCM*），R23 中升级为 Curve25519

## 与 R23 的关系

见 [[comparisons/zigbee-r22-vs-r23]] — R22 的 ZDO 命令集、安全机制在 R23 中经历重大变化。

## 交叉引用

- [[entities/spec-zigbee-r22]]
- [[entities/spec-zigbee-r23]]
- [[concepts/zdo-device-discovery]]
- [[concepts/zigbee-security-model]]
- [[concepts/zigbee-nwk-layer]]
- [[concepts/zigbee-binding]]
- [[concepts/green-power]]
- [[comparisons/zigbee-r22-vs-r23]]

## 待深入

- [ ] IEEE 802.15.4 PHY 各频段参数对比表
- [ ] NWK Routing 算法细节 (AODV-based)
- [ ] APS 安全与 NWK 安全的协作关系
- [ ] Green Power Sink/Proxy 角色定义
