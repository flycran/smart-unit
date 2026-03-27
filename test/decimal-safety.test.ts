import { describe, expect, it } from 'vitest'
import SmartUnit from '../src'

// 精度安全测试
describe('High precision safety tests', () => {
  const su = new SmartUnit(['mm', 10, 'cm', 100, 'm', 1e3, 'km', 1e3, 'Mm', 1e3, 'Gm', 1e3, 'Tm'], {
    useDecimal: true,
    decimalOptions: { precision: 50 },
  })

  // 基本转换测试 - 使用超大数值
  it('should perform basic conversion with high precision', () => {
    const result = su.getUnit('123456789012345678901234567890')
    expect(result.decimal?.toString()).toEqual('123456789012345.67890123456789')
    expect(result.unit).toEqual('Tm')
  })

  // 小数位数控制测试 - 使用超大数值
  it('should control decimal places correctly', () => {
    expect(su.format('123456789012345678901234567890', 2)).toEqual('123456789012345.68Tm')
    expect(su.format('123456789012345678901234567890', '1-3')).toEqual('123456789012345.679Tm')
  })

  // 超过JavaScript安全整数范围的值测试
  it('should handle values beyond JS safe integer range', () => {
    const result = su.getUnit('1e30')
    expect(result.decimal?.toString()).toEqual('1000000000000000')
    expect(result.unit).toEqual('Tm')
  })

  // 转换为基本单位 - 使用超大数值
  it('should convert to base units', () => {
    const result = su.toBase('123456789012345678901234567890', 'Mm')
    expect(result.toString()).toEqual('1.2345678901234567890123456789e+38')
  })

  // 带小数点的超大字符串测试
  it('should parse strings with decimal points', () => {
    const value = su.parse('12345678901234567890.123456789km')
    expect(value.toString()).toEqual('1.2345678901234567890123456789e+25')
  })
})
