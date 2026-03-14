# smart-unit

> 优雅的 JavaScript & TypeScript 单位转换工具

[![npm version](https://img.shields.io/npm/v/smart-unit)](https://www.npmjs.com/package/smart-unit)
[![npm downloads](https://img.shields.io/npm/dm/smart-unit)](https://www.npmjs.com/package/smart-unit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/smart-unit)](https://bundlephobia.com/package/smart-unit)
[![license](https://img.shields.io/npm/l/smart-unit)](./LICENSE)

[English](./README.md) | 中文

---

**smart-unit** 是一个轻量级的自动单位转换工具，支持智能格式化输出。

## 特性

- 🎯 **智能格式化** — 自动选择最优单位进行展示
- 🔢 **双向转换** — 支持单位格式化（`format`）和反向解析（`parse`）
- ⚡ **高性能** — 极小开销，支持 Node.js 和浏览器
- 🧮 **高精度** — 可选 `decimal.js` 集成，支持任意精度计算
- 📦 **TypeScript 优先** — 完整的类型安全
- 🪶 **轻量级** — 核心功能，体积小巧

## 安装

```bash
npm install smart-unit
```

## 在线体验

[![在 CodeSandbox 中编辑](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/flycran/smart-unit/tree/master/examples/basic)

## 快速开始

### 文件大小格式化

```ts
import SmartUnit from 'smart-unit';

const fileSize = new SmartUnit(['B', 'KB', 'MB', 'GB', 'TB'], {
  baseDigit: 1024,
});

fileSize.format(1024 * 1024 * 100);  // => "100MB"
fileSize.format(1536);               // => "1.5KB"
```

### 可变进制长度单位

```ts
const length = new SmartUnit(['mm', 10, 'cm', 100, 'm', 1000, 'km']);

length.format(1500);     // => "1.5m"
length.format(1500000);  // => "1.5km"
```

### 高精度与 BigInt 支持

```ts
const bigLength = new SmartUnit(
  ['mm', 10, 'cm', 100, 'm', 1000, 'km', 1000, 'Mm', 1000, 'Gm', 1000, 'Tm'],
  { useDecimal: true }
);

// 支持 BigInt 和超出 JS 安全整数范围的数值
bigLength.format(10n ** 18n);  // => "1000Tm"
```

### 解析单位字符串

```ts
const time = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h']);

time.parse('90s');   // => 90000 (ms)
time.parse('2.5h');  // => 9000000 (ms)
```

## API

### `new SmartUnit(units, options?)`

创建单位转换器实例。

#### 参数

- **units** `(string | number)[]` — 单位名称和转换比例数组
  - 偶数索引：单位名称（如 `'B'`、`'KB'`）
  - 奇数索引：到下一单位的转换比例（如 `1024`）
- **options** `SmartUnitOptions` — 配置对象
  - `baseDigit?: number` — 自动生成比例（如 `1024` 表示所有步骤）
  - `threshold?: number` — 单位切换阈值（默认：`1`）
  - `fractionDigits?: FractionDigits` — 格式化小数位数
  - `useDecimal?: boolean` — 启用高精度模式
  - `decimalOptions?: Decimal.Config` — 自定义 decimal.js 配置

#### 方法

##### `.format(num, decimal?)`

将数字格式化为最优单位字符串。

```ts
const size = new SmartUnit(['B', 'KB', 'MB'], { baseDigit: 1024, fractionDigits: 2 });

size.format(1536);           // => "1.5KB"
size.format(1536, 0);        // => "2KB"
size.format(1536, '1-3');    // => "1.5KB"（最少1位，最多3位小数）
```

##### `.parse(str)`

将单位字符串解析回基本单位值。

```ts
const size = new SmartUnit(['B', 'KB', 'MB'], { baseDigit: 1024 });

size.parse('1.5KB');  // => 1536
size.parse('2MB');    // => 2097152
```

##### `.getUnit(num)`

获取最优单位和转换后的值（不进行格式化）。

```ts
const size = new SmartUnit(['B', 'KB', 'MB'], { baseDigit: 1024 });

size.getUnit(1536);
// => { num: 1.5, unit: 'KB' }

// 高精度模式
const precise = new SmartUnit(['B', 'KB', 1024], { useDecimal: true });
precise.getUnit(1536);
// => { num: 1.5, unit: 'KB', decimal: Decimal }
```

##### `.toBase(num, unit)`

将指定单位的值转换为基本单位。

```ts
const length = new SmartUnit(['mm', 10, 'cm', 100, 'm']);

length.toBase(1.5, 'm');   // => 1500 (mm)
length.toBase(100, 'cm');  // => 1000 (mm)
```

##### `.splitUnit(str)`

从格式化字符串中提取数值和单位。

```ts
const size = new SmartUnit(['B', 'KB', 'MB'], { baseDigit: 1024 });

size.splitUnit('1.5KB');  // => { num: 1.5, unit: 'KB' }
```

##### `.fromUnitFormat(num, unit, decimal?)`

从一种单位转换到最优单位并格式化。

```ts
const length = new SmartUnit(['mm', 10, 'cm', 100, 'm', 1000, 'km']);

length.fromUnitFormat(1500, 'm');  // => "1.5km"
```

## 使用场景

### 数据传输速率

```ts
const bitrate = new SmartUnit(['bps', 'Kbps', 'Mbps', 'Gbps'], {
  baseDigit: 1000,
  fractionDigits: 1,
});

bitrate.format(1500000);  // => "1.5Mbps"
```

### 频率

```ts
const freq = new SmartUnit(['Hz', 'kHz', 'MHz', 'GHz'], {
  baseDigit: 1000,
  fractionDigits: 2,
});

freq.format(2400000000);  // => "2.40GHz"
```

### 金融金额（高精度）

```ts
const currency = new SmartUnit(['', 'K', 'M', 'B', 'T'], {
  baseDigit: 1000,
  useDecimal: true,
  fractionDigits: 2,
});

currency.format('12345678901234567890');  // => "12345678.90T"
```

## TypeScript

smart-unit 使用 TypeScript 编写，提供完整的类型安全。

```ts
import SmartUnit from 'smart-unit';
import type { Decimal } from 'decimal.js';

// 普通模式 - 返回 number
const regular = new SmartUnit(['B', 'KB', 1024]);
const num: number = regular.parse('1KB');

// 高精度模式 - 返回 Decimal
const precise = new SmartUnit(['B', 'KB', 1024], { useDecimal: true });
const dec: Decimal = precise.parse('1KB');
```

## 贡献

欢迎贡献！请随时提交 issue 或 pull request。

## 许可证

MIT © [flycran](https://github.com/flycran)
