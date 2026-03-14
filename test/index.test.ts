import { describe, expect, it } from 'vitest';
import SmartUnit from '../src';

// 自定义进位测试 距离单位
describe('Custom base conversion - distance units', () => {
  const su = new SmartUnit(['mm', 10, 'cm', 100, 'm', 1e3, 'km'])

  it('10', () => {
    expect(su.format(10)).toEqual('1cm')
  })
  it('100', () => {
    expect(su.format(100)).toEqual('10cm')
  })
  it('1000', () => {
    expect(su.format(1000)).toEqual('1m')
  })
  it('10000', () => {
    expect(su.format(10000)).toEqual('10m')
  })
  it('1000000', () => {
    expect(su.format(1000000)).toEqual('1km')
  })
})

// 自动进位测试 度量缩写
describe('Auto base conversion - metric prefixes', () => {
  const su = new SmartUnit(['', 'k', 'M', 'G', 'T'], {
    baseDigit: 1000,
  })

  it('1e2', () => {
    expect(su.format(1e2)).toEqual('100')
  })
  it('1e4', () => {
    expect(su.format(1e4)).toEqual('10k')
  })
  it('1e6', () => {
    expect(su.format(1e6)).toEqual('1M')
  })
  it('1e9', () => {
    expect(su.format(1e9)).toEqual('1G')
  })
  it('1e13', () => {
    expect(su.format(1e13)).toEqual('10T')
  })
})

// 小数测试
describe('Decimal formatting tests', () => {
  const su = new SmartUnit(['byte', 'KB', 'MB', 'GB'], {
    baseDigit: 1024,
  })

  // 不带小数
  it('should format without fixed decimals', () => {
    expect(su.format(1024 * 1024 * 12.34)).toEqual('12.34MB')
  })
  // 带固定小数
  it('should format with fixed decimals', () => {
    expect(su.format(1024 * 1024 * 12.34, 1)).toEqual('12.3MB')
  })
  // 带小数范围(-3)
  it('should format with decimal range (-3)', () => {
    expect(su.format(1024 * 1024 * 12.34, '-3')).toEqual('12.34MB')
  })
  // 带小数范围(3-)
  it('should format with decimal range (3-)', () => {
    expect(su.format(1024 * 1024 * 12.34, '3-')).toEqual('12.340MB')
  })
  // 带小数范围(1-3)
  it('should format with decimal range (1-3)', () => {
    expect(su.format(1024 * 1024 * 12.34, '1-3')).toEqual('12.34MB')
  })
  it('getUnit', () => {
    expect(su.getUnit(1024 * 1024 * 1000)).toEqual({
      num: 1000,
      unit: 'MB',
    })
  })
})

// 逆向测试
describe('Reverse conversion tests', () => {
  const su = new SmartUnit(['mm', 10, 'cm', 100, 'm', 1e3, 'km'])

  it('1cm', () => {
    expect(su.toBase(1, 'cm')).toEqual(10)
  })
  it('10cm', () => {
    expect(su.toBase(10, 'cm')).toEqual(100)
  })
  it('1m', () => {
    expect(su.toBase(1, 'm')).toEqual(1e3)
  })
  it('10m', () => {
    expect(su.toBase(10, 'm')).toEqual(1e4)
  })
  it('1km', () => {
    expect(su.toBase(1, 'km')).toEqual(1e6)
  })
})

// 逆向测试 自动识别单位
describe('Reverse conversion with auto unit detection', () => {
  const su = new SmartUnit(['mm', 10, 'cm', 100, 'm', 1e3, 'km'])

  it('1cm', () => {
    expect(su.parse('1cm')).toEqual(10)
  })
  it('10cm', () => {
    expect(su.parse('10cm')).toEqual(100)
  })
  it('1m', () => {
    expect(su.parse('1m')).toEqual(1e3)
  })
  it('10m', () => {
    expect(su.parse('10m')).toEqual(1e4)
  })
  it('1km', () => {
    expect(su.parse('1km')).toEqual(1e6)
  })
})
