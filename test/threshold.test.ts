import { describe, expect, it } from 'vitest'
import SmartUnit from '../src'

// 阈值测试
describe('Threshold tests', () => {
  // 默认阈值为1，达到进制倍数时进位
  it('should use default threshold of 1', () => {
    const su = new SmartUnit(['B', 'KB', 'MB'], { baseDigit: 1024 })
    expect(su.format(1024)).toEqual('1KB')
    expect(su.format(1023)).toEqual('1023B')
  })

  // 自定义阈值为0.5，超过一半进制倍数时进位
  it('should use custom threshold of 0.5', () => {
    const su = new SmartUnit(['B', 'KB', 'MB'], {
      baseDigit: 1024,
      threshold: 0.5,
    })
    expect(su.format(512)).toEqual('0.5KB')
    expect(su.format(511)).toEqual('511B')
  })

  // 阈值为2，需要两倍进制倍数才进位
  it('should use custom threshold of 2', () => {
    const su = new SmartUnit(['B', 'KB', 'MB'], {
      baseDigit: 1024,
      threshold: 2,
    })
    expect(su.format(2048)).toEqual('2KB')
    expect(su.format(2047)).toEqual('2047B')
  })
})
