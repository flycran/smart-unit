import SmartUnit, { type GetUnitNames } from 'smart-unit'
import SmartUnitPrecision from 'smart-unit/precision'

// File size formatting
const fileSize = new SmartUnit(['B', 'KB', 'MB', 'GB', 'TB', 'PB'], {
  baseDigit: 1024,
})

console.log('=== File Size Examples ===')
console.log(fileSize.format(1024)) // 1KB
console.log(fileSize.format(1024 * 1024 * 100)) // 100MB
console.log(fileSize.format(1536)) // 1.5KB
console.log(fileSize.format(1024 * 1024 * 1024 * 5)) // 5GB
console.log(fileSize.parse('2MB'))

// Length units with variable ratios
const length = new SmartUnit(['mm', 10, 'cm', 100, 'm', 1000, 'km'])

console.log('\n=== Length Examples ===')
console.log(length.format(1500)) // 1.5m
console.log(length.format(1500000)) // 1.5km
console.log(length.format(25)) // 2.5cm

// Parse unit strings
const time = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h'])

// type
type TimeUnits = GetUnitNames<typeof time>

console.log('\n=== Parse Examples ===')
console.log(time.parse('90s'), 'ms') // 90000 ms
console.log(time.parse('2.5h'), 'ms') // 9000000 ms
console.log(time.parse('30m'), 'ms') // 1800000 ms

// High-precision mode with BigInt
const bigLength = new SmartUnitPrecision(['pm', 1000, 'nm', 1000, 'μm', 1000, 'mm', 1000, 'm'])

console.log('\n=== High Precision Examples ===')
console.log(bigLength.format('1000')) // 1nm
console.log(bigLength.format('1000000')) // 1μm

// BigInt support - beyond JS safe integer limit
const bigNumber = 123456789012345678901234567890n
console.log('\nBigInt input:', bigNumber.toString())
console.log('Formatted:', bigLength.format(bigNumber))

// Financial calculations
const currency = new SmartUnitPrecision(['', 'K', 'M', 'B', 'T'], {
  baseDigit: 1000,
  fractionDigits: 2,
})

console.log('\n=== Financial Examples ===')
console.log(currency.format('12345678901234567890')) // 12345678.90T

// i18n support
const i18nMap = {
  ms: 'ms',
  s: 'seconds',
  m: 'minutes',
  h: 'hours',
}
const t = (unit: keyof typeof i18nMap) => i18nMap[unit]

const timeI18n = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h'], {
  separator: ' ',
}).withConvert(t)

console.log('\n=== i18n Examples ===')
console.log(timeI18n.formatChain(90000)) // 1minutes 30seconds
console.log(timeI18n.formatChain(9000000)) // 2hours 30minutes
