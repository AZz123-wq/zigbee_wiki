#!/usr/bin/env node
/**
 * Generate ZCL Rev 7 cluster entity pages from the page-level source index.
 *
 * The script is intentionally manifest-driven. Each cluster entry points to the
 * Rev 7 page window that was used for the per-cluster read, then the generated
 * page records the page range, extracted section signals, cross-links, and
 * follow-up items. Existing cluster pages are preserved.
 */
import * as fs from 'fs';
import * as path from 'path';

const ROOT_DIR = path.resolve(__dirname, '..', '..');
const WIKI_DIR = path.join(ROOT_DIR, 'knowledge', 'wiki');
const ENTITIES_DIR = path.join(WIKI_DIR, 'entities');
const DATA_DIR = path.join(ROOT_DIR, 'runtime', 'data');
const PAGE_INDEX = path.join(DATA_DIR, 'source-page-index.json');
const INDEX_MD = path.join(WIKI_DIR, 'index.md');

const SOURCE_PATH = 'specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf';
const SOURCE_REF = 'raw/specs/07-5123-07-ZigbeeClusterLibrary_Revision_7-1.pdf';
const ZCL_SUMMARY = 'summaries/2026-05-08-zcl-rev7';
const ZCL_SPEC = 'entities/spec-zcl-rev7';
const TODAY = '2026-05-10';
const PRESERVE_EXISTING_SLUGS = new Set(['on-off']);

type Range = {
  start: number;
  end: number;
  note?: string;
};

type TestRef = {
  source: string;
  summary: string;
  status: 'draft' | 'released' | 'duplicate';
};

type Cluster = {
  id: string;
  name: string;
  slug: string;
  domain: string;
  chapter: string;
  description: string;
  ranges: Range[];
  tags: string[];
  aliases?: string[];
  notes?: string[];
  confidence?: number;
  testRef?: TestRef;
};

type SourcePage = {
  source_path: string;
  page: number;
  text: string;
};

const TEST_REFS: Record<string, TestRef> = {
  '0x0000': {
    source: 'raw/test-specs/docs-15-0302-05-pfnd-0x0000-Basic-Cluster-Test-Specification-Draft.pdf',
    summary: 'summaries/2026-05-08-basic-cluster-test-spec',
    status: 'draft',
  },
  '0x0003': {
    source: 'raw/test-specs/docs-15-0304-05-pfnd-0x0003-Identify-Cluster-Test-Specification-Draft.pdf',
    summary: 'summaries/2026-05-08-identify-cluster-test-spec',
    status: 'draft',
  },
  '0x0004': {
    source: 'raw/test-specs/docs-15-0306-05-pfnd-0x0004-Groups-Cluster-Test-Specification.pdf',
    summary: 'summaries/2026-05-08-groups-cluster-test-spec',
    status: 'released',
  },
  '0x0005': {
    source: 'raw/test-specs/docs-15-0308-05-pfnd-0x0005-Scenes-Cluster-Test-Specification.pdf',
    summary: 'summaries/2026-05-08-scenes-cluster-test-spec',
    status: 'released',
  },
  '0x0006': {
    source: 'raw/test-specs/docs-15-0310-05-pfnd-0x0006-OnOff-Cluster-Test-Specification.pdf',
    summary: 'summaries/2026-05-08-onoff-cluster-test-spec',
    status: 'released',
  },
  '0x0008': {
    source: 'raw/test-specs/docs-15-0312-05-pfnd-0x0008-Level-Control-Test-Specification.pdf',
    summary: 'summaries/2026-05-08-level-control-cluster-test-spec',
    status: 'released',
  },
  '0x000A': {
    source: 'raw/test-specs/17-02828-001-0x000a-Time-Cluster-Test-Specification.pdf',
    summary: 'summaries/2026-05-08-time-cluster-test-spec',
    status: 'released',
  },
  '0x0019': {
    source: 'raw/test-specs/16-02824-007-0x0019-OTA-Cluster-Test-Specification-Draft.pdf',
    summary: 'summaries/2026-05-08-ota-cluster-test-spec-draft',
    status: 'draft',
  },
  '0x0020': {
    source: 'raw/test-specs/17-02841-001-0x0020-Poll-Control-Cluster-Test-Specification.pdf',
    summary: 'summaries/2026-05-08-poll-control-cluster-test-spec',
    status: 'released',
  },
  '0x0102': {
    source: 'raw/test-specs/docs-r04-0x0102-Window-Covering-Cluster-Test-Specification.pdf',
    summary: 'summaries/2026-05-08-window-covering-cluster-test-spec',
    status: 'released',
  },
  '0x0202': {
    source: 'raw/test-specs/17-02840-001-0x0202-Fan-Control-Cluster-Test-Specification.pdf',
    summary: 'summaries/2026-05-08-fan-control-cluster-test-spec',
    status: 'released',
  },
  '0x0300': {
    source: 'raw/test-specs/docs-15-0314-05-pfnd-0x0300-Color-Control-Cluster-Test-Specification.pdf',
    summary: 'summaries/2026-05-08-color-control-cluster-test-spec',
    status: 'released',
  },
  '0x0301': {
    source: 'raw/test-specs/16-02819-002-0x0301-Ballast-Configuration-Cluster-Test-Specification-Draft.pdf',
    summary: 'summaries/2026-05-08-ballast-configuration-cluster-test-spec',
    status: 'draft',
  },
  '0x0400': {
    source: 'raw/test-specs/docs-15-0316-06-pfnd-0x0400-Illuminance-measurement-Cluster-Test-Specification-Draft.pdf',
    summary: 'summaries/2026-05-08-illuminance-measurement-cluster-test-spec',
    status: 'draft',
  },
  '0x0402': {
    source: 'raw/test-specs/16-02817-003-0x0402-Temperature-Measurement-Cluster-Test-Specification-Draft.pdf',
    summary: 'summaries/2026-05-08-temperature-measurement-cluster-test-spec',
    status: 'draft',
  },
  '0x0406': {
    source: 'raw/test-specs/docs-15-0318-06-pfnd-0x0406-Occupancy-Sensing-Cluster-Test-Specification-Draft.pdf',
    summary: 'summaries/2026-05-08-occupancy-sensing-cluster-test-spec',
    status: 'draft',
  },
  '0x1000': {
    source: 'raw/test-specs/docs-15-0320-05-pfnd-0x1000-Touchlink-Commissioning-Cluster-Test-Specification.pdf',
    summary: 'summaries/2026-05-08-touchlink-commissioning-cluster-test-spec',
    status: 'released',
  },
};

const COMMAND_OVERRIDES: Record<string, string[]> = {
  '0x0016': [
    'Server received `0x00` TransferPartitionedFrame',
    'Server received `0x01` ReadHandshakeParam',
    'Server received `0x02` WriteHandshakeParam',
    'Server generated `0x00` MultipleACK',
    'Server generated `0x01` ReadHandshakeParamResponse',
  ],
  '0x001A': [
    'Server received `0x00` PowerProfileRequest',
    'Server received `0x01` PowerProfileStateRequest',
    'Server received `0x02` GetPowerProfilePriceResponse',
    'Server received `0x03` GetOverallSchedulePriceResponse',
    'Server received `0x04` EnergyPhasesScheduleNotification',
    'Server received `0x05` EnergyPhasesScheduleResponse',
    'Server received `0x06` PowerProfileScheduleConstraintsRequest',
    'Server received `0x07` EnergyPhasesScheduleStateRequest',
    'Server received `0x08` GetPowerProfilePriceExtendedResponse',
    'Server generated `0x00` PowerProfileNotification',
    'Server generated `0x01` PowerProfileResponse',
    'Server generated `0x02` PowerProfileStateResponse',
    'Server generated `0x03` GetPowerProfilePrice',
    'Server generated `0x04` PowerProfilesStateNotification',
    'Server generated `0x05` GetOverallSchedulePrice',
    'Server generated `0x06` EnergyPhasesScheduleRequest',
    'Server generated `0x07` EnergyPhasesScheduleStateResponse',
    'Server generated `0x08` EnergyPhasesScheduleStateNotification',
    'Server generated `0x09` PowerProfileScheduleConstraintsNotification',
    'Server generated `0x0A` PowerProfileScheduleConstraintsResponse',
    'Server generated `0x0B` GetPowerProfilePriceExtended',
  ],
};

const generalClusters: Cluster[] = [
  c('0x0000', 'Basic', 'basic', 'General', '3.2', '提供节点/物理设备基础信息、用户可配置位置、使能状态，以及恢复出厂默认值命令。', 107, 117, ['general', 'basic']),
  c('0x0001', 'Power Configuration', 'power-configuration', 'General', '3.3', '描述设备电源、电池、电压/频率监控和相关告警阈值。', 118, 126, ['general', 'power']),
  c('0x0002', 'Device Temperature Configuration', 'device-temperature-configuration', 'General', '3.4', '暴露设备内部温度与过温/欠温告警配置。', 127, 130, ['general', 'temperature']),
  c('0x0003', 'Identify', 'identify', 'General', '3.5', '控制设备进入识别状态，并支持查询识别剩余时间。', 130, 134, ['general', 'identify']),
  c('0x0004', 'Groups', 'groups', 'General', '3.6', '管理 endpoint 的 group table，使多个设备可通过 group address 被共同寻址。', 134, 142, ['general', 'groups']),
  c('0x0005', 'Scenes', 'scenes', 'General', '3.7', '保存、调用和管理一组 cluster 属性快照，用于场景控制。', 142, 156, ['general', 'scenes']),
  c('0x0006', 'On/Off', 'on-off', 'General', '3.8', '在 On 和 Off 状态之间切换设备，并定义 timed off/global scene 相关行为。', 157, 164, ['general', 'on-off']),
  c('0x0007', 'On/Off Switch Configuration', 'on-off-switch-configuration', 'General', '3.9', '配置本地开关类型和开关动作映射。', 164, 167, ['general', 'switch']),
  c('0x0008', 'Level Control', 'level-control', 'General', '3.10 / 3.19', '控制可调等级，并在 Lighting 派生规范中定义与 On/Off 联动的灯光等级行为。', 167, 176, ['general', 'level'], [{ start: 293, end: 297, note: 'Level Control for Lighting derived behavior' }]),
  c('0x0009', 'Alarms', 'alarms', 'General', '3.11', '复位、获取和上报其他 cluster 或设备基础告警。', 177, 181, ['general', 'alarms']),
  c('0x000A', 'Time', 'time', 'General', '3.12', '提供 UTC 时间、本地时间、时区、夏令时和时间有效性状态。', 181, 185, ['general', 'time']),
  c('0x000B', 'RSSI Location', 'rssi-location', 'General', '3.13', '交换位置、RSSI、信道参数，并可向中心节点报告定位数据。', 185, 199, ['general', 'location']),
  c('0x000C', 'Analog Input (Basic)', 'analog-input-basic', 'General', '3.14.2', '读取模拟量测量值及其 BACnet 风格的基础状态/工程单位属性。', 200, 201, ['general', 'io-value']),
  c('0x000D', 'Analog Output (Basic)', 'analog-output-basic', 'General', '3.14.3', '设置模拟输出值并暴露优先级数组、默认值和状态属性。', 201, 203, ['general', 'io-value']),
  c('0x000E', 'Analog Value (Basic)', 'analog-value-basic', 'General', '3.14.4', '表示控制系统参数类模拟值，并支持写入/优先级语义。', 203, 204, ['general', 'io-value']),
  c('0x000F', 'Binary Input (Basic)', 'binary-input-basic', 'General', '3.14.5', '读取二值测量/输入状态及其基础状态属性。', 204, 206, ['general', 'io-value']),
  c('0x0010', 'Binary Output (Basic)', 'binary-output-basic', 'General', '3.14.6', '设置二值输出状态，并支持优先级数组、最小开关时间等属性。', 206, 207, ['general', 'io-value']),
  c('0x0011', 'Binary Value (Basic)', 'binary-value-basic', 'General', '3.14.7', '表示二值控制参数并暴露活动/非活动文本、优先级和状态属性。', 207, 209, ['general', 'io-value']),
  c('0x0012', 'Multistate Input (Basic)', 'multistate-input-basic', 'General', '3.14.8', '读取多状态输入/测量值，并支持状态文本和状态标志。', 209, 210, ['general', 'io-value']),
  c('0x0013', 'Multistate Output (Basic)', 'multistate-output-basic', 'General', '3.14.9', '设置多状态输出值，并支持优先级数组和默认值。', 210, 211, ['general', 'io-value']),
  c('0x0014', 'Multistate Value (Basic)', 'multistate-value-basic', 'General', '3.14.10', '表示多状态控制参数并暴露状态文本、优先级和默认值。', 211, 249, ['general', 'io-value']),
  c('0x0B05', 'Diagnostics', 'diagnostics', 'General', '3.15', '提供硬件、MAC、NWK、APS、安全和邻居相关诊断计数器。', 249, 255, ['general', 'diagnostics']),
  c('0x0020', 'Poll Control', 'poll-control', 'General', '3.16', '允许 sleepy end device 通过 check-in/fast poll 机制被客户端临时拉高轮询频率。', 255, 263, ['general', 'poll-control', 'sleepy-end-device']),
  c('0x001A', 'Power Profile', 'power-profile', 'General', '3.17', '描述设备功率阶段、能源远程控制和电价相关交互。', 264, 289, ['general', 'energy']),
  c('0x0B01', 'Meter Identification', 'meter-identification', 'General', '3.18', '提供仪表厂商、型号、认证和软件版本等识别信息。', 289, 293, ['general', 'metering']),
  c('0x001C', 'Pulse Width Modulation', 'pulse-width-modulation', 'General', '3.20', '作为 Level 派生 cluster，控制 PWM 输出、频率和等级边界。', 297, 298, ['general', 'level', 'pwm']),
];

const measurementClusters: Cluster[] = [
  c('0x0400', 'Illuminance Measurement', 'illuminance-measurement', 'Measurement and Sensing', '4.2', '配置和报告照度测量值。', 303, 305, ['measurement', 'illuminance']),
  c('0x0401', 'Illuminance Level Sensing', 'illuminance-level-sensing', 'Measurement and Sensing', '4.3', '报告照度水平相对目标/阈值的状态。', 305, 308, ['measurement', 'illuminance']),
  c('0x0402', 'Temperature Measurement', 'temperature-measurement', 'Measurement and Sensing', '4.4', '配置和报告温度测量值。', 308, 310, ['measurement', 'temperature']),
  c('0x0403', 'Pressure Measurement', 'pressure-measurement', 'Measurement and Sensing', '4.5', '配置和报告压力测量值，并可提供 scaled pressure。', 310, 313, ['measurement', 'pressure']),
  c('0x0404', 'Flow Measurement', 'flow-measurement', 'Measurement and Sensing', '4.6', '配置和报告流量测量值。', 313, 316, ['measurement', 'flow']),
  c('0x0405', 'Relative Humidity Measurement', 'relative-humidity-measurement', 'Measurement and Sensing', '4.7', '配置和报告相对湿度测量值。', 316, 317, ['measurement', 'humidity']),
  c('0x0406', 'Occupancy Sensing', 'occupancy-sensing', 'Measurement and Sensing', '4.8', '配置 occupancy sensor，并报告占用状态。', 317, 322, ['measurement', 'occupancy']),
  c('0x0B04', 'Electrical Measurement', 'electrical-measurement', 'Measurement and Sensing', '4.9', '提供 DC/AC 电压、电流、功率、谐波、相位和告警阈值等电气测量属性。', 322, 344, ['measurement', 'electrical']),
  c('0x040A', 'Electrical Conductivity Measurement', 'electrical-conductivity-measurement', 'Measurement and Sensing', '4.10', '报告电导率测量值。', 344, 346, ['measurement', 'conductivity']),
  c('0x0409', 'pH Measurement', 'ph-measurement', 'Measurement and Sensing', '4.11', '报告 pH 测量值，分辨率为 0.01 pH。', 346, 347, ['measurement', 'ph']),
  c('0x040B', 'Wind Speed Measurement', 'wind-speed-measurement', 'Measurement and Sensing', '4.12', '报告风速测量值，分辨率为 0.01 m/s。', 347, 349, ['measurement', 'wind-speed']),
  ...concentrationClusters(),
];

const otherClusters: Cluster[] = [
  c('0x0300', 'Color Control', 'color-control', 'Lighting', '5.2', '控制可变色灯具的 hue/saturation、xy、色温和增强色彩相关行为。', 355, 387, ['lighting', 'color-control']),
  c('0x0301', 'Ballast Configuration', 'ballast-configuration', 'Lighting', '5.3', '配置照明 ballast 的物理/灯具信息和调光曲线参数。', 387, 394, ['lighting', 'ballast']),
  c('0x0200', 'Pump Configuration and Control', 'pump-configuration-and-control', 'HVAC', '6.2', '配置和控制 pump 设备，并报告 pump 状态与告警。', 397, 407, ['hvac', 'pump']),
  c('0x0201', 'Thermostat', 'thermostat', 'HVAC', '6.3', '控制和配置 thermostat 的占用/非占用设定点、系统模式、PI 控制和调度行为。', 407, 431, ['hvac', 'thermostat']),
  c('0x0202', 'Fan Control', 'fan-control', 'HVAC', '6.4', '控制 HVAC fan 的模式和模式序列。', 431, 433, ['hvac', 'fan']),
  c('0x0203', 'Dehumidification Control', 'dehumidification-control', 'HVAC', '6.5', '配置除湿设备的相对湿度目标、死区和锁定行为。', 433, 436, ['hvac', 'dehumidification']),
  c('0x0204', 'Thermostat User Interface Configuration', 'thermostat-ui-configuration', 'HVAC', '6.6', '配置 thermostat UI 的温度显示、按键锁定和调度编程可见性。', 436, 440, ['hvac', 'thermostat-ui']),
  c('0x0100', 'Shade Configuration', 'shade-configuration', 'Closures', '7.2', '配置 shade 的物理闭合限制和 open/closed 状态。', 442, 445, ['closures', 'shade']),
  c('0x0101', 'Door Lock', 'door-lock', 'Closures', '7.3', '提供门锁状态、用户/PIN/RFID、日程和操作事件相关接口。', 445, 489, ['closures', 'door-lock']),
  c('0x0102', 'Window Covering', 'window-covering', 'Closures', '7.4', '控制窗帘/百叶等开合、升降、倾角和百分比位置。', 489, 499, ['closures', 'window-covering']),
  c('0x0500', 'IAS Zone', 'ias-zone', 'Security and Safety', '8.2', '定义入侵报警系统 zone 设备的状态、类型、enroll 和状态变更上报。', 501, 511, ['ias', 'security-safety']),
  c('0x0501', 'IAS ACE', 'ias-ace', 'Security and Safety', '8.3', '定义 IAS 面板/ACE 的 arm、bypass、zone 状态和 panel 状态交互。', 511, 526, ['ias', 'security-safety']),
  c('0x0502', 'IAS WD', 'ias-wd', 'Security and Safety', '8.4', '定义 warning device 的 start warning、squawk 和告警输出行为。', 526, 531, ['ias', 'security-safety']),
  ...protocolClusters(),
  c('0x0700', 'Price', 'smart-energy-price', 'Smart Energy', '10.2', '发布价格、块阈值、税费、转换因子和 billing period 等 Smart Energy 价格信息。', 590, 614, ['smart-energy', 'price']),
  c('0x0701', 'Demand Response and Load Control', 'demand-response-and-load-control', 'Smart Energy', '10.3', '发布负荷控制事件，并管理设备对 DRLC 事件的响应。', 614, 641, ['smart-energy', 'drlc']),
  c('0x0702', 'Metering', 'smart-energy-metering', 'Smart Energy', '10.4', '提供 metering device 的能源读数、格式化、镜像和 profile 数据接口。', 641, 677, ['smart-energy', 'metering']),
  c('0x0703', 'Messaging', 'smart-energy-messaging', 'Smart Energy', '10.5', '向设备发布和取消用户可见消息。', 677, 686, ['smart-energy', 'messaging']),
  c('0x0704', 'Tunneling', 'smart-energy-tunneling', 'Smart Energy', '10.6', '建立、关闭和传输 Smart Energy 隧道数据。', 686, 700, ['smart-energy', 'tunneling']),
  c('0x0800', 'Key Establishment', 'key-establishment', 'Smart Energy', '10.7', '通过证书和密钥协商流程在两个 Zigbee 设备之间建立共享 secret。', 700, 731, ['smart-energy', 'security']),
  c('0x0019', 'OTA Upgrade', 'ota-upgrade', 'OTA Upgrade', '11.3 / 11.10 / 11.13', '定义 OTA image 查询、分块下载、升级结束和镜像通知流程。', 734, 787, ['ota', 'upgrade']),
  c('0x0900', 'Information', 'telecom-information', 'Telecommunication', '12.2', '为 telecom 信息节点、移动终端和接入点提供信息内容分发接口。', 790, 812, ['telecom', 'information']),
  c('0x0905', 'Chatting', 'chatting', 'Telecommunication', '12.3', '定义聊天用户、聊天室和聊天消息发送相关接口。', 812, 824, ['telecom', 'chatting']),
  c('0x0904', 'Voice Over ZigBee', 'voice-over-zigbee', 'Telecommunication', '12.4', '定义 Zigbee 语音传输的 codec、采样和 voice stream 控制接口。', 824, 833, ['telecom', 'voice']),
  c('0x0015', 'Commissioning', 'commissioning', 'Commissioning', '13.2', '管理 Zigbee stack startup、join、end-device 和 concentrator 参数。', 834, 850, ['commissioning']),
  c('0x1000', 'Touchlink Commissioning', 'touchlink-commissioning', 'Commissioning', '13.3', '定义 touchlink inter-PAN 命令集和 standard unicast commissioning utility 命令集。', 850, 891, ['commissioning', 'touchlink']),
  c('0x0617', 'Retail Tunnel', 'retail-tunnel', 'Retail', '14.2', '在 manufacturer-specific profile 与手持设备之间传输 retail tunnel APDU。', 892, 895, ['retail', 'tunnel']),
  c('0x0022', 'Mobile Device Configuration', 'mobile-device-configuration', 'Retail', '14.3', '配置移动设备 keepalive、rejoin 等网络管理参数。', 895, 898, ['retail', 'mobile-device']),
  c('0x0023', 'Neighbor Cleaning', 'neighbor-cleaning', 'Retail', '14.4', '管理移动设备邻居清理相关接口。', 898, 900, ['retail', 'neighbor']),
  c('0x0024', 'Nearest Gateway', 'nearest-gateway', 'Retail', '14.5', '通知或查询最近 gateway 信息以辅助设备通信。', 900, 903, ['retail', 'gateway']),
  c('0x001B', 'EN50523 Appliance Control', 'en50523-appliance-control', 'Appliance', '15.2', '远程控制和编程家用电器的 start/stop/pause 等操作。', 904, 913, ['appliance', 'en50523']),
  c('0x0B00', 'EN50523 Appliance Identification', 'en50523-appliance-identification', 'Appliance', '15.3', '提供电器基本识别、厂商、品牌、型号和产品类型信息。', 913, 918, ['appliance', 'en50523']),
  c('0x0B02', 'EN50523 Appliance Events and Alerts', 'en50523-appliance-events-and-alerts', 'Appliance', '15.4', '提供电器事件和告警结构、通知和确认接口。', 918, 924, ['appliance', 'en50523']),
  c('0x0B03', 'EN50523 Appliance Statistics', 'en50523-appliance-statistics', 'Appliance', '15.5', '提供电器统计日志和统计项读取接口。', 924, 929, ['appliance', 'en50523']),
];

const CLUSTERS: Cluster[] = [...generalClusters, ...measurementClusters, ...otherClusters].map((cluster) => ({
  ...cluster,
  id: normalizeId(cluster.id),
  testRef: TEST_REFS[normalizeId(cluster.id)],
}));

function c(
  id: string,
  name: string,
  slug: string,
  domain: string,
  chapter: string,
  description: string,
  start: number,
  end: number,
  tags: string[],
  extraRanges: Range[] = [],
  notes: string[] = []
): Cluster {
  return {
    id,
    name,
    slug,
    domain,
    chapter,
    description,
    ranges: [{ start, end }, ...extraRanges],
    tags,
    notes,
  };
}

function concentrationClusters(): Cluster[] {
  const entries: Array<[string, string, string, string[]]> = [
    ['0x040C', 'Carbon Monoxide Concentration Measurement', 'carbon-monoxide-concentration-measurement', ['carbon-monoxide', 'concentration']],
    ['0x040D', 'Carbon Dioxide Concentration Measurement', 'carbon-dioxide-concentration-measurement', ['carbon-dioxide', 'concentration']],
    ['0x040E', 'Ethylene Concentration Measurement', 'ethylene-concentration-measurement', ['ethylene', 'concentration']],
    ['0x040F', 'Ethylene Oxide Concentration Measurement', 'ethylene-oxide-concentration-measurement', ['ethylene-oxide', 'concentration']],
    ['0x0410', 'Hydrogen Concentration Measurement', 'hydrogen-concentration-measurement', ['hydrogen', 'concentration']],
    ['0x0411', 'Hydrogen Sulfide Concentration Measurement', 'hydrogen-sulfide-concentration-measurement', ['hydrogen-sulfide', 'concentration']],
    ['0x0412', 'Nitric Oxide Concentration Measurement', 'nitric-oxide-concentration-measurement', ['nitric-oxide', 'concentration']],
    ['0x0413', 'Nitrogen Dioxide Concentration Measurement', 'nitrogen-dioxide-concentration-measurement', ['nitrogen-dioxide', 'concentration']],
    ['0x0414', 'Oxygen Concentration Measurement', 'oxygen-concentration-measurement', ['oxygen', 'concentration']],
    ['0x0415', 'Ozone Concentration Measurement', 'ozone-concentration-measurement', ['ozone', 'concentration']],
    ['0x0416', 'Sulfur Dioxide Concentration Measurement', 'sulfur-dioxide-concentration-measurement', ['sulfur-dioxide', 'concentration']],
    ['0x0417', 'Dissolved Oxygen Concentration Measurement', 'dissolved-oxygen-concentration-measurement', ['dissolved-oxygen', 'concentration']],
    ['0x0418', 'Bromate Concentration Measurement', 'bromate-concentration-measurement', ['bromate', 'concentration']],
    ['0x0419', 'Chloramines Concentration Measurement', 'chloramines-concentration-measurement', ['chloramines', 'concentration']],
    ['0x041A', 'Chlorine Concentration Measurement', 'chlorine-concentration-measurement', ['chlorine', 'concentration']],
    ['0x041B', 'Fecal Coliform / Fluoride Concentration Measurement', 'fecal-coliform-fluoride-concentration-measurement', ['fecal-coliform', 'fluoride', 'concentration']],
    ['0x041D', 'Haloacetic Acids Concentration Measurement', 'haloacetic-acids-concentration-measurement', ['haloacetic-acids', 'concentration']],
    ['0x041E', 'Total Trihalomethanes Concentration Measurement', 'total-trihalomethanes-concentration-measurement', ['trihalomethanes', 'concentration']],
    ['0x041F', 'Total Coliform Bacteria Concentration Measurement', 'total-coliform-bacteria-concentration-measurement', ['coliform', 'concentration']],
    ['0x0420', 'Turbidity Measurement', 'turbidity-measurement', ['turbidity', 'concentration']],
    ['0x0421', 'Copper Concentration Measurement', 'copper-concentration-measurement', ['copper', 'concentration']],
    ['0x0422', 'Lead Concentration Measurement', 'lead-concentration-measurement', ['lead', 'concentration']],
    ['0x0423', 'Manganese Concentration Measurement', 'manganese-concentration-measurement', ['manganese', 'concentration']],
    ['0x0424', 'Sulfate Concentration Measurement', 'sulfate-concentration-measurement', ['sulfate', 'concentration']],
    ['0x0425', 'Bromodichloromethane Concentration Measurement', 'bromodichloromethane-concentration-measurement', ['bromodichloromethane', 'concentration']],
    ['0x0426', 'Bromoform Concentration Measurement', 'bromoform-concentration-measurement', ['bromoform', 'concentration']],
    ['0x0427', 'Chlorodibromomethane Concentration Measurement', 'chlorodibromomethane-concentration-measurement', ['chlorodibromomethane', 'concentration']],
    ['0x0428', 'Chloroform Concentration Measurement', 'chloroform-concentration-measurement', ['chloroform', 'concentration']],
    ['0x0429', 'Sodium Concentration Measurement', 'sodium-concentration-measurement', ['sodium', 'concentration']],
    ['0x042A', 'PM2.5 Concentration Measurement', 'pm2-5-concentration-measurement', ['pm2-5', 'concentration']],
    ['0x042B', 'Formaldehyde Concentration Measurement', 'formaldehyde-concentration-measurement', ['formaldehyde', 'concentration']],
  ];

  return entries.map(([id, name, slug, tags]) => {
    const notes =
      id === '0x041B'
        ? ['Rev 7 表 4.13.1.3 中 `0x041B` 同时出现在 Fecal coliform & E. Coli 与 Fluoride 两行；本页保留该冲突并标记为需复核。']
        : [];
    return c(
      id,
      name,
      slug,
      'Measurement and Sensing',
      '4.13',
      `${name} 是 Rev 7 Concentration Measurement 基础规范下的派生 cluster identifier，复用同一组 MeasuredValue/Min/Max/Tolerance 语义。`,
      349,
      352,
      ['measurement', ...tags],
      [],
      notes
    );
  });
}

function protocolClusters(): Cluster[] {
  const bacnet: Array<[string, string, string, number, number, string[]]> = [
    ['0x0600', 'Generic Tunnel', 'generic-tunnel', 533, 536, ['tunnel']],
    ['0x0601', 'BACnet Protocol Tunnel', 'bacnet-protocol-tunnel', 536, 538, ['bacnet', 'tunnel']],
    ['0x0602', 'Analog Input (BACnet Regular)', 'analog-input-bacnet-regular', 538, 540, ['bacnet', 'io-value']],
    ['0x0603', 'Analog Input (BACnet Extended)', 'analog-input-bacnet-extended', 540, 541, ['bacnet', 'io-value']],
    ['0x0604', 'Analog Output (BACnet Regular)', 'analog-output-bacnet-regular', 541, 542, ['bacnet', 'io-value']],
    ['0x0605', 'Analog Output (BACnet Extended)', 'analog-output-bacnet-extended', 542, 544, ['bacnet', 'io-value']],
    ['0x0606', 'Analog Value (BACnet Regular)', 'analog-value-bacnet-regular', 544, 545, ['bacnet', 'io-value']],
    ['0x0607', 'Analog Value (BACnet Extended)', 'analog-value-bacnet-extended', 545, 546, ['bacnet', 'io-value']],
    ['0x0608', 'Binary Input (BACnet Regular)', 'binary-input-bacnet-regular', 546, 548, ['bacnet', 'io-value']],
    ['0x0609', 'Binary Input (BACnet Extended)', 'binary-input-bacnet-extended', 548, 549, ['bacnet', 'io-value']],
    ['0x060A', 'Binary Output (BACnet Regular)', 'binary-output-bacnet-regular', 549, 550, ['bacnet', 'io-value']],
    ['0x060B', 'Binary Output (BACnet Extended)', 'binary-output-bacnet-extended', 550, 552, ['bacnet', 'io-value']],
    ['0x060C', 'Binary Value (BACnet Regular)', 'binary-value-bacnet-regular', 552, 553, ['bacnet', 'io-value']],
    ['0x060D', 'Binary Value (BACnet Extended)', 'binary-value-bacnet-extended', 553, 554, ['bacnet', 'io-value']],
    ['0x060E', 'Multistate Input (BACnet Regular)', 'multistate-input-bacnet-regular', 554, 555, ['bacnet', 'io-value']],
    ['0x060F', 'Multistate Input (BACnet Extended)', 'multistate-input-bacnet-extended', 555, 557, ['bacnet', 'io-value']],
    ['0x0610', 'Multistate Output (BACnet Regular)', 'multistate-output-bacnet-regular', 557, 558, ['bacnet', 'io-value']],
    ['0x0611', 'Multistate Output (BACnet Extended)', 'multistate-output-bacnet-extended', 558, 559, ['bacnet', 'io-value']],
    ['0x0612', 'Multistate Value (BACnet Regular)', 'multistate-value-bacnet-regular', 559, 560, ['bacnet', 'io-value']],
    ['0x0613', 'Multistate Value (BACnet Extended)', 'multistate-value-bacnet-extended', 560, 566, ['bacnet', 'io-value']],
    ['0x0615', 'ISO7816 Tunnel', 'iso7816-tunnel', 566, 572, ['iso7816', 'tunnel']],
    ['0x0614', '11073 Protocol Tunnel', '11073-protocol-tunnel', 580, 589, ['11073', 'tunnel']],
  ];

  return [
    c('0x0016', 'Partition', 'partition', 'Protocol Interfaces', '9.6', '把大帧分区传输为多个片段，并定义 ACK/NACK、分区大小和重传计时相关属性。', 572, 580, ['protocol-interface', 'partition']),
    ...bacnet.map(([id, name, slug, start, end, tags]) =>
      c(
        id,
        name,
        slug,
        'Protocol Interfaces',
        id === '0x0614' ? '9.7' : id === '0x0615' ? '9.5' : '9.2-9.4',
        `${name} 是 Protocol Interfaces 章节中的协议隧道或 BACnet 风格 I/O/value cluster。`,
        start,
        end,
        ['protocol-interface', ...tags]
      )
    ),
  ];
}

function normalizeId(id: string): string {
  return id.toUpperCase().replace('X', 'x');
}

function loadPages(): SourcePage[] {
  const raw = JSON.parse(fs.readFileSync(PAGE_INDEX, 'utf-8')) as { pages: SourcePage[] };
  return raw.pages.filter((page) => page.source_path === SOURCE_PATH);
}

function effectiveRanges(ranges: Range[]): Range[] {
  return ranges.map((range, index) => ({
    ...range,
    start: index === 0 ? Math.max(1, range.start - 1) : range.start,
  }));
}

function pageText(pages: SourcePage[], ranges: Range[]): string {
  const chunks: string[] = [];
  for (const range of effectiveRanges(ranges)) {
    const selected = pages.filter((page) => page.page >= range.start && page.page <= range.end);
    chunks.push(selected.map((page) => page.text).join('\n'));
  }
  return cleanText(chunks.join('\n'));
}

function cleanText(value: string): string {
  return value
    .replace(/\f/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((line) => line.trim().replace(/^\d{3,6}\s+/, '').trim())
    .filter((line) => {
      if (!line) return true;
      if (/^Copyright .+Zigbee/i.test(line)) return false;
      if (/^Page \d+/i.test(line)) return false;
      if (/^ZigBee? Cluster Library Specification$/i.test(line)) return false;
      if (/^Zigbee Alliance Document/i.test(line)) return false;
      if (/^Chapter \d+$/i.test(line)) return false;
      return true;
    })
    .join('\n')
    .trim();
}

function sectionTextForCluster(cluster: Cluster, fullText: string): string {
  const chapters = cluster.chapter
    .split('/')
    .map((part) => part.trim())
    .filter((part) => /^\d+(?:\.\d+)+$/.test(part));
  const sections = chapters.map((chapter) => sliceByChapter(fullText, chapter)).filter(Boolean);
  return sections.length ? sections.join('\n\n') : fullText;
}

function primaryTextForCluster(cluster: Cluster, fullText: string): string {
  const chapter = cluster.chapter
    .split('/')
    .map((part) => part.trim())
    .find((part) => /^\d+(?:\.\d+)+$/.test(part));
  return chapter ? sliceByChapter(fullText, chapter) || fullText : fullText;
}

function sliceByChapter(text: string, chapter: string): string {
  const startRe = new RegExp(`(?:^|\\n)\\s*(?:\\d+\\s+)?${escapeRegExp(chapter)}(?:\\s+|$)`, 'i');
  const start = text.search(startRe);
  if (start < 0) return '';

  const next = nextChapter(chapter);
  const rest = text.slice(start);
  const endRe = new RegExp(`\\n\\s*(?:\\d+\\s+)?${escapeRegExp(next)}(?:\\s+|$)`, 'i');
  const end = rest.slice(1).search(endRe);
  return (end >= 0 ? rest.slice(0, end + 1) : rest).trim();
}

function nextChapter(chapter: string): string {
  const parts = chapter.split('.').map(Number);
  parts[parts.length - 1] += 1;
  return parts.join('.');
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractSectionParagraph(text: string, heading: string, maxChars = 520): string {
  const headingRe = new RegExp(`${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\n`, 'i');
  const match = headingRe.exec(text);
  if (!match) return '';
  const rest = text.slice(match.index + match[0].length);
  const endMatch = /\n\d+(?:\.\d+){1,6}\s+[A-Z0-9]/.exec(rest);
  const section = (endMatch ? rest.slice(0, endMatch.index) : rest)
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return truncateSentence(section, maxChars);
}

function extractSignals(text: string, startPattern: RegExp, endPattern: RegExp, max = 24): string[] {
  const start = text.search(startPattern);
  if (start < 0) return [];
  const rest = text.slice(start);
  const end = rest.search(endPattern);
  const body = end > 0 ? rest.slice(0, end) : rest;
  const rows = new Map<string, string>();

  for (const rawLine of body.split('\n')) {
    const line = rawLine.replace(/\s+/g, ' ').trim();
    const match = /^(0x[0-9a-fA-F]{4})\s+([A-Za-z][A-Za-z0-9/().,& +_-]{1,72}?)(?:\s{2,}|\s+(?:uint|int|enum|bool|map|string|octstr|bitmap|single|double|struct|array|UTC|data|bacOID)\b|$)/i.exec(line);
    if (!match) continue;
    const id = normalizeId(match[1]);
    const name = normalizeName(match[2]);
    if (!name || /^(Description|Name|Identifier|Cluster|Value|Default|Range)$/i.test(name)) continue;
    if (!rows.has(id)) rows.set(id, name);
  }

  return [...rows.entries()].slice(0, max).map(([id, name]) => `\`${id}\` ${name}`);
}

function extractCommands(text: string): string[] {
  const noCommandPattern =
    /No cluster[- ]specific commands are (?:generated or received|received or generated|received|generated)|No commands are (?:generated or received|received or generated)|No commands are received by the server|There are no commands received by the server|server generates no commands|There are no cluster[- ]specific commands|does not receive (?:nor|or) generate (?:any )?(?:cluster[- ]?)?specific commands|does not receive or generate (?:any )?(?:cluster[- ]?)?specific commands|no dependencies, cluster specific attributes nor specific commands generated or received|no cluster specific attributes nor specific commands generated or received/i;
  if (noCommandPattern.test(text)) {
    return ['Rev 7 明确说明 server/client 不接收或生成 cluster-specific command。'];
  }

  const commandSignals = extractCommandRows(text);
  return commandSignals.length ? commandSignals : ['未从页级文本中稳定抽取到 command 表；需按实现问题回到来源页复核 payload 字段。'];
}

function extractCommandRows(text: string, max = 28): string[] {
  const rows = new Map<string, string>();
  const lines = text.split('\n');
  let inCommandArea = false;
  let cooldown = 0;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+/g, ' ').trim();
    if (!line) continue;

    if (/Status Codes|Status Code Defined/i.test(line)) {
      inCommandArea = false;
      continue;
    }

    if (isCommandAreaStart(line)) {
      inCommandArea = true;
      cooldown = 90;
      continue;
    }

    if (!inCommandArea) continue;

    const numberedHeading = /^\d+(?:\.\d+){1,6}\s+/.test(line);
    const commandTableHeading = isCommandAreaStart(line);
    if (numberedHeading && !commandTableHeading) {
      inCommandArea = false;
      continue;
    }

    const row = parseCommandRow(line);
    if (row) {
      rows.set(row.id, row.name);
      cooldown = 24;
      continue;
    }

    cooldown -= 1;
    if (cooldown <= 0) {
      inCommandArea = false;
    }
  }

  return [...rows.entries()].slice(0, max).map(([id, name]) => `\`${id}\` ${name}`);
}

function isCommandAreaStart(line: string): boolean {
  return (
    /^\d+(?:\.\d+){1,6}\s+(?:Command Frames|Commands(?:\s+(?:Received|Generated))?|.*Command Identifiers?)\b/i.test(line) ||
    /^(?:Commands(?:\s+(?:Received|Generated))?|Command IDs|Command Frames|Command Identifiers|Received Commands IDs|Generated Commands IDs|Received Command IDs|Generated Command IDs)$/i.test(line) ||
    /^Table\s+\d+-\d+\.\s+.*Command/i.test(line) ||
    /^Command identifier values\b/i.test(line)
  );
}

function parseCommandRow(line: string): { id: string; name: string } | null {
  const match = /^\s*(0x[0-9a-fA-F]{2,4})\s+(.+)$/.exec(line);
  if (!match) return null;

  const id = normalizeId(match[1]);
  let name = match[2]
    .replace(/\s+(?:Client|Server)\s*->\s*(?:Client|Server).+$/i, '')
    .replace(/\s+(?:or multicast|Not Set|Set)\b.*$/i, '')
    .replace(/\b(?:M|O|M\/O|C)\b\s*$/i, '')
    .replace(/\bField Value\b.*$/i, '')
    .replace(/\bCommand Identifier\b.*$/i, '')
    .replace(/\bDescription\b.*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!name || /^(Reserved|all|to|Command|Identifier|Description|Name)$/i.test(name)) return null;
  if (name.length > 96) name = truncateSentence(name, 96);
  return { id, name };
}

function extractBehaviorBullets(text: string, max = 5): string[] {
  const normalized = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ');
  const sentences = normalized
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => /\b(SHALL|MAY|MUST|supports?|provides?|represents?|generated|received|reporting)\b/i.test(sentence))
    .filter((sentence) => sentence.length > 45 && sentence.length < 280)
    .map((sentence) => sentence.replace(/\s+/g, ' '));
  return [...new Set(sentences)].slice(0, max).map((sentence) => truncateSentence(sentence, 220));
}

function normalizeName(value: string): string {
  return value
    .replace(/\bM\/O\b.*$/i, '')
    .replace(/\bAccess\b.*$/i, '')
    .replace(/\bRange\b.*$/i, '')
    .replace(/\bType\b.*$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.,;:]+$/, '');
}

function truncateSentence(value: string, maxChars: number): string {
  if (value.length <= maxChars) return value;
  const cut = value.slice(0, maxChars);
  const end = Math.max(cut.lastIndexOf('.'), cut.lastIndexOf(';'), cut.lastIndexOf(','));
  return `${cut.slice(0, end > maxChars * 0.55 ? end : maxChars).trim()}...`;
}

function confidenceFor(cluster: Cluster): number {
  if (cluster.id === '0x041B') return 0.72;
  if (cluster.ranges.some((range) => range.end - range.start > 25)) return 0.8;
  return cluster.confidence ?? 0.84;
}

function renderPage(cluster: Cluster, text: string): string {
  const primaryText = primaryTextForCluster(cluster, text);
  const clusterText = sectionTextForCluster(cluster, text);
  const overview = extractSectionParagraph(primaryText, 'Overview') || extractSectionParagraph(primaryText, 'Scope and Purpose') || cluster.description;
  const dependencies = extractSectionParagraph(clusterText, 'Dependencies', 460);
  const attributes = extractSignals(
    clusterText,
    /\n(?:\d+(?:\.\d+){1,6}\s+)?(?:Server )?Attributes|Attributes of|Attribute Sets/i,
    /\n\d+(?:\.\d+){1,6}\s+Commands|\n\d+(?:\.\d+){1,6}\s+Client/i,
    28
  );
  const commands = COMMAND_OVERRIDES[cluster.id] ?? extractCommands(clusterText);
  const behavior = extractBehaviorBullets(clusterText);
  const sources = [SOURCE_REF, ...(cluster.testRef ? [cluster.testRef.source] : [])];
  const rangeText = effectiveRanges(cluster.ranges).map((range) => `p.${range.start}-p.${range.end}${range.note ? ` (${range.note})` : ''}`).join('; ');
  const tags = ['zigbee', 'cluster', 'zcl', 'zcl-rev7', ...cluster.tags];
  const testLine = cluster.testRef
    ? `- 对应测试规范摘要: [[${cluster.testRef.summary}]] (${cluster.testRef.status === 'draft' ? 'draft 测试要求' : '测试要求'})`
    : '- 当前仓库未找到一份已 ingest 的独立 cluster test specification；如后续加入测试规范，应补充到本页 sources 与交叉引用。';
  const noteLines = cluster.notes?.length
    ? cluster.notes.map((note) => `- ${note}`).join('\n')
    : '- 本页区分 Rev 7 协议定义与测试规范要求；测试规范内容只作为认证验证入口。';

  return `---\n${[
    `title: "${cluster.name} Cluster"`,
    'type: entity',
    'sources:',
    ...sources.map((source) => `  - ${source}`),
    `tags: [${tags.join(', ')}]`,
    `created: ${TODAY}`,
    `updated: ${TODAY}`,
    `cluster_id: "${cluster.id}"`,
    'status: reviewed',
    `confidence: ${confidenceFor(cluster).toFixed(2)}`,
  ].join('\n')}\n---\n\n# ${cluster.name} Cluster (${cluster.id})\n\n## 概述\n\n${cluster.name} Cluster（Cluster ID \`${cluster.id}\`）属于 ZCL Rev 7 的 ${cluster.domain} 功能域，章节定位为 ${cluster.chapter}。${cluster.description}\n\nRev 7 精读范围：\`${SOURCE_REF} ${rangeText}\`。本页根据这些页的 cluster identifier、overview、server/client、attributes、commands 和行为说明整理；长表字段仍以来源页为准。\n\n## 正文\n\n### 定位\n\n| 字段 | 内容 |\n|------|------|\n| Cluster ID | \`${cluster.id}\` |\n| 名称 | ${cluster.name} |\n| 功能域 | ${cluster.domain} |\n| Rev 7 章节 | ${cluster.chapter} |\n| 来源页 | ${rangeText} |\n\n### 规范摘要\n\n${overview}\n\n${dependencies ? `### 依赖\n\n${dependencies}\n` : `### 依赖\n\n本次页级精读未抽取到独立的 Dependencies 小节；如实现依赖其他 cluster、profile 或设备类型，应回到来源页和应用规范一起确认。\n`}\n### 属性\n\n${attributes.length ? attributes.map((item) => `- ${item}`).join('\n') : '- 未从页级文本中稳定抽取到属性表行；该 cluster 可能以命令为主，或表格需要按来源页人工复核。'}\n\n### 命令\n\n${commands.map((item) => `- ${item}`).join('\n')}\n\n### 行为要点\n\n${behavior.length ? behavior.map((item) => `- ${item}`).join('\n') : '- 本页已定位 cluster 定义和表格结构；具体 command payload、状态枚举和边界条件按实现任务回到来源页逐项复核。'}\n\n### 测试规范\n\n${testLine}\n\n## 关键要点\n\n- \`${cluster.id}\` 的权威定义来自 ZCL Rev 7；测试规范是 certification 要求，不能直接替代协议行为。\n- 本页保留来源页范围，后续实现、测试或差异分析应引用具体页码和章节。\n${noteLines}\n\n## 交叉引用\n\n- [[${ZCL_SPEC}]]\n- [[${ZCL_SUMMARY}]]\n${cluster.testRef ? `- [[${cluster.testRef.summary}]]\n` : ''}- [[index]]\n\n## 待深入\n\n- [ ] 按实现需求补齐完整属性表的类型、范围、access、默认值和 M/O 条件。\n- [ ] 按 command payload 深读补齐 request/response 字段、状态码和时序。\n- [ ] 若存在 profile/device type 约束，链接到对应 Device Type 或测试规范页面。\n`;
}

function writeClusterPages(pages: SourcePage[]): { written: Cluster[]; skipped: Cluster[] } {
  const written: Cluster[] = [];
  const skipped: Cluster[] = [];
  fs.mkdirSync(ENTITIES_DIR, { recursive: true });

  for (const cluster of CLUSTERS) {
    const target = path.join(ENTITIES_DIR, `cluster-${cluster.slug}.md`);
    if (fs.existsSync(target) && PRESERVE_EXISTING_SLUGS.has(cluster.slug)) {
      skipped.push(cluster);
      console.log(`skip existing ${cluster.id} ${cluster.name}`);
      continue;
    }
    const text = pageText(pages, cluster.ranges);
    fs.writeFileSync(target, renderPage(cluster, text), 'utf-8');
    written.push(cluster);
    console.log(`wrote ${cluster.id} ${cluster.name} -> ${path.relative(ROOT_DIR, target)}`);
  }

  return { written, skipped };
}

function updateIndex(): void {
  const start = '<!-- ZCL_REV7_CLUSTER_INDEX_START -->';
  const end = '<!-- ZCL_REV7_CLUSTER_INDEX_END -->';
  const byDomain = new Map<string, Cluster[]>();
  for (const cluster of CLUSTERS) {
    if (!byDomain.has(cluster.domain)) byDomain.set(cluster.domain, []);
    byDomain.get(cluster.domain)!.push(cluster);
  }

  const lines: string[] = [];
  lines.push('### Cluster 实体');
  lines.push('');
  lines.push(start);
  lines.push('');
  lines.push('> 以下 Cluster 实体按 ZCL Rev 7 精读页码生成；已有 On/Off 页保留人工精读版本。');
  lines.push('');
  for (const [domain, clusters] of byDomain) {
    lines.push(`#### ${domain}`);
    lines.push('');
    lines.push('| Cluster ID | Cluster | 页面 | Rev 7 页码 |');
    lines.push('|------------|---------|------|------------|');
    for (const cluster of clusters) {
      const rangeText = effectiveRanges(cluster.ranges).map((range) => `p.${range.start}-p.${range.end}`).join('; ');
      lines.push(`| \`${cluster.id}\` | ${cluster.name} | [[entities/cluster-${cluster.slug}]] | ${rangeText} |`);
    }
    lines.push('');
  }
  lines.push(end);

  const block = lines.join('\n');
  const current = fs.readFileSync(INDEX_MD, 'utf-8');
  let next: string;
  if (current.includes(start) && current.includes(end)) {
    next = current.replace(new RegExp(`${start}[\\s\\S]*?${end}`), block.split('\n').slice(2).join('\n'));
  } else {
    next = current.replace(/(### Spec 版本实体[\s\S]*?\n\n)(---\n\n## 核心概念)/, `$1${block}\n\n$2`);
  }

  const pageCount = fs.readdirSync(ENTITIES_DIR).filter((file) => file.startsWith('cluster-') && file.endsWith('.md')).length;
  next = next.replace(/- Wiki 页面数：.+/, `- Wiki 页面数：${64 + Math.max(0, pageCount - 1)}+（已补齐 ZCL Rev 7 cluster 实体页；以 \`runtime/data/wiki-index.json\` 为准）`);
  fs.writeFileSync(INDEX_MD, next, 'utf-8');
}

function main(): void {
  const ids = new Set<string>();
  for (const cluster of CLUSTERS) {
    if (ids.has(cluster.id)) {
      throw new Error(`Duplicate cluster id in manifest: ${cluster.id}`);
    }
    ids.add(cluster.id);
  }

  const pages = loadPages();
  const { written, skipped } = writeClusterPages(pages);
  updateIndex();
  console.log(`done: ${written.length} written, ${skipped.length} existing, ${CLUSTERS.length} total`);
}

main();
