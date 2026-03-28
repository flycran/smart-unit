# 接口

## SmartUnitOptions

配置选项接口。

```ts
interface SmartUnitOptions {
  baseDigit?: number          // 自动生成比例
  threshold?: number          // 单位切换阈值（默认：1）
  fractionDigits?: number | string  // 小数位数
  useDecimal?: boolean        // 启用高精度模式
  decimalOptions?: object     // Decimal.js 配置
}
```

## FormattedValue

格式化结果接口。

```ts
interface FormattedValue<U extends string> {
  num: number           // 数值
  decimal?: Decimal     // Decimal 实例（高精度模式）
  unit: U               // 单位
  numStr?: string       // 格式化后的数字字符串
}
```

## FractionDigits

小数位数配置类型。

```ts
type FractionDigits =
  | number              // 固定小数位
  | `-${number}`        // 只设置最大值
  | `${number}-`        // 只设置最小值
  | `${number}-${number}`  // 设置范围
  | undefined
```
