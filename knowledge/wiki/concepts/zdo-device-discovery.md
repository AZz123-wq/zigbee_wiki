---
title: "ZDO Device Discovery & Management"
type: concept
sources:
  - raw/specs/docs-05-3474-22-0csg-zigbee-specification-1.pdf
tags: [zigbee, zdo, device-discovery, cache, binding]
created: 2026-05-01
updated: 2026-05-01
---

# ZDO Device Discovery & Management

## 概述

ZDO (ZigBee Device Objects) 是 ZigBee 协议栈中负责**设备发现、描述符管理、缓存和绑定**的组件。R22 中定义了 30+ 种 ZDO 命令，构成了设备互操作的核心基础。R23 中部分 ZDO 功能被废弃。

## 命令分类

### 1. Device Discovery（设备发现）

| 命令 | 功能 | R23 状态 |
|------|------|---------|
| Complex_Desc_req | 请求复杂描述符 | ⚠️ 移除 |
| User_Desc_req | 请求用户描述符 | ⚠️ 移除 |
| Device_annce | 设备广播通知 | ✅ 保留 |
| Discovery_Cache_req | 请求发现缓存 | ⚠️ 废弃 |
| System_Server_Discovery_req | 系统服务器发现 | ⚠️ 废弃 |
| Extended_Simple_Desc_req | 扩展简单描述符请求 | ⚠️ 废弃 |
| Extended_Active_EP_req | 扩展活跃端点请求 | ⚠️ 废弃 |

### 2. Cache Management（缓存管理）

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

### 3. Binding（绑定管理）

| 命令 | 功能 | 说明 |
|------|------|------|
| End_Device_Bind_req | 终端设备绑定请求 | End Device Bind |
| Bind_req / Unbind_req | 绑定/解绑请求 | 手动绑定 |
| Bind_Register_req | 绑定注册请求 | — |
| Replace_Device_req | 设备替换请求 | — |
| Store_Bkup_Bind_Entry_req | 存储备份绑定条目 | 备份 |
| Remove_Bkup_Bind_Entry_req | 移除备份绑定条目 | 备份 |
| Backup_Bind_Table_req | 备份绑定表 | 备份 |
| Recover_Bind_Table_req | 恢复绑定表 | 恢复 |
| Backup_Source_Bind_req | 备份源绑定 | 备份 |
| Recover_Source_Bind_req | 恢复源绑定 | 恢复 |

### 4. Device Profile (ZDP)

| 命令 | 功能 |
|------|------|
| ChildInfo Structure | 子节点信息结构 |

## R22 → R23 变迁

R23 移除了 `User_Desc_req`、`Complex_Desc_req`、Discovery Cache 系列命令，简化了 ZDO 协议。

## 交叉引用

- [[entities/spec-zigbee-r22]]
- [[entities/spec-zigbee-r23]]
- [[concepts/zigbee-binding]]
- [[concepts/zigbee-nwk-layer]]
- [[comparisons/zigbee-r22-vs-r23]]
