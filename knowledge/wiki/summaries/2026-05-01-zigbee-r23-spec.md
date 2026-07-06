---
title: "Zigbee Specification R23 — 摘要"
type: summary
sources:
  - raw/specs/docs-05-3474-23-csg-zigbee-specificationR23.1.pdf
tags: [zigbee, r23, core-spec, csa]
created: 2026-05-01
updated: 2026-05-08
---

# Zigbee Specification R23 — 摘要

## 文档信息

- **文档编号**: 05-3474-23
- **出版社**: Connectivity Standards Alliance (CSA, 原 Zigbee Alliance)
- **日期**: 2024
- **页数**: 649 页 (pdfinfo, 10.7MB)
- **上一版本**: R22 (05-3474-22, 599p, 7.2MB)

## PDF 读取检查

- **页数基准**: pdfinfo=649, structural=649, pdf_extract=40, 采用 649 页。
- **页级连贯性**: `runtime/data/source-page-index.json` 覆盖 649 页，页码 1..649 连续，无缺页。
- **文本质量抽样**: sampled_pages=5, sample_chars=5384, garbled_ratio=0.002, extraction_errors=0, quality_score=1。
- **结论**: Poppler/pdfinfo 与结构页数一致，正文可连续检索；旧 fallback 只识别 40 页，不能作为完整页数引用。

## 概述

Zigbee R23 是 Connectivity Standards Alliance 发布的 Zigbee 协议栈核心规范最新版本。从 R22 演变而来，引入了多项重要变更。

## R22 → R23 关键变更（从 Revision History 提取）

| 变更类型 | 具体内容 | 影响 |
|---------|---------|------|
| **安全增强** | Dynamic Link Key (NFR) 支持 | Trust Center 安全性提升 |
| **密码学** | Curve25519 椭圆曲线引入 | 现代密码学支持 |
| **低功耗** | CSL (Coordinated Sampled Listening) | 低功耗设备改进 |
| **ZDO 废弃** | ZDO 功能逐步弃用 | 影响 ZDP 交互 |
| **描述符** | 移除 User Descriptor 和 Complex Descriptor | 简化设备描述 |
| **地址** | Allocated Address bit 使用更新 | 地址分配逻辑变更 |
| **路由** | 路由更新 + Sub Gig 路由 | 多频段路由支持 |
| **WWAH** | WWAH (Works With All Hubs) 集成 | 互操作性增强 |
| **出版方** | Zigbee Alliance → CSA | 组织更名 |

## 关键要点

1. **安全是现代密码学方向**: Curve25519 替代传统对称密钥机制
2. **低功耗优化**: CSL 为电池供电设备提供更好的功耗表现
3. **协议简化**: ZDO 废弃、描述符移除使协议更清洁
4. **Sub GHz 支持**: 新增 Sub GHz FSK PHY/MAC 支持
5. **CSA 更名**: 2019 年 Zigbee Alliance 更名为 Connectivity Standards Alliance

## 交叉引用

- [[entities/spec-zigbee-r23]]
- [[summaries/2026-05-01-zigbee-r22-spec]]
- [[comparisons/zigbee-r22-vs-r23]]
- [[concepts/bdb-security]]
- [[concepts/bdb-commissioning]]

## 待深入

- [ ] R23 主文档全文 TOC 提取
- [ ] CSL 详细工作机制
- [ ] Curve25519 在 BDB Commissioning 中的具体应用
