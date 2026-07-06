---
title: "Sleepy End Device and Broadcast Delivery"
type: concept
sources:
  - raw/specs/docs-05-3474-22-0csg-zigbee-specification-1.pdf
  - raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf
  - raw/specs/07-5123-08-Zigbee-Cluster-Library-1.pdf
  - raw/test-specs/17-02841-001-0x0020-Poll-Control-Cluster-Test-Specification.pdf
tags: [zigbee, sleepy-end-device, broadcast, mac-data-poll, poll-control, rx-on-when-idle]
created: 2026-05-08
updated: 2026-05-10
status: draft
confidence: 0.85
---

# Sleepy End Device and Broadcast Delivery

## 概述

Zigbee 的休眠终端设备（Sleepy End Device，通常表现为 `macRxOnWhenIdle = FALSE`）不能像常开接收设备一样长期监听空口广播。R22 核心规范在 NWK broadcast 过程中把这类设备作为特殊路径处理：广播在 NWK 层仍是 broadcast transaction，但到低功耗邻居时，父节点/路由器可把面向这些邻居的转发改成逐个 MAC unicast，并可使用 IEEE 802.15.4 间接传输保障这些 unicast 到达。

因此，“休眠设备如何处理广播消息”的答案不是“休眠设备直接接收所有广播”。更准确地说：

- RxOnWhenIdle 为 TRUE 的终端可参与常规广播接收记录。
- RxOnWhenIdle 为 FALSE 的低功耗邻居依赖父节点/路由器的特殊转发和间接传输窗口。
- end device 自己发起 broadcast 时，R22 规定 MAC 目的地址设置为其父节点的 16-bit network address，由父节点继续参与 NWK 广播扩散。

## 正文

### NWK broadcast 的基础行为

R22 的 broadcast 章节列出 broadcast address 与 destination group，包括 `0xfffd` 表示 `macRxOnWhenIdle = TRUE`，`0xfffc` 表示所有 routers 和 coordinator，`0xffff` 表示 all devices（见 `raw/specs/docs-05-3474-22-0csg-zigbee-specification-1.pdf p.408` 附近）。

对 router/coordinator，NWK 层发送 broadcast MSDU 时向 MAC 层发 `MCPS-DATA.request`，MAC 目的地址为 `0xffff`。对 Zigbee end device，broadcast frame 的 MAC 目的地址设置为其父节点的 16-bit network address，而不是直接在 MAC 层向全网广播（R22 p.408）。

R22 还要求 coordinator、router，以及 `macRxOnWhenIdle = TRUE` 的 end device 记录新的 broadcast transaction，记录至少包含源地址和 sequence number，保存在 broadcast transaction table 中，用于去重和 passive acknowledgement（R22 p.408-p.409）。

### 对休眠/低功耗邻居的特殊转发

R22 对 `macRxOnWhenIdle = FALSE` 的 router/邻居描述了特殊处理：当这样的 router 收到 broadcast transmission 时，不按普通广播重传流程，而是对每个邻居逐个用 MAC layer unicast 转发。类似地，如果一个 RxOn router/coordinator 有一个或多个 `macRxOnWhenIdle = FALSE` 邻居，在目的地址为 `0xffff` 的 all devices 广播场景下，也要把该 broadcast frame 逐个以 MAC unicast 转发给这些邻居，并且仍执行普通广播流程（R22 p.410）。

规范还说明可使用 IEEE 802.15.4 的 indirect transmission 来确保这些 unicast 到达目的端；每个 Zigbee router 至少要能在 NWK 层缓冲 1 个 frame，以便支持 broadcast retransmission（R22 p.410）。

### MAC Data Poll 与父子缓冲

MAC Data Poll 是 end device 与父节点之间的底层轮询/保活机制。R22 在 End Device Keepalive 中说明，end device 发送 MAC Data Poll command 时，可以假设父节点仍知道该 end device，并且父节点 neighbor table 中与该 end device 关联的 timeout counter 已被重置（R22 p.419）。

如果父节点支持 MAC Data Poll Keepalive，child 在看到 MAC acknowledgement 的 data pending bit 未置位时，可以认为父节点仍记得该设备（R22 p.421）。如果父节点已 aging out child，父节点可通过 MAC acknowledgement 的 data pending bit 指示有 pending message，然后发送带 rejoin bit 的 leave message，触发设备离网并 rejoin（R22 p.423）。

这说明 MAC Data Poll 主要是父子关系、间接数据和保活路径；它不是 NWK broadcast transaction 本身，但对休眠设备接收父节点缓冲的间接单播很关键。

### Poll Control cluster 不等于 MAC polling

Poll Control cluster 是 ZCL 层 cluster，cluster id `0x0020`。ZCL Rev 7 和 Rev 8 都描述它用于 end device 的 check-in、long poll interval、short poll interval、fast poll timeout 等应用层/cluster 层控制。Rev 7 精读窗口显示 server 位于 end device，client 可在 check-in 后把设备放入 short poll/fast poll 模式，使其在一段时间内更容易接收异步数据（`raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf p.255-p.258`）。

Long Poll Interval 表示 end device 向 parent 发 MAC Data Request 的最大间隔，但 Poll Control 本身是 ZCL cluster 交互，不是 NWK broadcast 或 MAC Data Poll 原语（`raw/specs/07-5123-08-Zigbee-Cluster-Library-1.pdf p.272-p.277`）。

对应测试规范 `raw/test-specs/17-02841-001-0x0020-Poll-Control-Cluster-Test-Specification.pdf` 覆盖的是 Poll Control cluster 的 certification 测试，例如 check-in response、fast poll stop、set long poll interval 等命令。测试要求不应直接当作核心 NWK/MAC 协议规则混写。

## 关键要点

- 休眠终端通常无法直接持续监听普通 MAC broadcast。
- R22 的 NWK broadcast 仍使用 broadcast transaction table、sequence/source 去重和 passive acknowledgement。
- 面向 `macRxOnWhenIdle = FALSE` 邻居时，router/coordinator 可逐个 MAC unicast 转发，并可使用 indirect transmission。
- End device 发起 broadcast 时，MAC 目的地址指向其 parent，由 parent 帮助进入网络广播流程。
- MAC Data Poll 是父子轮询/保活/间接数据机制；Poll Control cluster 是 ZCL 层配置和 check-in 机制，二者层级不同。

## 交叉引用

- [[concepts/zigbee-nwk-layer]]
- [[entities/spec-zigbee-r22]]
- [[entities/spec-zcl-rev7]]
- [[summaries/2026-05-01-zigbee-r22-spec]]
- [[entities/spec-zcl-rev8]]

## 待深入

- 对 R23/R23.1 中同一 broadcast/low-power delivery 机制做版本对比。
- 补充 IEEE 802.15.4 indirect transmission 的精确行为边界。
- 抽取 `nwkNetworkBroadcastDeliveryTime`、`nwkPassiveAckTimeout`、`nwkTransactionPersistenceTime` 等 NIB 属性的页码和相互关系。
