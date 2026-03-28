# 高精度计算

使用 `decimal.js` 进行高精度计算，处理超出 JavaScript 安全整数范围的大数。

## 启用高精度

```ts
import SmartUnit from 'smart-unit'

const precise = new SmartUnit(['B', 'KB', 'MB'], { 
  baseDigit: 1024,
  useDecimal: true 
})
```

## BigInt 支持

```ts
const size = new SmartUnit(['B', 'KB', 'MB', 'GB'], {
  baseDigit: 1024,
  useDecimal: true,
})

// BigInt 输入
console.log(size.format(1024n ** 3n))  // => "1GB"

// 超大 BigInt
const bigValue = 123456789012345678901234567890n
console.log(size.format(bigValue))  // => "123456789012345678.90GB"
```

## 字符串输入保持精度

```ts
const currency = new SmartUnit(['', 'K', 'M', 'B', 'T'], {
  baseDigit: 1000,
  useDecimal: true,
  fractionDigits: 2,
})

// 超出 Number.MAX_SAFE_INTEGER 的数值
const hugeAmount = '123456789012345678901234567890'
console.log(currency.format(hugeAmount))  // => "123456789012345678.90T"
```

## 自定义 Decimal 配置

```ts
const customPrecise = new SmartUnit(['B', 'KB', 'MB'], {
  baseDigit: 1024,
  useDecimal: true,
  decimalOptions: {
    precision: 30,      // 设置精度为 30 位有效数字
    rounding: 4,        // 四舍五入模式
  }
})
```

::: warning 性能考虑
高精度计算比普通计算慢，仅在需要处理大数或高精度时使用。
:::
