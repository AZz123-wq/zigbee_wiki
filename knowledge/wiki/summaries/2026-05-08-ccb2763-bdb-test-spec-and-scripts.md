---
title: "CCB #2763 Test House Notification — BDB Test Spec & Scripts 摘要"
type: summary
sources:
  - raw/other/18-02894-002-CCB2763-THN-BDB-Test-Spec-&-Scripts.docx
tags: [zigbee, ccb, bdb, test-house-notification, network-steering]
created: 2026-05-08
updated: 2026-05-08
status: draft
confidence: 0.75
---

# CCB #2763 Test House Notification — BDB Test Spec & Scripts 摘要

## 文档信息

- **来源文件**: `raw/other/18-02894-002-CCB2763-THN-BDB-Test-Spec-&-Scripts.docx`
- **类型/大小**: docx / 1.5MB
- **SHA-256**: `05a5e10b08190024...`

## 读取检查

- **格式**: DOCX，未进入 PDF 页级索引。
- **抽取方式**: 通过 OOXML `word/document.xml` 只读抽取正文段落；source-index 当前只记录文件 hash，未实现 DOCX 全文索引。
- **结论**: 本页摘要基于可提取 DOCX 文本；如需逐段检索，应后续建立 DOCX 文本索引。

## 概述

该 DOCX 是针对 urgent CCB #2763 的 Test House Notification，涉及 BDB Test Specification 和关联脚本。

## 正文

- 主题是 CN-NST-TC-01B 中 DUT 的 allowRemoteTcPolicyChange=FALSE 时行为如何处理。
- 决议澄清 Trust Center 接收广播 Mgmt_Permit_Join_req 后的 permit duration 和网络关闭行为，并要求更新 BDB test specification 与 CN-NST-TC-01B 脚本。
- 这是测试规范/脚本修订通知，不是核心协议规范正文。

## 关键要点

- 本页是文档级 ingest，用于建立来源覆盖、读取质量和后续深挖入口。
- PDF/OOXML 读取结论属于资料处理观察，不等同于 Zigbee 协议或测试规范要求。
- 具体条款、属性、命令或测试步骤需要后续按页分段深读后再写入实体/概念页。

## 交叉引用

- [[summaries/2026-05-08-bdb-test-specification]]
- [[concepts/network-steering]]
- [[concepts/bdb-security]]
- [[index]]

## 待深入

- [ ] 按章节抽取关键测试项或规范条款。
- [ ] 将长期复用的结论沉淀到对应 entity/concept/synthesis 页面。
