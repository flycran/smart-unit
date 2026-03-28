import { assertType, describe, expectTypeOf, it } from 'vitest'
import SmartUnit, {
  type FormattedValue,
  type FractionDigits,
  type GetUnitNames,
  type Num,
  type SmartUnitOptions,
} from '../src'

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

    it('should infer useDecimal correctly', () => {
      const su1 = new SmartUnit(['ms', 1000, 's'])
      const su2 = new SmartUnit(['ms', 1000, 's'], {
        useDecimal: true,
      })
      assertType<false>(su1.useDecimal)
      assertType<true>(su2.useDecimal)
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
      assertType<FractionDigits>('1-3')
    })

    it('should reject invalid fractionDigits', () => {
      expectTypeOf('1').not.toExtend<FractionDigits>()
      expectTypeOf('a').not.toExtend<FractionDigits>()
      expectTypeOf('1-2-3').not.toExtend<FractionDigits>()
    })
  })

  // 高精度模式测试
  describe('FormattedValue type', () => {
    it('', () => {
      const su = new SmartUnit(['ms', 1000, 's'])
    })
    it('', () => {
      const su = new SmartUnit(['ms', 1000, 's'], { useDecimal: true })

      const fu = su.getUnit(1500)

      expectTypeOf<typeof fu.decimal>().toEqualTypeOf(undefined)
    })
  })

  // Num 类型测试
  describe('Num type', () => {
    it('should be number for non-decimal mode', () => {
      type NonDecimalNum = Num<false>
      assertType<NonDecimalNum>(1500)
      expectTypeOf<NonDecimalNum>().toEqualTypeOf<number>()
    })

    it('should support multiple types for decimal mode', () => {
      type DecimalNum = Num<true>

      // 类型检查：DecimalNum 应该是 number | bigint | string
      assertType<DecimalNum>(1500)
      assertType<DecimalNum>('1500')
    })
  })

  // 泛型类型参数测试
  describe('Generic type parameters', () => {
    it('should enforce unit type constraints', () => {
      type DistanceUnit = 'mm' | 'cm' | 'm' | 'km'
      const su = new SmartUnit<false, DistanceUnit>(['mm', 10, 'cm', 100, 'm', 1e3, 'km'])

      // 类型检查：toBase 方法的 unit 参数应该是 DistanceUnit
      expectTypeOf(su.toBase).parameter(1).toEqualTypeOf<DistanceUnit>()
    })

    it('should work with high precision generic', () => {
      type DataUnit = 'byte' | 'KB' | 'MB' | 'GB'
      const su = new SmartUnit<true, DataUnit>(['byte', 'KB', 'MB', 'GB'], {
        baseDigit: 1024,
        useDecimal: true,
      })

      // 类型检查：实例类型
      expectTypeOf(su).toEqualTypeOf<SmartUnit<true, DataUnit>>()
    })
  })

  // 条件类型测试
  describe('Conditional types', () => {
    it('toBase should return Decimal when D is true', () => {
      const su = new SmartUnit<true>(['ms', 1000, 's'], { useDecimal: true })
      const result = su.toBase(1, 's')

      // 类型检查：result 应该是 Decimal
      expectTypeOf(result).not.toEqualTypeOf<number>()
    })

    it('toBase should return number when D is false', () => {
      const su = new SmartUnit<false>(['ms', 1000, 's'])
      const result = su.toBase(1, 's')

      // 类型检查：result 应该是 number
      expectTypeOf(result).toEqualTypeOf<number>()
    })

    it('parse should return Decimal when D is true', () => {
      const su = new SmartUnit<true>(['ms', 1000, 's'], { useDecimal: true })
      const result = su.parse('1s')

      // 类型检查：result 不应该是 number
      expectTypeOf(result).not.toEqualTypeOf<number>()
    })

    it('parse should return number when D is false', () => {
      const su = new SmartUnit<false>(['ms', 1000, 's'])
      const result = su.parse('1s')

      // 类型检查：result 应该是 number
      expectTypeOf(result).toEqualTypeOf<number>()
    })
  })

  // withConvert 方法类型测试
  describe('withConvert method type safety', () => {
    it('should preserve type after withConvert', () => {
      const su = new SmartUnit<false, 'ms' | 's'>(['ms', 1000, 's'])
      const suWithConvert = su.withConvert((unit) => `[${unit}]`)

      // 类型检查：转换后的实例保持相同的类型参数
      expectTypeOf(suWithConvert).toEqualTypeOf<SmartUnit<false, 'ms' | 's'>>()
    })

    it('should work with high precision mode', () => {
      const su = new SmartUnit<true, 'ms' | 's'>(['ms', 1000, 's'], { useDecimal: true })
      const suWithConvert = su.withConvert((unit) => `[${unit}]`)

      // 类型检查：高精度模式下也保持类型
      expectTypeOf(suWithConvert).toEqualTypeOf<SmartUnit<true, 'ms' | 's'>>()
    })
  })

  // 数组类型安全测试
  describe('Array type safety', () => {
    it('should correctly type unitNames array', () => {
      type TimeUnit = 'ms' | 's' | 'm'
      const su = new SmartUnit<false, TimeUnit>(['ms', 1000, 's', 60, 'm'])

      // 类型检查：unitNames 应该是 TimeUnit[]
      expectTypeOf(su.unitNames).toEqualTypeOf<TimeUnit[]>()
    })

    it('should correctly type accumulatedDigits array', () => {
      const su = new SmartUnit(['ms', 1000, 's', 60, 'm'])

      // 类型检查：accumulatedDigits 应该是 number[]
      expectTypeOf(su.accumulatedDigits).toEqualTypeOf<number[]>()
    })
  })

  // 方法返回类型测试
  describe('Method return types', () => {
    it('getUnit should return FormattedValue', () => {
      const su = new SmartUnit(['ms', 1000, 's'])
      const result = su.getUnit(1500)

      // 类型检查：返回值类型
      expectTypeOf(result).toEqualTypeOf<FormattedValue<'ms' | 's'>>()
    })

    it('getChainUnit should return FormattedValue array', () => {
      const su = new SmartUnit(['ms', 1000, 's', 60, 'm'])
      const result = su.getChainUnit(63000)

      // 类型检查：返回值是 FormattedValue 数组
      expectTypeOf(result).toEqualTypeOf<FormattedValue<'ms' | 's' | 'm'>[]>()
    })

    it('format should return string', () => {
      const su = new SmartUnit(['ms', 1000, 's'])
      const result = su.format(1500)

      // 类型检查：返回值是字符串
      expectTypeOf(result).toEqualTypeOf<string>()
    })

    it('formatChain should return string', () => {
      const su = new SmartUnit(['ms', 1000, 's', 60, 'm'])
      const result = su.formatChain(63000)

      // 类型检查：返回值是字符串
      expectTypeOf(result).toEqualTypeOf<string>()
    })

    it('splitUnit should return FormattedValue', () => {
      const su = new SmartUnit(['ms', 1000, 's'])
      const result = su.splitUnit('1500ms')

      // 类型检查：返回值类型
      expectTypeOf(result).toEqualTypeOf<FormattedValue<'ms' | 's'>>()
    })

    it('toBase should return conditional type', () => {
      const su = new SmartUnit<false>(['ms', 1000, 's'])
      const result = su.toBase(1, 's')

      // 类型检查：非高精度模式返回 number
      expectTypeOf(result).toEqualTypeOf<number>()
    })
  })

  // 联合类型测试
  describe('Union type handling', () => {
    it('should handle union type for fractionDigits', () => {
      const su = new SmartUnit(['byte', 'KB'], { baseDigit: 1024 })

      // 类型检查：format 方法第二个参数接受 FractionDigits | undefined
      expectTypeOf(su.format).parameter(1).not.toEqualTypeOf<undefined>()
    })
  })

  // 只读属性类型测试
  describe('Readonly property types', () => {
    it('threshold should be readonly number', () => {
      const su = new SmartUnit(['ms', 1000, 's'], { threshold: 0.8 })

      // 类型检查：threshold 是只读 number
      expectTypeOf(su.threshold).toEqualTypeOf<number>()
    })

    it('separator should be readonly string', () => {
      const su = new SmartUnit(['ms', 1000, 's'], { separator: ' ' })

      // 类型检查：separator 是只读 string
      expectTypeOf(su.separator).toEqualTypeOf<string>()
    })

    it('fractionDigits should be readonly FractionDigits', () => {
      const su = new SmartUnit(['byte', 'KB'], { baseDigit: 1024, fractionDigits: '1-3' })

      // 类型检查：fractionDigits 是只读的 FractionDigits
      expectTypeOf(su.fractionDigits).toEqualTypeOf<FractionDigits>()
    })
  })

  // 静态属性类型测试
  describe('Static property type', () => {
    it('ignoreNaNInputs should be boolean', () => {
      // 类型检查：静态属性是 boolean 类型
      expectTypeOf(SmartUnit.ignoreNaNInputs).toEqualTypeOf<boolean>()
    })
  })

  // 方法参数类型测试
  describe('Method parameter types', () => {
    it('format should accept Num and optional fractionDigits', () => {
      const su = new SmartUnit<false>(['ms', 1000, 's'])

      // 类型检查：format 方法参数
      expectTypeOf(su.format).parameter(0).toEqualTypeOf<number>()
      expectTypeOf(su.format).parameter(1).toEqualTypeOf<FractionDigits | undefined>()
    })

    it('formatChain should accept Num and optional separator', () => {
      const su = new SmartUnit(['ms', 1000, 's', 60, 'm'])

      // 类型检查：formatChain 方法参数
      expectTypeOf(su.formatChain).parameter(0).toEqualTypeOf<number>()
      expectTypeOf(su.formatChain).parameter(1).toEqualTypeOf<string>()
    })
  })
})
