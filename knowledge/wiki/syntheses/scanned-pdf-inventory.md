---
title: "PDF 读取质量盘点 — fallback 页数风险"
type: synthesis
sources:
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
  - raw/specs/07-5123-08-Zigbee-Cluster-Library-1.pdf
  - raw/specs/16-02828-012-PRO-BDB-v3.0.1-Specification.pdf
  - raw/specs/20-27688-037-zigbee_direct_spec.pdf
  - raw/specs/23-80986-013-PSWG-1.0-Specification-18-March-2024.pdf
  - raw/specs/docs-05-3474-22-0csg-zigbee-specification-1.pdf
  - raw/specs/docs-05-3474-23-csg-zigbee-specificationR23.1.pdf
  - raw/test-specs/HA-profile-test-Spec.pdf
  - raw/test-specs/docs-07-5035-08-0zqg-zigbee-pro-compliant-platform-test-specification.pdf
  - raw/test-specs/docs-14-0332-01-tech-zigbee-ieee-.pdf
  - raw/test-specs/docs-14-0439-22-pfnd-zi-bdb-test-specification.pdf
tags: [meta, pdf-quality, ingest, fallback-risk]
created: 2026-05-01
updated: 2026-05-08
---

# PDF 读取质量盘点 — fallback 页数风险

## 概述

2026-05-08 复查后，早期“扫描版/需 OCR”的判断不再成立：这些 PDF 可以通过 Poppler `pdfinfo`/`pdftotext` 和 `runtime/data/source-page-index.json` 提取连续文本。真正的问题是旧 `/root/pdf_extract.py` fallback 对部分大 PDF 严重少计页数，导致旧摘要中出现 38p、40p、834p、894p 等错误页数。

## 正文

| 文件 | pdfinfo 页数 | fallback 页数 | source-page-index | 读取结论 |
|------|--------------|---------------|-------------------|----------|
| `07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf` | 929 | 894 | 929 页连续，6 个近空页 | 可提取；以 pdfinfo/source-page-index 为准 |
| `07-5123-08-Zigbee-Cluster-Library-1.pdf` | 1213 | 834 | 1213 页连续，9 个近空页 | 可提取；旧 834p 是 fallback 误读 |
| `16-02828-012-PRO-BDB-v3.0.1-Specification.pdf` | 86 | 42 | 86 页连续 | 可提取；需版本关系深挖 |
| `20-27688-037-zigbee_direct_spec.pdf` | 187 | 16 | 187 页连续 | 可提取；需 Zigbee Direct 深挖 |
| `23-80986-013-PSWG-1.0-Specification-18-March-2024.pdf` | 32 | 1 | 32 页连续 | 可提取；偏产品安全规范 |
| `docs-05-3474-22-0csg-zigbee-specification-1.pdf` | 599 | 38 | 599 页连续 | 可提取；旧 R22 38p 是 fallback 误读 |
| `docs-05-3474-23-csg-zigbee-specificationR23.1.pdf` | 649 | 40 | 649 页连续 | 可提取；旧 R23 40p 是 fallback 误读 |
| `HA-profile-test-Spec.pdf` | 330 | 21 | 330 页连续，p.4 近空，乱码率 0.067 | 可提取但需人工复核样本文本 |
| `docs-07-5035-08-0zqg-zigbee-pro-compliant-platform-test-specification.pdf` | 490 | 78 | 490 页连续 | 可提取；平台测试规范 |
| `docs-14-0332-01-tech-zigbee-ieee-.pdf` | 220 | 81 | 220 页连续，存在近空页 | 可提取；802.15.4 测试规范 |
| `docs-14-0439-22-pfnd-zi-bdb-test-specification.pdf` | 508 | 29 | 508 页连续 | 可提取；BDB 测试规范 |

## 关键要点

1. 后续 PDF 页码引用必须以 `pdfinfo`、`runtime/data/source-page-index.json` 和分段 `pdftotext`/`pdfSafeReader` 为准。
2. 旧 fallback extractor 仍可用于快速检查，但遇到页数 mismatch 时不能作为完整 ingest 依据。
3. 大 PDF 仍应遵守安全读取限制：每次最多 5 页，分阶段深读，不把全文塞入上下文。
4. “PDF 可提取”只代表资料处理可行，不代表条款已经逐条审核；具体规范/测试要求仍需按页深挖。

## 交叉引用

- [[summaries/2026-05-08-zcl-rev7]]
- [[summaries/2026-05-01-zcl-rev8]]
- [[summaries/2026-05-01-zigbee-r22-spec]]
- [[summaries/2026-05-01-zigbee-r23-spec]]
- [[summaries/2026-05-08-pro-bdb-v3-0-1-specification]]
- [[summaries/2026-05-08-zigbee-direct-spec]]
- [[summaries/2026-05-08-iot-device-security-spec-v1]]
- [[summaries/2026-05-08-ha-profile-test-spec]]
- [[summaries/2026-05-08-zigbee-pro-compliant-platform-test-spec]]
- [[summaries/2026-05-08-zigbee-ieee-802-15-4-test-spec]]
- [[summaries/2026-05-08-bdb-test-specification]]

## 待深入

- [ ] 对 fallback mismatch 的根因做脚本层面修复或降级提示。
- [ ] 为 DOCX/PPTX 建立类似 PDF 的文本索引和引用定位方式。
