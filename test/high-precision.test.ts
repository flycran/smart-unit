import Decimal from 'decimal.js'
import { describe, expect, it } from 'vitest'
import { SmartUnit } from '../src/index'
import SmartUnitPrecision from '../src/precision'

// 精度安全测试
describe('High precision safety tests', () => {
  const su = new SmartUnit(['mm', 10, 'cm', 100, 'm', 1e3, 'km', 1e3, 'Mm', 1e3, 'Gm', 1e3, 'Tm'])
  const sup = new SmartUnitPrecision(
    ['mm', 10, 'cm', 100, 'm', 1e3, 'km', 1e3, 'Mm', 1e3, 'Gm', 1e3, 'Tm'],
    {
      decimalOptions: { precision: 50 },
    },
  )

  // 差异测试
  it('should have correct differences', () => {
    const input = '123456789012345678901234567890'
    expect(sup.format(input)).not.toEqual(su.format(+input))
  })

  // 基本转换测试 - 使用超大数值
  it('should perform basic conversion with high precision', () => {
    const result = sup.getUnit('123456789012345678901234567890')
    expect(result.decimal?.toString()).toEqual('123456789012345.67890123456789')
    expect(result.unit).toEqual('Tm')
  })

  // 小数位数控制测试 - 使用超大数值
  it('should control decimal places correctly', () => {
    expect(sup.format('123456789012345678901234567890', 2)).toEqual('123456789012345.68Tm')
    expect(sup.format('123456789012345678901234567890', '1-3')).toEqual('123456789012345.679Tm')
  })

  // 超过JavaScript安全整数范围的值测试
  it('should handle values beyond JS safe integer range', () => {
    const result = sup.getUnit('1e30')
    expect(result.decimal?.toString()).toEqual('1000000000000000')
    expect(result.unit).toEqual('Tm')
  })

  // 转换为基本单位 - 使用超大数值
  it('should convert to base units', () => {
    const result = sup.toBase('123456789012345678901234567890', 'Mm')
    expect(result.toString()).toEqual('1.2345678901234567890123456789e+38')
  })

  // 带小数点的超大字符串测试
  it('should parse strings with decimal points', () => {
    const value = sup.parse('12345678901234567890.123456789km')
    expect(value.toString()).toEqual('1.2345678901234567890123456789e+25')
  })
})

// Decimal 输入测试（高精度模式）
describe('Decimal input tests (high precision mode)', () => {
  const su = new SmartUnitPrecision(
    ['mm', 10, 'cm', 100, 'm', 1e3, 'km', 1e3, 'Mm', 1e3, 'Gm', 1e3, 'Tm'],
    {
      decimalOptions: { precision: 50 },
    },
  )

  // Decimal 基本转换 - 使用超大数值
  it('should handle Decimal input for basic conversion', () => {
    const result = su.getUnit(new Decimal('123456789012345678901234567890'))
    expect(result.decimal?.toString()).toEqual('123456789012345.67890123456789')
    expect(result.unit).toBe('Tm')
  })

  // Decimal 高精度计算 - 使用超大数值
  it('should maintain precision with Decimal input', () => {
    const result = su.getUnit(new Decimal('123456789012345678901234567890.123456789'))
    expect(result.decimal?.toString()).toEqual('123456789012345.678901234567890123456789')
    expect(result.unit).toBe('Tm')
  })

  // Decimal 格式化输出 - 使用超大数值
  it('should format Decimal values correctly', () => {
    expect(su.format(new Decimal('123456789012345678901234567890'))).toEqual(
      '123456789012345.67890123456789Tm',
    )
    expect(su.format(new Decimal('12345678901234567890.123456789'))).toEqual(
      '12345.678901234567890123456789Tm',
    )
  })
})

// BigInt 输入测试（高精度模式）
describe('BigInt input tests (high precision mode)', () => {
  const su = new SmartUnitPrecision(
    ['mm', 10, 'cm', 100, 'm', 1e3, 'km', 1e3, 'Mm', 1e3, 'Gm', 1e3, 'Tm'],
    {
      decimalOptions: { precision: 50 },
    },
  )

  // BigInt 基本转换 - 使用超大数值
  it('should handle BigInt input for basic conversion', () => {
    const result = su.getUnit(BigInt('123456789012345678901234567890'))
    expect(result.decimal?.toString()).toEqual('123456789012345.67890123456789')
    expect(result.unit).toBe('Tm')
  })

  // 超大 BigInt - 超出JS安全范围
  it('should handle very large BigInt values', () => {
    const result = su.getUnit(BigInt('1000000000000000000000000000000'))
    expect(result.decimal?.toString()).toEqual('1000000000000000')
    expect(result.unit).toBe('Tm')
  })

  // BigInt 格式化输出 - 使用超大数值
  it('should format BigInt values correctly', () => {
    expect(su.format(BigInt('123456789012345678901234567890'))).toEqual(
      '123456789012345.67890123456789Tm',
    )
    expect(su.format(BigInt('1000000000000000000000000'))).toEqual('1000000000Tm')
  })
})
