# Common Units

## File Size

```ts
import SmartUnit from 'smart-unit'

const fileSize = new SmartUnit(['B', 'KB', 'MB', 'GB', 'TB'], {
  baseDigit: 1024,
})

fileSize.format(1024)              // => "1KB"
fileSize.format(1024 * 1024 * 100) // => "100MB"
fileSize.format(1536)              // => "1.5KB"
```

## Length

### Metric Units

```ts
// Millimeter -> Centimeter -> Meter -> Kilometer
const length = new SmartUnit(['mm', 10, 'cm', 100, 'm', 1000, 'km'])

length.format(25)           // => "2.5cm"
length.format(1500)         // => "1.5m"
length.format(1500000)      // => "1.5km"
```

### Imperial Units

```ts
// Inch -> Foot -> Yard -> Mile
const imperial = new SmartUnit(['in', 12, 'ft', 3, 'yd', 1760, 'mi'])

console.log(imperial.format(24))    // => "2ft"
console.log(imperial.format(36))    // => "1yd"
console.log(imperial.format(63360)) // => "1mi"
```

## Time

```ts
import SmartUnit from 'smart-unit'

// Millisecond -> Second -> Minute -> Hour
const time = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h'])

time.parse('90s')    // => 90000 (ms)
time.parse('2.5h')   // => 9000000 (ms)
time.parse('30m')    // => 1800000 (ms)
```

## Frequency

```ts
// Hz -> kHz -> MHz -> GHz
const freq = new SmartUnit(['Hz', 'kHz', 'MHz', 'GHz'], {
  baseDigit: 1000,
})

freq.format(2400000000)  // => "2.4GHz"
```

## Data Transfer Rate

```ts
// bps -> Kbps -> Mbps -> Gbps
const bitrate = new SmartUnit(['bps', 'Kbps', 'Mbps', 'Gbps'], {
  baseDigit: 1000,
  fractionDigits: 1,
})

bitrate.format(1500000)  // => "1.5Mbps"
```

## Financial Amount (High Precision)

```ts
const currency = new SmartUnitPrecision(['', 'K', 'M', 'B', 'T'], {
  baseDigit: 1000,
  fractionDigits: 2,
})

currency.format('12345678901234567890')  // => "12345678.90T"
```
