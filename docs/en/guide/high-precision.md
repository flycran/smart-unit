# High Precision

Use `decimal.js` for high-precision calculations to handle numbers beyond JavaScript's safe integer range.

```ts
import SmartUnitPrecision from 'smart-unit/precision'

const precise = new SmartUnitPrecision(['B', 'KB', 'MB'], { 
  baseDigit: 1024,
})
```

## BigInt Support

```ts
const size = new SmartUnitPrecision(['B', 'KB', 'MB', 'GB', 'TB', 'PB'], {
  baseDigit: 1024,
})

// BigInt input
console.log(size.format(1024n ** 6n))  // => "1024PB"
```

## String Input Preserving Precision

```ts
const size = new SmartUnitPrecision(['B', 'KB', 'MB', 'GB', 'TB', 'PB'], {
  baseDigit: 1024,
})

// Values exceeding Number.MAX_SAFE_INTEGER
console.log(size.format('1152921504606846976'))  // => "1024PB"
```

## Custom Decimal Configuration

```ts
const customPrecise = new SmartUnitPrecision(['B', 'KB', 'MB'], {
  baseDigit: 1024,
  decimalOptions: {
    precision: 30,      // Set precision to 30 significant digits
    rounding: 4,        // Rounding mode
  }
})
```

::: warning Performance Considerations
High-precision calculations are slower than regular calculations. Use only when handling large numbers or high precision is required.
:::
