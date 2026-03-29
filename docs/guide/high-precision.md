# 高精度计算

使用 `decimal.js` 进行高精度计算，处理超出 JavaScript 安全整数范围的大数。

```ts
import SmartUnitPrecision from 'smart-unit/precision'

const precise = new SmartUnitPrecision(['B', 'KB', 'MB'], { 
  baseDigit: 1024,
})
```

## BigInt 支持

```ts
const size = new SmartUnitPrecision(['B', 'KB', 'MB', 'GB', 'TB', 'PB'], {
  baseDigit: 1024,
})

// BigInt 输入
console.log(size.format(1024n ** 6n))  // => "1024PB"
```

## 字符串输入保持精度

```ts
const size = new SmartUnitPrecision(['B', 'KB', 'MB', 'GB', 'TB', 'PB'], {
  baseDigit: 1024,
})

// 超出 Number.MAX_SAFE_INTEGER 的数值
console.log(size.format('1152921504606846976'))  // => "1024PB"
```

## 自定义 Decimal 配置

```ts
const customPrecise = new SmartUnitPrecision(['B', 'KB', 'MB'], {
  baseDigit: 1024,
  decimalOptions: {
    precision: 30,      // 设置精度为 30 位有效数字
    rounding: 4,        // 四舍五入模式
  }
})
```

::: warning 性能考虑
高精度计算比普通计算慢，仅在需要处理大数或高精度时使用。
:::
