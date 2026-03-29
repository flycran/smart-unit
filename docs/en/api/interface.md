# Interfaces

## SmartUnitOptions

Configuration options interface.

```ts
interface SmartUnitOptions {
  baseDigit?: number          // Auto-generate ratios
  threshold?: number          // Threshold for unit switching (default: 1)
  fractionDigits?: number | string  // Number of decimal places
  decimalOptions?: object     // Decimal.js configuration (only valid in high-precision mode)
}
```

## FormattedValue

Formatted result interface.

```ts
interface FormattedValue<U extends string> {
  num: number           // Numeric value
  decimal?: Decimal     // Decimal instance (only in high-precision mode)
  unit: U               // Unit
  numStr?: string       // Formatted number string
}
```

## FractionDigits

Decimal places configuration type.

```ts
type FractionDigits =
  | number              // Fixed decimal places
  | `-${number}`        // Only set maximum value
  | `${number}-`        // Only set minimum value
  | `${number}-${number}`  // Set range
  | undefined
```

## NumPrecision

```ts
type NumPrecision = Num | string | bigint | Decimal
```

# Utility Types

## GetUnitNames

Pass a SmartUnit instance to return the union type of unit names.

```ts
type GetUnitNames<SU extends SmartUnitBase<any>>
```
