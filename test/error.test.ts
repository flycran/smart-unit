import { describe, expect, it } from 'vitest'
import SmartUnit, { ERROR_HIGH_PRECISION_NOT_ENABLED, ERROR_NAN_INPUT } from '../src'

describe('Error handling tests', () => {
  // 未提供有效的单位集
  describe('Invalid units configuration', () => {
    it('should throw an error if units array is empty', () => {
      expect(() => new SmartUnit([])).toThrow('units is empty.')
    })
  })

  describe('getUnit', () => {
    const su = new SmartUnit(['mm', 10, 'cm'])

    // 意外的NaN输入
    it('should throw error for unintentional NaN input', () => {
      expect(() => su.getUnit(NaN)).toThrow(ERROR_NAN_INPUT)
    })

    // 有意的NaN输入
    it('should allow intentional NaN input when configured', () => {
      SmartUnit.ignoreNaNInputs = true
      expect(() => su.getUnit(NaN)).not.toThrow()
      SmartUnit.ignoreNaNInputs = false // Reset for other tests
    })

    // 未开启高精度模式
    it('should throw error when high precision is not enabled', () => {
      // @ts-expect-error
      expect(() => su.getUnit('123')).toThrow(ERROR_HIGH_PRECISION_NOT_ENABLED)
    })
  })

  describe('fromUnit', () => {
    const su = new SmartUnit(['mm', 10, 'cm'])

    // 意外的NaN输入
    it('should throw error for unintentional NaN input', () => {
      expect(() => su.toBase(NaN, 'mm')).toThrow(ERROR_NAN_INPUT)
    })

    // 无效的单位
    it('should throw error for invalid unit', () => {
      // @ts-expect-error
      expect(() => su.toBase(100, 'invalidUnit')).toThrow('Undefined unit: "invalidUnit".')
    })
  })

  describe('splitUnit', () => {
    const su = new SmartUnit(['mm', 10, 'cm'])

    // 无效的单位
    it('should throw error for invalid unit', () => {
      expect(() => su.splitUnit('123invalid')).toThrow('Undefined unit: "123invalid".')
    })
  })

  // 字符串解析错误测试
  describe('String parsing error tests', () => {
    const su = new SmartUnit(['mm', 10, 'cm', 100, 'm'])

    // 无效单位字符串
    it('should throw error for invalid unit in string', () => {
      expect(() => su.parse('100invalid')).toThrow('Undefined unit: "100invalid".')
    })

    // 纯数字字符串
    it('should throw error for number-only string', () => {
      expect(() => su.parse('100')).toThrow('Undefined unit: "100".')
    })

    // 空字符串
    it('should throw error for empty string', () => {
      expect(() => su.parse('')).toThrow('Undefined unit: "".')
    })
  })
})
