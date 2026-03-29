import { describe, expect, it } from 'vitest'
import SmartUnit from '../src'

// fromUnitFormat 方法测试
describe('fromUnitFormat method tests', () => {
  const su = new SmartUnit(['mm', 10, 'cm', 100, 'm', 1e3, 'km'])

  // 从cm转换为最佳单位
  it('should convert from cm to optimal unit', () => {
    expect(su.fromUnitFormat(100, 'cm')).toEqual('1m')
    expect(su.fromUnitFormat(10, 'cm')).toEqual('10cm')
    expect(su.fromUnitFormat(1000, 'cm')).toEqual('10m')
  })

  // 从km转换为更小单位
  it('should convert from km to smaller units', () => {
    expect(su.fromUnitFormat(0.001, 'km')).toEqual('1m')
    expect(su.fromUnitFormat(0.0001, 'km')).toEqual('10cm')
  })

  // 带小数精度参数
  it('should support decimal place parameter', () => {
    expect(su.fromUnitFormat(123.456, 'cm', 1)).toEqual('1.2m')
    expect(su.fromUnitFormat(123.456, 'cm', 2)).toEqual('1.23m')
  })
})
