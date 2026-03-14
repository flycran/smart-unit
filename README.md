# smart-unit

> Elegant unit conversion utility for JavaScript & TypeScript

[![npm version](https://img.shields.io/npm/v/smart-unit)](https://www.npmjs.com/package/smart-unit)
[![npm downloads](https://img.shields.io/npm/dm/smart-unit)](https://www.npmjs.com/package/smart-unit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/smart-unit)](https://bundlephobia.com/package/smart-unit)
[![license](https://img.shields.io/npm/l/smart-unit)](./LICENSE)

English | [中文](./README.zh-CN.md)

---

**smart-unit** is a lightweight utility for automatic unit conversion with intelligent formatting.

## Features

- 🎯 **Smart Formatting** — Automatically selects the optimal unit for display
- 🔢 **Bidirectional** — Convert to units (`format`) and from units (`parse`)
- ⚡ **High Performance** — Minimal overhead, works in Node.js and browsers
- 🧮 **High Precision** — Optional `decimal.js` integration for arbitrary precision
- 📦 **TypeScript First** — Full type safety
- 🪶 **Lightweight** — Core functionality with minimal footprint

## Install

```bash
npm install smart-unit
```

## Try It Online

[![Edit in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/flycran/smart-unit/tree/master/examples/basic)

## Quick Start

### File Size Formatting

```ts
import SmartUnit from 'smart-unit';

const fileSize = new SmartUnit(['B', 'KB', 'MB', 'GB', 'TB'], {
  baseDigit: 1024,
});

fileSize.format(1024 * 1024 * 100);  // => "100MB"
fileSize.format(1536);               // => "1.5KB"
```

### Length Units with Variable Ratios

```ts
const length = new SmartUnit(['mm', 10, 'cm', 100, 'm', 1000, 'km']);

length.format(1500);     // => "1.5m"
length.format(1500000);  // => "1.5km"
```

### High-Precision & BigInt Support

```ts
const bigLength = new SmartUnit(
  ['mm', 10, 'cm', 100, 'm', 1000, 'km', 1000, 'Mm', 1000, 'Gm', 1000, 'Tm'],
  { useDecimal: true }
);

// Works with BigInt and numbers beyond JS safe integer range
bigLength.format(10n ** 18n);  // => "1000Tm"
```

### Parse Unit Strings

```ts
const time = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h']);

time.parse('90s');   // => 90000 (ms)
time.parse('2.5h');  // => 9000000 (ms)
```

## API

### `new SmartUnit(units, options?)`

Creates a unit converter instance.

#### Parameters

- **units** `(string | number)[]` — Array of unit names and conversion ratios
  - Even indices: unit names (e.g., `'B'`, `'KB'`)
  - Odd indices: conversion ratios to next unit (e.g., `1024`)
- **options** `SmartUnitOptions` — Configuration object
  - `baseDigit?: number` — Auto-generate ratios (e.g., `1024` for all steps)
  - `threshold?: number` — Unit switch threshold (default: `1`)
  - `fractionDigits?: FractionDigits` — Decimal places for formatting
  - `useDecimal?: boolean` — Enable high-precision mode
  - `decimalOptions?: Decimal.Config` — Custom decimal.js configuration

#### Methods

##### `.format(num, decimal?)`

Formats a number to the optimal unit string.

```ts
const size = new SmartUnit(['B', 'KB', 1024, 'MB'], { fractionDigits: 2 });

size.format(1536);           // => "1.5KB"
size.format(1536, 0);        // => "2KB"
size.format(1536, '1-3');    // => "1.5KB" (min 1, max 3 decimals)
```

##### `.parse(str)`

Parses a unit string back to base unit value.

```ts
const size = new SmartUnit(['B', 'KB', 1024, 'MB']);

size.parse('1.5KB');  // => 1536
size.parse('2MB');    // => 2097152
```

##### `.getUnit(num)`

Gets the optimal unit and converted value without formatting.

```ts
const size = new SmartUnit(['B', 'KB', 1024, 'MB']);

size.getUnit(1536);
// => { num: 1.5, unit: 'KB' }

// With high precision
const precise = new SmartUnit(['B', 'KB', 1024], { useDecimal: true });
precise.getUnit(1536);
// => { num: 1.5, unit: 'KB', decimal: Decimal }
```

##### `.toBase(num, unit)`

Converts a value from specified unit to base unit.

```ts
const length = new SmartUnit(['mm', 10, 'cm', 100, 'm']);

length.toBase(1.5, 'm');   // => 1500 (mm)
length.toBase(100, 'cm');  // => 1000 (mm)
```

##### `.splitUnit(str)`

Extracts numeric value and unit from a formatted string.

```ts
const size = new SmartUnit(['B', 'KB', 1024, 'MB']);

size.splitUnit('1.5KB');  // => { num: 1.5, unit: 'KB' }
```

##### `.fromUnitFormat(num, unit, decimal?)`

Converts from one unit to the optimal unit and formats.

```ts
const length = new SmartUnit(['mm', 10, 'cm', 100, 'm', 1000, 'km']);

length.fromUnitFormat(1500, 'm');  // => "1.5km"
```

## Use Cases

### Data Transfer Rate

```ts
const bitrate = new SmartUnit(['bps', 'Kbps', 'Mbps', 'Gbps'], {
  baseDigit: 1000,
  fractionDigits: 1,
});

bitrate.format(1500000);  // => "1.5Mbps"
```

### Frequency

```ts
const freq = new SmartUnit(['Hz', 'kHz', 'MHz', 'GHz'], {
  baseDigit: 1000,
  fractionDigits: 2,
});

freq.format(2400000000);  // => "2.4GHz"
```

### Financial Amounts (High Precision)

```ts
const currency = new SmartUnit(['', 'K', 'M', 'B', 'T'], {
  baseDigit: 1000,
  useDecimal: true,
  fractionDigits: 2,
});

currency.format('12345678901234567890');  // => "12345678.9T"
```

## TypeScript

smart-unit is written in TypeScript and provides full type safety.

```ts
import SmartUnit from 'smart-unit';
import type { Decimal } from 'decimal.js';

// Regular mode - returns number
const regular = new SmartUnit(['B', 'KB', 1024]);
const num: number = regular.parse('1KB');

// High-precision mode - returns Decimal
const precise = new SmartUnit(['B', 'KB', 1024], { useDecimal: true });
const dec: Decimal = precise.parse('1KB');
```

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT © [flycran](https://github.com/flycran)
