# smart-unit

> 优雅的 JavaScript & TypeScript 单位转换工具

[![npm version](https://img.shields.io/npm/v/smart-unit)](https://www.npmjs.com/package/smart-unit)
[![npm downloads](https://img.shields.io/npm/dm/smart-unit)](https://www.npmjs.com/package/smart-unit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/smart-unit)](https://bundlephobia.com/package/smart-unit)
[![test](https://github.com/flycran/smart-unit/workflows/Test/badge.svg)](https://github.com/flycran/smart-unit/actions)
[![license](https://img.shields.io/npm/l/smart-unit)](./LICENSE)

[English](./README.md) | 中文

---

**smart-unit** 是一个轻量级的自动单位转换工具，支持智能格式化输出。

```ts
import SmartUnit from 'smart-unit';

const size = new SmartUnit(['B', 'KB', 'MB', 'GB'], { baseDigit: 1024 });

size.format(1024 * 1024 * 100);  // "100MB"
size.format(1536);               // "1.5KB"
size.parse('2.5GB');             // 2684354560
```

## 特性

- 🎯 **智能格式化** — 自动选择最优单位进行展示
- 🔢 **双向转换** — 支持单位格式化（`format`）和反向解析（`parse`）
- ⚡ **高性能** — 极小开销，支持 Node.js 和浏览器
- 🧮 **高精度** — 可选 `decimal.js` 集成，支持任意精度计算
- 📦 **TypeScript 优先** — 完整的类型安全
- 🪶 **轻量级** — 核心功能，体积小巧
- ✅ **测试完善** — 全面的测试套件，100% 覆盖率

## 安装

```bash
npm install smart-unit
```

## 在线体验

[![在 CodeSandbox 中编辑](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/flycran/smart-unit/tree/master/examples/basic)

## 快速开始

### 固定比例单位

```ts
import SmartUnit from 'smart-unit';

const fileSize = new SmartUnit(['B', 'KB', 'MB', 'GB', 'TB'], {
  baseDigit: 1024,
});

fileSize.format(1024 * 1024 * 100);  // => "100MB"
fileSize.format(1536);               // => "1.5KB"
```

### 可变比例单位

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

### 链式单位

```ts
const time = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h']);

time.formatChain(63000) // => 1m3s
time.formatChain(3663000);  // => 1h1m3s
```

### 国际化

```ts
const i18nMap = {
  ms: 'ms',
  s: 'seconds',
  m: 'minutes',
  h: 'hours',
}
const t = (unit: keyof typeof i18nMap) => i18nMap[unit]

const timeI18n = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h'], {
  separator: ' ',
}).withConvert(t)

timeI18n.formatChain(90000) // 1minutes 30seconds
timeI18n.formatChain(9000000) // 2hours 30minutes
```

## 使用 TypeScript

SmartUnit拥有完整的类型安全支持，适用于 TypeScript 项目。

```ts
import SmartUnit, { type GetUnitNames } from 'smart-unit'

const time = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h'])
// 使用工具函数导出类型
type TimeUnits = GetUnitNames<typeof time> // => type TimeUnits = "m" | "ms" | "s" | "h"

// t函数必须能接受所有TimeUnits单位，否则将导致类型错误
const timeI18n = time.withConvert(t)
// toBase的unit参数收到TimeUnits类型约束
time.toBase(60, 'h')
```

## 贡献

欢迎贡献！请随时提交 issue 或 pull request。

## 许可证

MIT © [flycran](https://github.com/flycran)
