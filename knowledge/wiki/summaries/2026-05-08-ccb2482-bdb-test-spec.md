---
title: "CCB #2482 Test House Notification — Base Device Behavior 摘要"
type: summary
sources:
  - raw/other/18-02894-002-CCB2763-THN-BDB-Test-Spec.docx
tags: [zigbee, ccb, bdb, test-house-notification, network-steering]
created: 2026-05-08
updated: 2026-05-08
status: draft
confidence: 0.75
---

# CCB #2482 Test House Notification — Base Device Behavior 摘要

## 文档信息

- **来源文件**: `raw/other/18-02894-002-CCB2763-THN-BDB-Test-Spec.docx`
- **类型/大小**: docx / 1.5MB
- **SHA-256**: `8c597846d1b45e5d...`

## 读取检查

- **格式**: DOCX，未进入 PDF 页级索引。
- **抽取方式**: 通过 OOXML `word/document.xml` 只读抽取正文段落；source-index 当前只记录文件 hash，未实现 DOCX 全文索引。
- **结论**: 本页摘要基于可提取 DOCX 文本；如需逐段检索，应后续建立 DOCX 文本索引。

## 概述

该 DOCX 是针对 urgent CCB #2482 的 Test House Notification，涉及 Base Device Behavior 规范、PICS、BDB Test Specification 和多个测试脚本。

## 正文

- 主题是部分设备可能只能在上电且 factory-new 时激活 network steering。
- 决议要求澄清 network steering 对 routers/end devices/coordinator 的 mandatory/optional 条件，并引入有限/无用户界面的 PICS 条件。
- 影响 DN-DNS-TC-04、DN-MIX-TC-01C、CN-NST-TC-05、FB-PRE-TC-02、FB-INI-TC-07B 等测试用例。

## 关键要点

- 本页是文档级 ingest，用于建立来源覆盖、读取质量和后续深挖入口。
- PDF/OOXML 读取结论属于资料处理观察，不等同于 Zigbee 协议或测试规范要求。
- 具体条款、属性、命令或测试步骤需要后续按页分段深读后再写入实体/概念页。

## 交叉引用

- [[summaries/2026-05-01-base-device-behavior-spec-v1]]
- [[summaries/2026-05-08-bdb-test-specification]]
- [[concepts/network-steering]]
- [[index]]

## 待深入

- [ ] 按章节抽取关键测试项或规范条款。
- [ ] 将长期复用的结论沉淀到对应 entity/concept/synthesis 页面。
