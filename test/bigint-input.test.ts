import { describe, expect, it } from 'vitest'
import SmartUnit from '../src'

// BigInt 输入测试（高精度模式）
describe('BigInt input tests (high precision mode)', () => {
  const su = new SmartUnit(['mm', 10, 'cm', 100, 'm', 1e3, 'km', 1e3, 'Mm', 1e3, 'Gm', 1e3, 'Tm'], {
    useDecimal: true,
    decimalOptions: { precision: 50 },
  })

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
