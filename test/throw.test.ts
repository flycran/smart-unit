import { describe, expect, it } from 'vitest'
import SmartUnit, { ERROR_NAN_INPUT } from '../src'

describe('Error handling tests', () => {
  const su = new SmartUnit(['mm', 10, 'cm'])
  // 未提供有效的单位集
  describe('Invalid units configuration', () => {
    it('should throw an error if units array is empty', () => {
      expect(() => new SmartUnit([])).toThrow('units is empty.')
    })
  })

  // 非法的单位集
  describe('Invalid units configuration', () => {
    it('should throw an error if units array length is odd', () => {
      expect(() => new SmartUnit(['mm', 'cm'])).toThrow(
        'The unit setting is incorrect; the element at index [1] should be of numeric type.',
      )
    })
  })

  describe('getUnit', () => {
    // 意外的NaN输入
    it('should throw error for unintentional NaN input', () => {
      expect(() => su.getUnit(NaN)).toThrow(ERROR_NAN_INPUT)
    })
  })

  describe('fromUnit', () => {
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
    // 无效的单位
    it('should throw error for invalid unit', () => {
      expect(() => su.splitUnit('123invalid')).toThrow('Undefined unit: "123invalid".')
      expect(() => su.splitUnit('')).toThrow('Undefined unit: "".')
    })
    // 无效的数值
    it('should throw error for invalid number', () => {
      expect(() => su.splitUnit('invalidmm')).toThrow('Invalid number: "invalid".')
    })
  })

  // 无效的单位
  describe('Chain unit', () => {
    it('should handle empty string', () => {
      expect(() => su.splitChainUnit('123invalid')).toThrow('Undefined unit: "123invalid".')
      expect(() => su.splitChainUnit('')).toThrow('Undefined unit: "".')
    })
    // 无效的数值
    it('should throw error for invalid number', () => {
      expect(() => su.splitChainUnit('invalidmm')).toThrow('Invalid number: "invalid".')
    })
  })

  // 字符串解析错误
  describe('String parsing error', () => {
    const su = new SmartUnit(['mm', 10, 'cm', 100, 'm'])

    // 无效单位字符串
    it('should throw error for invalid unit in string', () => {
      expect(() => su.parse('100invalid')).toThrow('Undefined unit: "100invalid".')
      expect(() => su.parse('100')).toThrow('Undefined unit: "100".')
      expect(() => su.parse('')).toThrow('Undefined unit: "".')
    })

    // 无效的数值
    it('should throw error for invalid number', () => {
      expect(() => su.parse('invalidmm')).toThrow('Invalid number: "invalid".')
    })
  })

  // 链式单位解析错误
  describe('Chain unit parsing error', () => {
    const su = new SmartUnit(['mm', 10, 'cm', 100, 'm'])

    // 无效单位字符串
    it('should throw error for invalid unit in string', () => {
      expect(() => su.parseChain('100invalid')).toThrow('Undefined unit: "100invalid".')
      expect(() => su.parseChain('100')).toThrow('Undefined unit: "100".')
      expect(() => su.parseChain('')).toThrow('Undefined unit: "".')
    })
    // 无效的数值
    it('should throw error for invalid number', () => {
      expect(() => su.parseChain('invalidmm')).toThrow('Invalid number: "invalid".')
      expect(() => su.parseChain('10cminvalidmm')).toThrow('Invalid number: "invalid".')
    })
  })
})
