---
title: "CCB #2920 Test House Notification — BDB Test Scripts 摘要"
type: summary
sources:
  - raw/other/19-02814-001-CCB2920-THN-BDBTest-BDBScripts.docx
tags: [zigbee, ccb, bdb, test-house-notification, leave]
created: 2026-05-08
updated: 2026-05-08
status: draft
confidence: 0.75
---

# CCB #2920 Test House Notification — BDB Test Scripts 摘要

## 文档信息

- **来源文件**: `raw/other/19-02814-001-CCB2920-THN-BDBTest-BDBScripts.docx`
- **类型/大小**: docx / 1.4MB
- **SHA-256**: `f488ac50087836e2...`

## 读取检查

- **格式**: DOCX，未进入 PDF 页级索引。
- **抽取方式**: 通过 OOXML `word/document.xml` 只读抽取正文段落；source-index 当前只记录文件 hash，未实现 DOCX 全文索引。
- **结论**: 本页摘要基于可提取 DOCX 文本；如需逐段检索，应后续建立 DOCX 文本索引。

## 概述

该 DOCX 是针对 urgent CCB #2920 的 Test House Notification，涉及 BDB test specification 和 DR-TAR 系列测试脚本。

## 正文

- 主题是 DR-TAR-TC-03A 步骤 5 与 CCB 2047/R22 errata 的关系，特别是 NWK Leave command 的 Remove children 字段。
- 决议要求修改 DR-TAR-TC-03A、DR-TAR-TC-03B、DR-TAR-TC-05A、DR-TAR-TC-05B 的测试步骤/验证与脚本，使 Remove children = 0b0。
- 这是测试脚本和测试规范勘误通知，应作为 BDB 测试执行依据之一。

## 关键要点

- 本页是文档级 ingest，用于建立来源覆盖、读取质量和后续深挖入口。
- PDF/OOXML 读取结论属于资料处理观察，不等同于 Zigbee 协议或测试规范要求。
- 具体条款、属性、命令或测试步骤需要后续按页分段深读后再写入实体/概念页。

## 交叉引用

- [[summaries/2026-05-08-bdb-test-specification]]
- [[concepts/zigbee-nwk-layer]]
- [[index]]

## 待深入

- [ ] 按章节抽取关键测试项或规范条款。
- [ ] 将长期复用的结论沉淀到对应 entity/concept/synthesis 页面。
