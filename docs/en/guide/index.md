# Quick Start

## Installation

```bash
npm install smart-unit
```

### If High Precision Calculation is Needed

```bash
npm install smart-unit decimal.js
```


## Basic Usage

### 1. Creating Instances

```ts
import SmartUnit from 'smart-unit'

// Use baseDigit to auto-generate ratios
const size = new SmartUnit(['B', 'KB', 'MB', 'GB'], { 
  baseDigit: 1024 
})

// Manually specify the ratio for each unit
const length = new SmartUnit(['mm', 10, 'cm', 100, 'm', 1000, 'km'])
```

### 2. Formatting Output

```ts
size.format(1536)              // => "1.5KB"
size.format(1024 * 1024 * 100) // => "100MB"
```

### 3. Parsing Strings

```ts
size.parse('1.5KB')  // => 1536
size.parse('2MB')    // => 2097152
```

## Core Concepts

### Unit Array

SmartUnit accepts two formats of unit arrays:

**Format 1: Using baseDigit (Recommended)**
```ts
new SmartUnit(['B', 'KB', 'MB', 'GB'], { baseDigit: 1024 })
```

**Format 2: Manually Specifying Ratios**
```ts
new SmartUnit(['mm', 10, 'cm', 100, 'm', 1000, 'km'])
```

### Configuration Options

```ts
new SmartUnit(units, {
  baseDigit: 1024,        // Auto-generate ratios
  threshold: 1,           // Threshold for unit switching
  fractionDigits: {},     // Number of decimal places
  decimalOptions: {},     // Decimal.js options (only valid in high-precision mode)
})
```

## Try It Online

[![Edit in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/flycran/smart-unit/tree/master/examples/basic)

Visit [CodeSandbox Example](https://codesandbox.io/s/github/flycran/smart-unit/tree/master/examples/basic) to try it online.

## Next Steps

- 📖 [Common Units](/en/guide/units) - File size, length, time, and other common use cases
- ⚡ [High Precision](/en/guide/high-precision) - BigInt and big number calculations
- 🔗 [Chain Formatting](/en/guide/chain-format) - Format like "1h30m"
- 🌍 [Internationalization](/en/guide/i18n) - Multi-language support
