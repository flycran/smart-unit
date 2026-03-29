# Chain Formatting

Format a number as a combination of multiple units, which is very useful for formatting time, such as "1h30m30s".

## Basic Usage

```ts
import SmartUnit from 'smart-unit'

const time = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h'])

console.log(time.formatChain(3661000))      // => "1h1m1s"
```

## Custom Separator

```ts
const length = new SmartUnit(['mm', 10, 'cm', 100, 'm'], {
  // Separator, you can also specify it in the formatChain method
  separator: ''
})

console.log(length.formatChain(1350))         // => "1m35cm"
console.log(length.formatChain(1350, ' '))    // => "1m 35cm"
console.log(length.formatChain(1350, ':'))    // => "1m:35cm"
```

> If you want to add a space between the number and the unit, you should use `withConvert` instead of `separator`, which can only configure the separator between chain units.

## Getting Chain Unit Array

Use the `getChainUnit` method to get the raw data, then format it however you want:

```ts
const time = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h'])

const chain = time.getChainUnit(3661000)
console.log(chain)
// [
//   { num: 1, unit: 'h', numStr: '1' },
//   { num: 1, unit: 'm', numStr: '1' },
//   { num: 1, unit: 's', numStr: '1' }
// ]

// Completely custom formatting
const customFormat = chain.map(({ numStr, unit }) => {
  const icons = { h: '⏰', m: '⏱️', s: '⏲️', ms: '' }
  return `${icons[unit]}${numStr}${unit}`
}).join(' ')

console.log(customFormat)  // => "⏰1h ⏱️1m ⏲️1s"
```

::: info Impact of fractionDigits
`SmartUnit` preserves decimals for the smallest unit, while other units don't display decimals, so they are not affected by the `fractionDigits` configuration.
:::
