---
title: "Zigbee Binding (ZDO 绑定管理)"
type: concept
sources:
  - raw/specs/docs-05-3474-22-0csg-zigbee-specification-1.pdf
  - raw/specs/docs-13-0402-13-00zi-Base-Device-Behavior-Specification.pdf
tags: [zigbee, binding, zdo, commissioning]
created: 2026-05-01
updated: 2026-05-01
---

# Zigbee Binding (ZDO 绑定管理)

## 概述

Binding 是 Zigbee 设备间建立**应用层关联**的机制。通过绑定，源设备的输出 Cluster 与目标设备的输入 Cluster 建立映射，实现无需地址的自动通信。

## 绑定层次

```
BDB Commissioning 绑定 (用户触发)
  └─ Finding & Binding     (Identify-based 自动绑定)
  └─ Touchlink             (近距离自动绑定)
  └─ EZ-Mode               (简单模式)

ZDO 级绑定 (协议层)
  └─ End_Device_Bind_req   (终端设备绑定)
  └─ Bind_req / Unbind_req (手动绑定)
  └─ Bind_Register_req     (绑定注册)
  └─ Replace_Device_req    (设备替换)
```

## R22 绑定命令集

### 核心绑定操作

| 命令 | 功能 |
|------|------|
| End_Device_Bind_req | 终端设备绑定请求 — 通过 Identify 触发 |
| Bind_req | 手动创建绑定 |
| Unbind_req | 手动解除绑定 |
| Bind_Register_req | 注册绑定条目 |
| Replace_Device_req | 替换设备并保留绑定 |

### 备份绑定操作

| 命令 | 功能 |
|------|------|
| Store_Bkup_Bind_Entry_req | 存储单个绑定备份 |
| Remove_Bkup_Bind_Entry_req | 移除单个绑定备份 |
| Backup_Bind_Table_req | 备份整个绑定表 |
| Recover_Bind_Table_req | 恢复整个绑定表 |
| Backup_Source_Bind_req | 备份源绑定 |
| Recover_Source_Bind_req | 恢复源绑定 |

## 绑定存储位置

绑定表存储在设备本地（通常是 Primary Binding Table Cache），可以通过备份/恢复命令在主备设备间同步。

## BDB vs ZDO 绑定

| 层面 | BDB | ZDO |
|------|-----|-----|
| 层级 | 应用层流程 | 协议层命令 |
| 触发 | 用户操作/自动 | 程序调用 |
| 依赖 | Finding & Binding / Touchlink | 直接地址或 Identify |

## 交叉引用

- [[concepts/zdo-device-discovery]]
- [[concepts/finding-binding]]
- [[concepts/bdb-commissioning]]
- [[entities/spec-zigbee-r22]]
