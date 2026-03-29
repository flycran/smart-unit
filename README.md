# smart-unit

> Elegant unit conversion utility for JavaScript & TypeScript

[![npm version](https://img.shields.io/npm/v/smart-unit)](https://www.npmjs.com/package/smart-unit)
[![npm downloads](https://img.shields.io/npm/dm/smart-unit)](https://www.npmjs.com/package/smart-unit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/smart-unit)](https://bundlephobia.com/package/smart-unit)
[![test](https://github.com/flycran/smart-unit/workflows/Test/badge.svg)](https://github.com/flycran/smart-unit/actions)
[![license](https://img.shields.io/npm/l/smart-unit)](./LICENSE)

<p align="center">
  English | <a href="./README.zh-CN.md">中文</a> | <a href="https://flycran.github.io/smart-unit/en">Documentation</a>
</p>

---

**smart-unit** is a lightweight automatic unit conversion tool with intelligent formatting.

```ts
import SmartUnit from 'smart-unit';

const size = new SmartUnit(['B', 'KB', 'MB', 'GB'], { baseDigit: 1024 });

size.format(1024 * 1024 * 100);  // "100MB"
size.format(1536);               // "1.5KB"
size.parse('2.5GB');             // 2684354560
```

## Features

- 🎯 **Smart Formatting** — Automatically selects the optimal unit for display
- 🔢 **Bidirectional Conversion** — Supports unit formatting (`format`) and reverse parsing (`parse`)
- ⚡ **High Performance** — Minimal overhead, supports Node.js and browsers
- 🧮 **High Precision** — Optional `decimal.js` integration for arbitrary precision calculations
- 📦 **TypeScript First** — Complete type safety
- 🪶 **Lightweight** — Core functionality with small bundle size
- ✅ **Well Tested** — 100+ test cases covering various edge cases

## Installation

```bash
npm install smart-unit
```

## Try It Online

[![Edit in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/flycran/smart-unit/tree/master/examples/basic)

## Quick Start

### Fixed Ratio Units

```ts
import SmartUnit from 'smart-unit';

const fileSize = new SmartUnit(['B', 'KB', 'MB', 'GB', 'TB'], {
  baseDigit: 1024,
});

fileSize.format(1024 * 1024 * 100);  // => "100MB"
fileSize.format(1536);               // => "1.5KB"
```

### Variable Ratio Units

```ts
const length = new SmartUnit(['mm', 10, 'cm', 100, 'm', 1000, 'km']);

length.format(1500);     // => "1.5m"
length.format(1500000);  // => "1.5km"
```

### High Precision & BigInt Support

```ts
import { SmartUnitPrecision } from 'smart-unit/precision'

const bigLength = new SmartUnitPrecision(
  ['mm', 10, 'cm', 100, 'm', 1000, 'km', 1000, 'Mm', 1000, 'Gm', 1000, 'Tm']
);

// Supports BigInt and values beyond JS safe integer range
bigLength.format(10n ** 18n);  // => "1000Tm"
```

### Parsing Unit Strings

```ts
const time = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h']);

time.parse('90s');   // => 90000 (ms)
time.parse('2.5h');  // => 9000000 (ms)
```

### Chain Formatting

```ts
const time = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h']);

time.formatChain(63000) // => 1m3s
time.formatChain(3663000);  // => 1h1m3s
```

### Internationalization

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

## Using TypeScript

SmartUnit provides complete type safety support for TypeScript projects.

```ts
import SmartUnit, { type GetUnitNames } from 'smart-unit'

const time = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h'])
// Use utility function to export types
type TimeUnits = GetUnitNames<typeof time> // => type TimeUnits = "m" | "ms" | "s" | "h"

// The t function must accept all TimeUnits units, otherwise a type error will occur
const timeI18n = time.withConvert(t)
// The unit parameter of toBase receives TimeUnits type constraint
time.toBase(60, 'h')
```

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## License

MIT © [flycran](https://github.com/flycran)
