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
