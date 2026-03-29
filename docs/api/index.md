# SmartUnit API

## 构造函数

### `new SmartUnit(units, options?)`

创建一个单位转换器实例。

> `SmartUnit` 和 `SmartUnitPrecision` 的方法几乎一样，为了方便教程，将他们的API放在一起介绍。在有差异的地方会进行说明。标注了仅高精度模式的API将只在 `SmartUnitPrecision` 中可用。

#### 参数

**units** `(string | number)[]`

单位名称和转换比例数组

1. 如果是固定比例单位：
- 必须是字符串数组，且必须指定`options.baseDigit`

2. 如果是可变比例单位：
- **偶数索引**：单位名称（如 `'B'`, `'KB'`, `'MB'`）
- **奇数索引**：到下一单位的转换比例（如 `1024`）

**options** [`SmartUnitOptions`](./interface.md#smartunitoptions) (可选)

配置对象。

- **options.baseDigit** `number`

  基本比例

- **options.threshold** `number` 上升换单位的阈值，超出阈值时上升到下一单位，默认为`1`

- **options.fractionDigits** [`FractionDigits`](./interface.md#fractiondigits) (可选) 小数位数

  小数位数
  可以指定动态范围
  - `1` 固定小数位数，不足时补零，超出时截断
  - `'1-'` 最小小数位数，不足时补零
  - `'-3'` 最大小数位数，超出时截断
  - `'1-3'` 小数范围，不足时补零，超出时截断

- **options.separator** `string` 分隔符，用于链式单位的分隔，也可以在 `formatChain` 方法中指定

- **options.decimalOptions** `DecimalOptions` 传递给 `Decimal` 的选项，仅高精度模式可用

## 方法

### format

`format(num, fractionDigits?)` 将数值格式化为最优单位的字符串。

#### 参数

- **num** `number` 或者 [`NumPrecision`](./interface.md#numprecision) (仅高精度模式下)

**fractionDigits** [`FractionDigits`](./interface.md#fractiondigits) (可选) 小数位数，默认为 `options.fractionDigits`

### formatChain

`formatChain(num, separator?)` 将数值格式化为多个单位的组合字符串，例如 "1h1m1s"。

#### 参数

- **num** `number` 或者 [`NumPrecision`](./interface.md#numprecision) (仅高精度模式下)

**separator** `string` (可选) 分隔符，默认为 `options.separator`

#### 返回值

`string`

### getUnit

`getUnit(num, fractionDigits?)` 如果想高度自定义格式，可以使用 `getUnit` 方法获取到计算结果后按照任意方式格式化。

#### 参数

- **num** `number` 或者 [`NumPrecision`](./interface.md#numprecision) (仅高精度模式下)

**fractionDigits** [`FractionDigits`](./interface.md#fractiondigits) (可选) 小数位数，默认为 `options.fractionDigits`

#### 返回值

[`FormattedValue`](./interface.md#formattedvalue)

### getChainUnit

`getChainUnit(num)` 如果想高度自定义格式，可以使用 `getChainUnit` 方法获取到计算结果后按照任意方式格式化。

#### 参数

- **num** `number` 或者 [`NumPrecision`](./interface.md#numprecision) (仅高精度模式下)

#### 返回值

[`FormattedValue[]`](./interface.md#formattedvalue)

### parse

`parse(str)` 将带单位的字符串解析为基础单位的数值。

#### 参数

- **str** `string` 待解析的字符串

#### 返回值

`number` 或者 `Decimal` (仅高精度模式下)

### parseChain

`parseChain(str, separator?)` 将带单位的字符串解析为基础单位的数值。

#### 参数

- **str** `string` 待解析的字符串

- **separator** `string` (可选) 分隔符，默认为 `options.separator`

#### 返回值

`number` 或者 `Decimal` (仅高精度模式下)

### toBase

`toBase(num, unit)` 将指定单位的值转换为基础单位。

#### 参数

- **num** `number`或者[`NumPrecision`](./interface.md#numprecision)(仅高精度模式下)

- **unit** `string` 单位名称

#### 返回值

`number` 或者 `Decimal` (仅高精度模式下)

### splitUnit

`splitUnit(str)` 从格式化字符串中提取数值和单位。

#### 参数

- **str** `string` 待解析的字符串

#### 返回值

[`FormattedValue`](./interface.md#formattedvalue)

### splitChainUnit

`splitChainUnit(str, separator)` 将链式单位字符串分割成数值和单位。

#### 参数

- **str** `string` 待解析的字符串

- **separator** `string` 分隔符

#### 返回值

[`FormattedValue[]`](./interface.md#formattedvalue)

### fromUnitFormat

`fromUnitFormat(num, unit, fractionDigits?)` 从一种单位转换到最优单位并格式化。

#### 参数

- **num** `number` 或者 [`NumPrecision`](./interface.md#numprecision) (仅高精度模式下)

- **unit** `string` 单位名称

- **fractionDigits** [`FractionDigits`](./interface.md#fractiondigits) (可选) 小数位数，默认为 `options.fractionDigits`

#### 返回值

`string`

### formatNumber

`formatNumber(num, fractionDigits?)` 将数值按照指定小数位数格式化。

#### 参数

- **num** `number` 或者 [`NumPrecision`](./interface.md#numprecision) (仅高精度模式下)

**fractionDigits** [`FractionDigits`](./interface.md#fractiondigits) (可选) 小数位数，默认为 `options.fractionDigits`

#### 返回值

`string`

## 属性

### threshold

`number` 上升换单位的阈值，只读。

### separator

`string` 分隔符，只读。

### fractionDigits

[`FractionDigits`](./interface.md#fractiondigits) 小数位数，只读。

### unitNames

`string[]` 单位名称，只读。

### unitDigits

`number[]` 单位比例，只读。