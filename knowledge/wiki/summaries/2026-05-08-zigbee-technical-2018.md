---
title: "Zigbee Technical 2018 Presentation — 摘要"
type: summary
sources:
  - raw/presentations/Zigbee Technical - 2018.pptx
tags: [zigbee, presentation, training, technical-overview]
created: 2026-05-08
updated: 2026-05-08
status: draft
confidence: 0.75
---

# Zigbee Technical 2018 Presentation — 摘要

## 文档信息

- **来源文件**: `raw/presentations/Zigbee Technical - 2018.pptx`
- **类型/大小**: pptx / 7.3MB
- **SHA-256**: `bd97b3950276ca1d...`

## 读取检查

- **格式**: PPTX，未进入 PDF 页级索引。
- **抽取方式**: 通过 OOXML `ppt/slides/slide*.xml` 只读抽取文字；确认 43 张幻灯片有可读文本。
- **结论**: 可作为培训/介绍材料 ingest；页码引用不适用，后续引用应使用 slide 序号或重新生成 slide 索引。

## 概述

Zigbee Technical 2018 是培训/介绍型 PPTX，概述 Zigbee Alliance、Zigbee mesh、Base Device Behavior、Green Power、设备类型和 Dotdot/ZCL 应用层演进。

## 正文

- PPTX 共 43 张幻灯片，可从 OOXML slide XML 提取文字。
- 前半部分介绍 Zigbee Alliance、开放 IoT 标准、mesh/低功耗/应用库；中段解释 BDB 的 commissioning、network security、joining、finding & binding；后段涉及 Green Power、设备 ID 和 Dotdot/ZCL 演进。
- 该资料适合做培训入口，不应替代正式规范或测试规范。

## 关键要点

- 本页是文档级 ingest，用于建立来源覆盖、读取质量和后续深挖入口。
- PDF/OOXML 读取结论属于资料处理观察，不等同于 Zigbee 协议或测试规范要求。
- 具体条款、属性、命令或测试步骤需要后续按页分段深读后再写入实体/概念页。

## 交叉引用

- [[concepts/bdb-commissioning]]
- [[concepts/finding-binding]]
- [[concepts/green-power]]
- [[entities/spec-zcl-rev8]]
- [[index]]

## 待深入

- [ ] 按章节抽取关键测试项或规范条款。
- [ ] 将长期复用的结论沉淀到对应 entity/concept/synthesis 页面。
