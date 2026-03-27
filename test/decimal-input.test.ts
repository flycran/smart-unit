import Decimal from 'decimal.js'
import { describe, expect, it } from 'vitest'
import SmartUnit from '../src'

// Decimal 输入测试（高精度模式）
describe('Decimal input tests (high precision mode)', () => {
  const su = new SmartUnit(['mm', 10, 'cm', 100, 'm', 1e3, 'km', 1e3, 'Mm', 1e3, 'Gm', 1e3, 'Tm'], {
    useDecimal: true,
    decimalOptions: { precision: 50 },
  })

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
