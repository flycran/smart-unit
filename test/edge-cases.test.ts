import { describe, expect, it } from 'vitest'
import SmartUnit from '../src'

// 边界值测试
describe('Edge case tests', () => {
  const su = new SmartUnit(['mm', 10, 'cm', 100, 'm', 1e3, 'km'])

  // 零值处理
  it('should handle zero value', () => {
    expect(su.format(0)).toEqual('0mm')
    expect(su.getUnit(0)).toEqual({ num: 0, numStr: '0', unit: 'mm' })
  })

  // 极小值处理
  it('should handle very small values', () => {
    expect(su.format(0.001)).toEqual('0.001mm')
    expect(su.format(0.0001)).toEqual('0.0001mm')
  })

  // 极大值处理
  it('should handle very large values', () => {
    expect(su.format(1e12)).toEqual('1000000km')
    expect(su.format(1e15)).toEqual('1000000000km')
  })

  // 单位边界值
  it('should handle boundary values between units', () => {
    expect(su.format(9)).toEqual('9mm')
    expect(su.format(10)).toEqual('1cm')
    expect(su.format(99)).toEqual('9.9cm')
    expect(su.format(100)).toEqual('10cm')
  })

  // 负数处理
  it('should handle negative values', () => {
    expect(su.format(-10)).toEqual('-1cm')
    expect(su.format(-1000)).toEqual('-1m')
    expect(su.getUnit(-100)).toEqual({ num: -10, numStr: '-10', unit: 'cm' })
  })
})

// 单单位系统测试
describe('Single unit system tests', () => {
  const su = new SmartUnit(['unit'])

  it('should handle single unit system', () => {
    expect(su.format(100)).toEqual('100unit')
    expect(su.format(0)).toEqual('0unit')
  })
})

// 空字符串单位测试
describe('Empty string unit tests', () => {
  const su = new SmartUnit(['', 'k', 'M', 'G'], { baseDigit: 1000 })

  it('should handle empty string as base unit', () => {
    expect(su.format(1)).toEqual('1')
    expect(su.format(1000)).toEqual('1k')
    expect(su.format(1000000)).toEqual('1M')
  })
})
