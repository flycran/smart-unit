import { describe, expect, it } from 'vitest';
import SmartUnit from '../src';

// DecimalOptions 配置测试
describe('DecimalOptions configuration tests', () => {
  // 默认精度（20位）
  it('should use default precision without decimalOptions', () => {
    const su = new SmartUnit(['mm', 10, 'cm', 100, 'm', 1e3, 'km'], { useDecimal: true })
    const result = su.getUnit('123456789012345678901234567890')
    // 默认20位精度，超大数值会用科学计数法
    expect(result.decimal?.toString()).toEqual('1.234567890123456789e+23')
  })

  // 自定义精度50位
  it('should use custom precision of 50', () => {
    const su = new SmartUnit(['mm', 10, 'cm', 100, 'm', 1e3, 'km', 1e3, 'Mm', 1e3, 'Gm', 1e3, 'Tm'], {
      useDecimal: true,
      decimalOptions: { precision: 50 }
    })
    const result = su.getUnit('123456789012345678901234567890')
    expect(result.decimal?.toString()).toEqual('123456789012345.67890123456789')
  })

  // 高精度80位
  it('should use high precision of 80', () => {
    const su = new SmartUnit(['mm', 10, 'cm', 100, 'm', 1e3, 'km', 1e3, 'Mm', 1e3, 'Gm', 1e3, 'Tm'], {
      useDecimal: true,
      decimalOptions: { precision: 80 }
    })
    const result = su.getUnit('123456789012345678901234567890.123456789')
    // 80位精度可以保留更多小数位
    expect(result.decimal?.toString()).toEqual('123456789012345.678901234567890123456789')
  })

  // 不同实例独立配置
  it('should keep independent precision for different instances', () => {
    const su20 = new SmartUnit(['mm', 10, 'cm', 100, 'm', 1e3, 'km'], { useDecimal: true })
    const su50 = new SmartUnit(['mm', 10, 'cm', 100, 'm', 1e3, 'km'], {
      useDecimal: true,
      decimalOptions: { precision: 50 }
    })

    const value = '123456789012345678901234567890'
    const result20 = su20.getUnit(value)
    const result50 = su50.getUnit(value)

    // 不同精度应产生不同结果
    expect(result20.decimal?.toString()).not.toEqual(result50.decimal?.toString())
    expect(result20.decimal?.toString()).toEqual('1.234567890123456789e+23')
    expect(result50.decimal?.toString()).toEqual('1.2345678901234567890123456789e+23')
  })

  // 四舍五入配置
  it('should respect rounding mode configuration', () => {
    const suRoundHalfUp = new SmartUnit(['mm', 10, 'cm', 100, 'm'], {
      useDecimal: true,
      decimalOptions: { precision: 20, rounding: 4 } // ROUND_HALF_UP
    })

    const result = suRoundHalfUp.format('12345678901234567890.5', 0)
    // 20位精度下，12345678901234567890.5 会被舍入
    expect(result).toEqual('12345678901234568m')
  })

  // 科学计数法阈值配置
  it('should respect toExpPos configuration', () => {
    const su = new SmartUnit(['mm', 10, 'cm', 100, 'm', 1e3, 'km'], {
      useDecimal: true,
      decimalOptions: { precision: 50, toExpPos: 30 }
    })

    const result = su.getUnit('1e40')
    // toExpPos=30 表示超过30位时用科学计数法
    expect(result.decimal?.toString()).toContain('e+')
  })
})
