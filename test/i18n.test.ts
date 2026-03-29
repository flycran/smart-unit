import { describe, expect, it } from 'vitest'
import SmartUnit from '../src'

// 国际化 (i18n) 测试
describe('Internationalization (i18n) tests', () => {
  // 使用 Map 模拟翻译字典
  const createTranslationMap = (lang: string) => {
    const translations: Record<string, Map<string, string>> = {
      zh: new Map([
        ['g', '克'],
        ['kg', '千克'],
        ['t', '吨'],
        ['ms', '毫秒'],
        ['s', '秒'],
        ['m', '分钟'],
        ['h', '小时'],
      ]),
      en: new Map([
        ['g', 'grams'],
        ['kg', 'kilograms'],
        ['t', 'tons'],
        ['ms', 'ms'],
        ['s', 'seconds'],
        ['m', 'minutes'],
        ['h', 'hours'],
      ]),
    }
    return translations[lang] || translations.en
  }

  // 创建翻译函数
  const createTranslator = (lang: string) => {
    const translationMap = createTranslationMap(lang)

    return (key: string) => {
      const unit = translationMap.get(key)
      return ` ${unit || key}`
    }
  }

  describe('Weight unit i18n tests', () => {
    const weightUnit = new SmartUnit(['g', 1000, 'kg', 1000, 't'])

    it('should format with Chinese translation', () => {
      const zhWeightUnit = weightUnit.withConvert(createTranslator('zh'))
      expect(zhWeightUnit.format(1000)).toEqual('1 千克')
      expect(zhWeightUnit.format(1000000)).toEqual('1 吨')
      expect(zhWeightUnit.format(500)).toEqual('500 克')
    })

    it('should format with English translation', () => {
      const enWeightUnit = weightUnit.withConvert(createTranslator('en'))
      expect(enWeightUnit.format(1000)).toEqual('1 kilograms')
      expect(enWeightUnit.format(1000000)).toEqual('1 tons')
      expect(enWeightUnit.format(500)).toEqual('500 grams')
    })

    it('should use original unit when translation not found', () => {
      const customUnit = new SmartUnit(['unit1', 100, 'unit2'])
      const enCustomUnit = customUnit.withConvert(createTranslator('en'))
      // 由于 translation map 中没有 unit1 和 unit2，应该返回原始单位
      expect(enCustomUnit.format(50)).toEqual('50 unit1')
      expect(enCustomUnit.format(10000)).toEqual('100 unit2')
    })
  })

  describe('Time unit i18n tests', () => {
    const timeUnit = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h'])

    it('should format chain with Chinese translation', () => {
      const zhTimeUnit = timeUnit.withConvert(createTranslator('zh'))
      expect(zhTimeUnit.formatChain(3661000)).toContain('1 小时')
      expect(zhTimeUnit.formatChain(3661000)).toContain('1 分钟')
      expect(zhTimeUnit.formatChain(3661000)).toContain('1 秒')
    })

    it('should format chain with English translation', () => {
      const enTimeUnit = timeUnit.withConvert(createTranslator('en'))
      const result = enTimeUnit.formatChain(3661000)
      expect(result).toContain('1 hours')
      expect(result).toContain('1 minutes')
      expect(result).toContain('1 seconds')
    })

    it('should format with different languages', () => {
      const value = 60000 // 1 分钟
      const zhTimeUnit = timeUnit.withConvert(createTranslator('zh'))
      const enTimeUnit = timeUnit.withConvert(createTranslator('en'))

      expect(zhTimeUnit.format(value)).toEqual('1 分钟')
      expect(enTimeUnit.format(value)).toEqual('1 minutes')
    })
  })

  describe('formatChain with i18n', () => {
    const timeUnit = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h'])

    it('should format chain with Chinese translation', () => {
      const zhTimeUnit = timeUnit.withConvert(createTranslator('zh'))
      const result = zhTimeUnit.formatChain(3661000, ' ')
      // 3661000ms = 1 小时 1 分钟 1 秒
      expect(result).toEqual('1 小时 1 分钟 1 秒')
    })

    it('should format chain with mixed units', () => {
      const enTimeUnit = timeUnit.withConvert(createTranslator('en'))
      const result = enTimeUnit.formatChain(7265000, ' ')
      // 7265000ms = 2 小时 1 分钟 5 秒
      expect(result).toEqual('2 hours 1 minutes 5 seconds')
    })
  })

  describe('Dynamic language switching', () => {
    const weightUnit = new SmartUnit(['g', 1000, 'kg', 1000, 't'])

    it('should support switching languages dynamically', () => {
      const zhUnit = weightUnit.withConvert(createTranslator('zh'))
      const enUnit = weightUnit.withConvert(createTranslator('en'))

      const value = 1000000

      expect(zhUnit.format(value)).toEqual('1 吨')
      expect(enUnit.format(value)).toEqual('1 tons')
    })
  })

  describe('Edge cases with i18n', () => {
    const weightUnit = new SmartUnit(['g', 1000, 'kg', 1000, 't'])

    it('should handle zero value with translation', () => {
      const zhWeightUnit = weightUnit.withConvert(createTranslator('zh'))
      expect(zhWeightUnit.format(0)).toEqual('0 克')
    })

    it('should handle negative values with translation', () => {
      const zhWeightUnit = weightUnit.withConvert(createTranslator('zh'))
      expect(zhWeightUnit.format(-1000)).toEqual('-1 千克')
      expect(zhWeightUnit.format(-500)).toEqual('-500 克')
    })

    it('should handle very small values with translation', () => {
      const zhWeightUnit = weightUnit.withConvert(createTranslator('zh'))
      expect(zhWeightUnit.format(1)).toEqual('1 克')
      expect(zhWeightUnit.format(999)).toEqual('999 克')
    })
  })

  describe('Custom translation function', () => {
    const distanceUnit = new SmartUnit(['m', 1000, 'km'])

    it('should support custom translation logic', () => {
      const customTranslator = (unit: string) => `[${unit.toUpperCase()}]`
      const customUnit = distanceUnit.withConvert(customTranslator)

      expect(customUnit.format(1000)).toEqual('1[KM]')
      expect(customUnit.format(500)).toEqual('500[M]')
    })

    it('should support template-based translation', () => {
      const translationMap = new Map([
        ['m', 'meter(s)'],
        ['km', 'kilometer(s)'],
      ])
      const templateTranslator = (unit: string) => {
        const translated = translationMap.get(unit) || unit
        return ` ${translated}`
      }
      const templateUnit = distanceUnit.withConvert(templateTranslator)

      expect(templateUnit.format(1000)).toEqual('1 kilometer(s)')
      expect(templateUnit.format(500)).toEqual('500 meter(s)')
    })
  })

  describe('fromUnitFormat with i18n', () => {
    const weightUnit = new SmartUnit(['g', 1000, 'kg', 1000, 't'])
    const zhWeightUnit = weightUnit.withConvert(createTranslator('zh'))

    it('should convert from specific unit with translation', () => {
      expect(zhWeightUnit.fromUnitFormat(1, 'kg')).toEqual('1 千克')
      expect(zhWeightUnit.fromUnitFormat(1000, 'g')).toEqual('1 千克')
      expect(zhWeightUnit.fromUnitFormat(0.001, 't')).toEqual('1 千克')
    })

    it('should convert with decimal places and translation', () => {
      expect(zhWeightUnit.fromUnitFormat(1500, 'g', 1)).toEqual('1.5 千克')
      expect(zhWeightUnit.fromUnitFormat(1.5, 'kg', 1)).toEqual('1.5 千克')
    })
  })
})
