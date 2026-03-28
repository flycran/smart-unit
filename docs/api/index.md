# SmartUnit API

## 构造函数

### `new SmartUnit(units, options?)`

创建一个单位转换器实例。

#### 参数

**units** `(string | number)[]`

单位名称和转换比例数组：
- **偶数索引**：单位名称（如 `'B'`, `'KB'`, `'MB'`）
- **奇数索引**：到下一单位的转换比例（如 `1024`）

**options** `SmartUnitOptions` (可选)

配置对象。

#### 示例

```ts
// 使用 baseDigit 自动生成比例
const size = new SmartUnit(['B', 'KB', 'MB', 'GB'], { 
  baseDigit: 1024 
})

// 手动指定每个单位的比例
const length = new SmartUnit(['mm', 10, 'cm', 100, 'm', 1000, 'km'])

// 启用高精度模式
const precise = new SmartUnit(['B', 'KB', 'MB'], { 
  baseDigit: 1024,
  useDecimal: true 
})
```

## 方法

### `.format(num, fractionDigits?)`

将数值格式化为最优单位的字符串。

```ts
const size = new SmartUnit(['B', 'KB', 'MB'], { 
  baseDigit: 1024, 
  fractionDigits: 2 
})

size.format(1536)           // => "1.50KB"
size.format(1536, 0)        // => "2KB"
size.format(1536, '1-3')    // => "1.5KB"
```

### `.parse(str)`

将带单位的字符串解析为基础单位的数值。

```ts
const size = new SmartUnit(['B', 'KB', 'MB'], { baseDigit: 1024 })

size.parse('1.5KB')  // => 1536
size.parse('2MB')    // => 2097152
```

### `.getUnit(num)`

获取最优单位和转换后的值（不进行格式化）。

```ts
const size = new SmartUnit(['B', 'KB', 'MB'], { baseDigit: 1024 })

size.getUnit(1536)
// => { num: 1.5, unit: 'KB', numStr: '1.5' }
```

### `.toBase(num, unit)`

将指定单位的值转换为基础单位。

```ts
const length = new SmartUnit(['mm', 10, 'cm', 100, 'm'])

length.toBase(1.5, 'm')   // => 1500 (mm)
length.toBase(100, 'cm')  // => 1000 (mm)
```

### `.splitUnit(str)`

从格式化字符串中提取数值和单位。

```ts
const size = new SmartUnit(['B', 'KB', 'MB'], { baseDigit: 1024 })

size.splitUnit('1.5KB')  // => { num: 1.5, unit: 'KB' }
```

### `.fromUnitFormat(num, unit, fractionDigits?)`

从一种单位转换到最优单位并格式化。

```ts
const length = new SmartUnit(['mm', 10, 'cm', 100, 'm', 1000, 'km'])

length.fromUnitFormat(1500, 'm')  // => "1.5km"
```

### `.formatChain(num, separator?)`

将数值格式化为多个单位的组合字符串。

```ts
const time = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h'])

time.formatChain(3661000)      // => "1h1m1s"
time.formatChain(3661000, ' ') // => "1h 1m 1s"
```

### `.getChainUnit(num)`

获取链式单位数组（不格式化）。

```ts
const time = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h'])

time.getChainUnit(3661000)
// => [
//   { num: 1, unit: 'h', numStr: '1' },
//   { num: 1, unit: 'm', numStr: '1' },
//   { num: 1, unit: 's', numStr: '1' }
// ]
```

### `.withConvert(convertFn)`

添加单位转换函数（用于国际化等场景）。

```ts
const size = new SmartUnit(['B', 'KB', 'MB'], { baseDigit: 1024 })

const zhSize = size.withConvert((unit) => {
  const map = { B: '字节', KB: '千字节', MB: '兆字节' }
  return map[unit] || unit
})

zhSize.format(1536)  // => "1.5 千字节"
```
