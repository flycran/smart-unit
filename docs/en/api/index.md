# SmartUnit API

## Constructor

### `new SmartUnit(units, options?)`

Creates a new unit converter instance.

> `SmartUnit` and `SmartUnitPrecision` have almost the same methods. For convenience, their APIs are documented together. Differences will be noted where applicable. APIs marked as "high-precision mode only" are only available in `SmartUnitPrecision`.

#### Parameters

**units** `(string | number)[]`

Array of unit names and conversion ratios

1. For fixed ratio units:
   - Must be a string array, and `options.baseDigit` must be specified

2. For variable ratio units:
   - **Even indices**: Unit names (e.g., `'B'`, `'KB'`, `'MB'`)
   - **Odd indices**: Conversion ratios to the next unit (e.g., `1024`)

**options** [`SmartUnitOptions`](./interface.md#smartunitoptions) (Optional)

Configuration object.

- **options.baseDigit** `number`

  Base ratio

- **options.threshold** `number` Threshold for unit switching. When the threshold is exceeded, it rises to the next unit. Default is `1`

- **options.fractionDigits** [`FractionDigits`](./interface.md#fractiondigits) (Optional) Number of decimal places

  Can specify a dynamic range:
  - `1` - Fixed decimal places, pad with zeros if insufficient, truncate if exceeded
  - `'1-'` - Minimum decimal places, pad with zeros if insufficient
  - `'-3'` - Maximum decimal places, truncate if exceeded
  - `'1-3'` - Decimal range, pad with zeros if below minimum, truncate if above maximum

- **options.separator** `string` Separator for chain unit formatting, can also be specified in the `formatChain` method

- **options.decimalOptions** `DecimalOptions` Options passed to `Decimal`, only available in high-precision mode

## Methods

### format

`format(num, fractionDigits?)` Formats a number as a string with the optimal unit.

#### Parameters

- **num** `number` or [`NumPrecision`](./interface.md#numprecision) (only in high-precision mode)

**fractionDigits** [`FractionDigits`](./interface.md#fractiondigits) (Optional) Number of decimal places, defaults to `options.fractionDigits`

### getUnit

`getUnit(num, fractionDigits?)` If you want highly customized formatting, you can use the `getUnit` method to get the calculation result and format it however you want.

#### Parameters

- **num** `number` or [`NumPrecision`](./interface.md#numprecision) (only in high-precision mode)

**fractionDigits** [`FractionDigits`](./interface.md#fractiondigits) (Optional) Number of decimal places, defaults to `options.fractionDigits`

#### Returns

[`FormattedValue`](./interface.md#formattedvalue)

### formatChain

`formatChain(num, separator?)` Formats a number as a string combining multiple units, e.g., "1h1m1s".

#### Parameters

- **num** `number` or [`NumPrecision`](./interface.md#numprecision) (only in high-precision mode)

**separator** `string` (Optional) Separator, defaults to `options.separator`

#### Returns

`string`

### getChainUnit

`getChainUnit(num)` If you want highly customized formatting, you can use the `getChainUnit` method to get the calculation result and format it however you want.

#### Parameters

- **num** `number` or [`NumPrecision`](./interface.md#numprecision) (only in high-precision mode)

#### Returns

[`FormattedValue[]`](./interface.md#formattedvalue)

### parse

`parse(str)` Parses a string with unit into a base unit numeric value.

#### Parameters

- **str** `string` String to parse

#### Returns

`number` or `Decimal` (only in high-precision mode)


### `parseChain(str, separator?)`

Parses a string with chain units into a base unit numeric value.

#### Parameters

- **str** `string` String to parse

- **separator** `string` (Optional) Separator, defaults to `options.separator`

#### Returns

`number` or `Decimal` (only in high-precision mode)

### toBase

`toBase(num, unit)` Converts a value from the specified unit to the base unit.

#### Parameters

- **num** `number` or [`NumPrecision`](./interface.md#numprecision) (only in high-precision mode)

- **unit** `string` Unit name

#### Returns

`number` or `Decimal` (only in high-precision mode)

### splitUnit

`splitUnit(str)` Extracts the numeric value and unit from a formatted string.

#### Parameters

- **str** `string` String to parse

#### Returns

[`FormattedValue`](./interface.md#formattedvalue)

### splitChainUnit

`splitChainUnit(str, separator)` Splits a chain unit string into numbers and units.

#### Parameters

- **str** `string` String to parse

- **separator** `string` Separator

#### Returns

[`FormattedValue[]`](./interface.md#formattedvalue)

### fromUnitFormat

`fromUnitFormat(num, unit, fractionDigits?)` Converts a value from the original unit to the optimal unit and formats it.

#### Parameters

- **num** `number` or [`NumPrecision`](./interface.md#numprecision) (only in high-precision mode)

- **unit** `string` Unit name

- **fractionDigits** [`FractionDigits`](./interface.md#fractiondigits) (Optional) Number of decimal places, defaults to `options.fractionDigits`

#### Returns

`string`

### formatNumber

`formatNumber(num, fractionDigits?)` Formats a number with the specified decimal places.

#### Parameters

- **num** `number` or [`NumPrecision`](./interface.md#numprecision) (only in high-precision mode)

**fractionDigits** [`FractionDigits`](./interface.md#fractiondigits) (Optional) Number of decimal places, defaults to `options.fractionDigits`

#### Returns

`string`

## Properties

### threshold

`number` Threshold for unit switching, read-only.

### separator

`string` Separator, read-only.

### fractionDigits

[`FractionDigits`](./interface.md#fractiondigits) Number of decimal places, read-only.

### unitNames

`string[]` Unit names, read-only.

### unitDigits

`number[]` Unit ratios, read-only.
