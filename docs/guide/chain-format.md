# 链式格式化

将数值格式化为多个单位的组合形式，例如 "1h30m" 或 "1m30cm"。

## 基础用法

```ts
import SmartUnit from 'smart-unit'

const time = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h'])

// 默认无分隔符
console.log(time.formatChain(3661000))      // => "1h1m1s"

// 使用空格分隔
console.log(time.formatChain(3661000, ' ')) // => "1h 1m 1s"

// 使用冒号分隔
console.log(time.formatChain(3661000, ':')) // => "1h:1m:1s"
```

## 自定义分隔符

```ts
const length = new SmartUnit(['mm', 10, 'cm', 100, 'm'])

console.log(length.formatChain(1350))         // => "1m35cm"
console.log(length.formatChain(1350, ' '))    // => "1m 35cm"
console.log(length.formatChain(1350, '_'))    // => "1m_35cm"
```

## 获取链式单位数组

使用 `getChainUnit` 方法获取原始数据，然后自定义格式化：

```ts
const time = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h'])

const chain = time.getChainUnit(3661000)
console.log(chain)
// [
//   { num: 1, unit: 'h', numStr: '1' },
//   { num: 1, unit: 'm', numStr: '1' },
//   { num: 1, unit: 's', numStr: '1' }
// ]

// 完全自定义的格式化
const customFormat = chain.map(({ numStr, unit }) => {
  const icons = { h: '⏰', m: '⏱️', s: '⏲️' }
  return `${icons[unit]}${numStr}${unit}`
}).join(' ')

console.log(customFormat)  // => "⏰1h ⏱️1m ⏲️1s"
```

::: info fractionDigits 的影响
`fractionDigits` 配置会影响链式中每个单位的显示精度。
:::

## 实际应用场景

### 倒计时器

```ts
class CountdownTimer {
  private formatter = new SmartUnit(['s', 60, 'm', 60, 'h', 24, 'd'])

  format(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}秒`
    }
    return this.formatter.formatChain(seconds, ' ')
  }

  formatVerbose(seconds: number): string {
    const chain = this.formatter.getChainUnit(seconds)
    const labels = { s: '秒', m: '分', h: '小时', d: '天' }
    
    return chain.map(({ numStr, unit }) => {
      return `${numStr}${labels[unit]}`
    }).join('')
  }
}

// 使用
const timer = new CountdownTimer()
console.log(timer.format(3665))        // => "1h 1m 5s"
console.log(timer.formatVerbose(3665)) // => "1 小时 1 分 5 秒"
```

### 身高体重测量

```ts
class BodyMeasurements {
  private height = new SmartUnit(['cm', 100, 'm'])

  formatHeight(cm: number): string {
    const chain = this.height.getChainUnit(cm)
    
    // 只显示最大的两个单位
    if (chain.length > 1) {
      const meters = chain.find(item => item.unit === 'm')
      const cms = chain.find(item => item.unit === 'cm')
      
      const parts = []
      if (meters) parts.push(`${meters.num}米`)
      if (cms && cms.num > 0) parts.push(`${cms.num}厘米`)
      
      return parts.join('')
    }
    
    return `${cm}厘米`
  }
}

// 使用
const measurements = new BodyMeasurements()
console.log(measurements.formatHeight(175))   // => "1 米 75 厘米"
console.log(measurements.formatHeight(180))   // => "1 米 80 厘米"
console.log(measurements.formatHeight(50))    // => "50 厘米"
```

### 烹饪计时器

```ts
class CookingTimer {
  private time = new SmartUnit(['s', 60, 'm'])

  format(seconds: number): string {
    const chain = this.time.getChainUnit(seconds)
    
    // 只取分钟和秒
    const minutes = chain.find(item => item.unit === 'm')?.num || 0
    const secs = chain.find(item => item.unit === 's')?.num || 0
    
    // 格式化为 MM:SS
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  formatText(seconds: number): string {
    const chain = this.time.getChainUnit(seconds)
    const labels = { s: '秒', m: '分钟' }
    
    return chain.map(({ numStr, unit }) => {
      return `${numStr}${labels[unit]}`
    }).join('')
  }
}

// 使用
const cooking = new CookingTimer()
console.log(cooking.format(125))      // => "02:05"
console.log(cooking.formatText(125))  // => "2 分钟 5 秒"
console.log(cooking.format(3665))     // => "61:05"
```

### 项目进度追踪

```ts
class ProjectTimeline {
  private duration = new SmartUnit(['m', 60, 'h', 8, 'd'])

  formatWorkMinutes(minutes: number): string {
    const chain = this.duration.getChainUnit(minutes)
    
    // 过滤掉 0 值
    const nonZeroChain = chain.filter(item => item.num > 0)
    
    // 只取最大的两个单位
    const topTwo = nonZeroChain.slice(-2)
    
    const labels = { m: '分钟', h: '小时', d: '天' }
    
    return topTwo.map(({ numStr, unit }) => {
      return `${numStr}${labels[unit]}`
    }).join('')
  }
}

// 使用
const timeline = new ProjectTimeline()
console.log(timeline.formatWorkMinutes(525))   // => "1 天 1 小时"
console.log(timeline.formatWorkMinutes(125))   // => "2 小时 5 分钟"
console.log(timeline.formatWorkMinutes(45))    // => "45 分钟"
```

## 结合国际化使用

```ts
const time = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h'])

// 创建中文版
const zhTime = time.withConvert((unit) => {
  const map = { 
    ms: '毫秒', 
    s: '秒', 
    m: '分钟', 
    h: '小时' 
  }
  return map[unit] || unit
})

console.log(zhTime.formatChain(3661000, ' '))  
// => "1 小时 1 分钟 1 秒"

// 创建日文版
const jaTime = time.withConvert((unit) => {
  const map = { 
    ms: 'ミリ秒', 
    s: '秒', 
    m: '分', 
    h: '時間' 
  }
  return map[unit] || unit
})

console.log(jaTime.formatChain(3661000, ''))  
// => "1 時間 1 分 1 秒"
```

## 高精度链式格式化

```ts
const preciseTime = new SmartUnit(
  ['ns', 1000, 'μs', 1000, 'ms', 1000, 's'],
  { useDecimal: true }
)

// BigInt 输入
console.log(preciseTime.formatChain(3661000000000n))  
// => "1h1m1s"

// 超大数值
console.log(preciseTime.formatChain('1000000000000000000'))  
// => "277777h46m40s"
```

## 注意事项

::: info fractionDigits 的影响
`fractionDigits` 配置会影响链式中每个单位的显示精度：

```ts
const time = new SmartUnit(['ms', 1000, 's', 60, 'm'], {
  fractionDigits: 2
})

console.log(time.formatChain(90123))  
// => "1m30.12s" (秒保留 2 位小数)
:::
