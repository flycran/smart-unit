import type Decimal from 'decimal.js'
import { assertType, describe, expectTypeOf, it } from 'vitest'
import SmartUnit, { type FractionDigits, type GetUnitNames } from '../src'
import SmartUnitPrecision, { type FormattedValuePrecision } from '../src/precision'

// 类型安全测试
describe('Type Safety Tests', () => {
  // 基础类型推导测试
  describe('SmartUnit inference attributes', () => {
    it('should infer unitNames and sortedUnitNames correctly', () => {
      type TimeUnit = 'ms' | 's' | 'm' | 'h'
      const su = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h'])
      assertType<TimeUnit[]>(su.unitNames)
      assertType<TimeUnit[]>(su.sortedUnitNames)
    })
  })

  // GetUnitNames 工具类型测试
  describe('GetUnitNames utility type', () => {
    it('should extract unit names from SmartUnit instance', () => {
      const su = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h'])
      type ExtractedUnits = GetUnitNames<typeof su>

      assertType<ExtractedUnits>('ms')
      assertType<ExtractedUnits>('s')
      assertType<ExtractedUnits>('m')
      assertType<ExtractedUnits>('h')
      expectTypeOf<ExtractedUnits>().not.toExtend<'invalid'>()
    })
  })

  // FractionDigits 类型测试
  describe('FractionDigits type', () => {
    it('should accept fractionDigits', () => {
      assertType<FractionDigits>(1)
      assertType<FractionDigits>('1-')
      assertType<FractionDigits>('-3')
      assertType<FractionDigits>('1-3aa')
    })

    it('should reject invalid fractionDigits', () => {
      expectTypeOf('1').not.toExtend<FractionDigits>()
      expectTypeOf('a').not.toExtend<FractionDigits>()
      expectTypeOf('1-2-3').not.toExtend<FractionDigits>()
    })
  })

  // 高精度模式对比测试
  describe('High precision mode type', () => {
    it('should return non-FormattedValuePrecision types for SmartUnit', () => {
      const su = new SmartUnit(['ms', 1000, 's'])
      const unit = su.getUnit(1500)
      const chainUnit = su.getChainUnit(1500)

      expectTypeOf<typeof unit>().not.toEqualTypeOf<FormattedValuePrecision<any>>()
      expectTypeOf<typeof chainUnit>().not.toEqualTypeOf<FormattedValuePrecision<any>[]>()
    })

    it('should return FormattedValuePrecision types for SmartUnitPrecision', () => {
      const su = new SmartUnitPrecision(['ms', 1000, 's'])
      const unit = su.getUnit(1500)
      const chainUnit = su.getChainUnit(1500)

      expectTypeOf<typeof unit>().toExtend<FormattedValuePrecision<any>>()
      expectTypeOf<typeof chainUnit>().toExtend<FormattedValuePrecision<any>[]>()
    })

    it('should return non-FormattedValuePrecision types for SmartUnit', () => {
      const su = new SmartUnit(['ms', 1000, 's'])

      const base = su.toBase(1500, 's')
      const parsed = su.parse('1.5s')

      expectTypeOf<typeof base>().toEqualTypeOf<number>()
      expectTypeOf<typeof parsed>().toEqualTypeOf<number>()
    })

    it('should return non-FormattedValuePrecision types for SmartUnitPrecision', () => {
      const su = new SmartUnitPrecision(['ms', 1000, 's'])

      const base = su.toBase(1500, 's')
      const parsed = su.parse('1.5s')

      expectTypeOf<typeof base>().toEqualTypeOf<Decimal>()
      expectTypeOf<typeof parsed>().toEqualTypeOf<Decimal>()
    })
  })
})
