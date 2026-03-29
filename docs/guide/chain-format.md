# 链式格式化

将数值格式化为多个单位的组合形式，在格式化时间上非常有用，例如 "1h30m30s"。

## 基础用法

```ts
import SmartUnit from 'smart-unit'

const time = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h'])

console.log(time.formatChain(3661000))      // => "1h1m1s"
```

## 自定义分隔符

```ts
const length = new SmartUnit(['mm', 10, 'cm', 100, 'm'], {
  // 分隔符，也可以在 formatChain 方法中指定
  separator: ''
})

console.log(length.formatChain(1350))         // => "1m35cm"
console.log(length.formatChain(1350, ' '))    // => "1m 35cm"
console.log(length.formatChain(1350, ':'))    // => "1m:35cm"
```

> 如果你希望在数值和单位之间添加空格，应该使用`withConvert`，而不是`separator`，后者只能配置链之间的分隔符。

## 获取链式单位数组

使用 `getChainUnit` 方法获取原始数据，然后根据你想要的任何方式格式化：

```ts
const time = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h'])

const chain = time.getChainUnit(3661000)
console.log(chain)
// [
//   { num: 1, unit: 'h', numStr: '1' },
//   { num: 1, unit: 'm', numStr: '1' },
//   { num: 1, unit: 's', numStr: '1' }
// ]

// 完全自定义的格式化
const customFormat = chain.map(({ numStr, unit }) => {
  const icons = { h: '⏰', m: '⏱️', s: '⏲️', ms: '' }
  return `${icons[unit]}${numStr}${unit}`
}).join(' ')

console.log(customFormat)  // => "⏰1h ⏱️1m ⏲️1s"
```

::: info fractionDigits 的影响
`SmartUnit`为最小的单位保留了小数，其他单位不显示小数，也就不受`fractionDigits`配置的影响。
:::

## 反向解析

```ts
import SmartUnit from 'smart-unit'

const time = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h'])

console.log(time.parseChain('1h1m1s'))      // => 3661000
console.log(time.parseChain('1h:1m:1s', ':'))      // => 3661000
```

使用 [`parseChain`](../api/index.md#parsechain) 方法将链式单位字符串解析回原始值。这个方法会考虑到分隔符。
最好在初始化的时候指定分隔符，这样就不用在每次解析时都指定分隔符了。

如果只是想分割数值和单位，可以使用 [`splitChainUnit`](../api/index.md#splitchainunit) 方法，它将返回一个包含数值和单位的数组，而不会计算原始值。

:::info 国际化支持
反向解析支持国际化的字符串，使用国际化后，只有使用特定语言的字符串才能被正确解析。原始单位将不再被识别。
:::

:::warning 注意
反向解析只支持使用[`formatChain`](../api/index.md#formatchain)方法生成或与之兼容的字符串。
如果是使用[`getChainUnit`](../api/index.md#splitchainunit)获取单位然后手动格式化，通常不支持。
:::