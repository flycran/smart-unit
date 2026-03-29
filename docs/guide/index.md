# 快速开始

## 安装

```bash
npm install smart-unit
```

### 如果需要高精度计算

```bash
npm install smart-unit decimal.js
```


## 基础用法

### 1. 创建实例

```ts
import SmartUnit from 'smart-unit'

// 使用 baseDigit 自动生成比例
const size = new SmartUnit(['B', 'KB', 'MB', 'GB'], { 
  baseDigit: 1024 
})

// 手动指定每个单位的比例
const length = new SmartUnit(['mm', 10, 'cm', 100, 'm', 1000, 'km'])
```

### 2. 格式化输出

```ts
size.format(1536)              // => "1.5KB"
size.format(1024 * 1024 * 100) // => "100MB"
```

### 3. 解析字符串

```ts
size.parse('1.5KB')  // => 1536
size.parse('2MB')    // => 2097152
```

:::info 国际化支持
反向解析支持国际化的字符串，使用国际化后，只有使用特定语言的字符串才能被正确解析。原始单位将不再被识别。
:::

:::warning 注意
反向解析只支持使用[`format`](../api/index.md#format)方法生成或与之兼容的字符串。
如果是使用[`getUnit`](../api/index.md#getunit)获取单位然后手动格式化，通常不支持。
:::

## 核心概念

### 单位数组

SmartUnit 接受两种格式的单位数组：

**格式 1：使用 baseDigit（推荐）**
```ts
new SmartUnit(['B', 'KB', 'MB', 'GB'], { baseDigit: 1024 })
```

**格式 2：手动指定比例**
```ts
new SmartUnit(['mm', 10, 'cm', 100, 'm', 1000, 'km'])
```

### 配置选项

```ts
new SmartUnit(units, {
  baseDigit: 1024,        // 自动生成比例
  threshold: 1,           // 单位切换阈值
  fractionDigits: 2,      // 小数位数
  separator: ' ',         // 分隔符，仅用于`formatChain`方法
  decimalOptions: {},     // Decimal.js 配置 (仅在高精度模式下有效)
})
```

## 在线体验

[![在 CodeSandbox 中编辑](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/flycran/smart-unit/tree/master/examples/basic)

访问 [CodeSandbox 示例](https://codesandbox.io/s/github/flycran/smart-unit/tree/master/examples/basic) 在线体验。

## 下一步

- 📖 [常用单位](/guide/units) - 文件大小、长度、时间等常见用例
- ⚡ [高精度](/guide/high-precision) - BigInt 和大数计算
- 🔗 [链式格式化](/guide/chain-format) - 格式化如 "1h30m"
- 🌍 [国际化](/guide/i18n) - 多语言支持
