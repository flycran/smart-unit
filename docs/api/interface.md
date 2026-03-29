# 接口

## SmartUnitOptions

配置选项接口。

```ts
interface SmartUnitOptions {
  baseDigit?: number          // 自动生成比例
  threshold?: number          // 单位切换阈值（默认：1）
  fractionDigits?: number | string  // 小数位数
  decimalOptions?: object     // Decimal.js 配置 只在高精度模式下有效
}
```

## FormattedValue

格式化结果接口。

```ts
interface FormattedValue<U extends string> {
  num: number           // 数值
  unit: U               // 单位
  numStr: string       // 格式化后的数字字符串
  decimal?: Decimal     // Decimal 实例（仅高精度模式）
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

## NumPrecision

```ts
type NumPrecision = Num | string | bigint | Decimal
```

# 工具泛型

## GetUnitNames

传入SmartUnit实例，返回单位名称的联合类型。

```ts
type GetUnitNames<SU extends SmartUnitBase<any>>
```
