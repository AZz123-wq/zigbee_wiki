---
title: "Zigbee R22 vs R23 对比"
type: comparison
sources:
  - raw/specs/docs-05-3474-22-0csg-zigbee-specification-1.pdf
  - raw/specs/docs-05-3474-23-csg-zigbee-specificationR23.1.pdf
tags: [zigbee, r22, r23, comparison, core-spec]
created: 2026-05-01
updated: 2026-05-01
---

# Zigbee R22 vs R23 对比

## 基本信息

| 属性 | R22 | R23 | 变化 |
|------|-----|-----|------|
| 文档编号 | 05-3474-22 | 05-3474-23 | +1 |
| 页数 | 38 | 40 | +2 |
| 文件大小 | 7.2MB | 11MB | +3.8MB |
| 发布日期 | 2017-03-20 | 2024 | +7年 |
| 出版方 | Zigbee Alliance | CSA | 更名 |
| 发布间隔 | — | 7年 | R23 开发周期约 6 年 |

## 关键差异

### 安全 (Security)
| 特性 | R22 | R23 |
|------|-----|-----|
| Link Key 类型 | 静态 Link Key | Dynamic Link Key (NFR) 支持 |
| 密码学 | 传统 ECC | Curve25519 椭圆曲线 |
| Install Code | ✅ | ✅ (保留) |

### 低功耗 (Low Power)
| 特性 | R22 | R23 |
|------|-----|-----|
| CSL | ❌ | ✅ Coordinated Sampled Listening |

### 协议精简 (Protocol Simplification)
| 特性 | R22 | R23 |
|------|-----|-----|
| ZDO | ✅ 完整 | ⚠️ 逐步废弃 |
| User Descriptor | ✅ | ❌ 移除 |
| Complex Descriptor | ✅ | ❌ 移除 |
| Allocated Address Bit | 旧规则 | 更新规则 |

### PHY/MAC
| 特性 | R22 | R23 |
|------|-----|-----|
| Sub GHz FSK | ✅ (首次引入) | ✅ (增强) |
| Sub GHz 路由 | ❌ | ✅ |
| WWAH | ❌ | ✅ 集成 |

## 结论

R23 是 R22 发布 7 年后的重大更新，主要方向：
1. 安全向现代密码学演进 (Curve25519 + Dynamic Link Key)
2. 低功耗深度优化 (CSL)
3. 协议栈精简 (ZDO 废弃、描述符移除)
4. Sub GHz 完整路由支持
5. CSA 更名和 WWAH 生态集成

## 交叉引用

- [[entities/spec-zigbee-r22]]
- [[entities/spec-zigbee-r23]]
- [[summaries/2026-05-01-zigbee-r23-spec]]
- [[concepts/bdb-security]]
