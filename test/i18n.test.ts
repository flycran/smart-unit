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

  const weightUnit = new SmartUnit(['g', 1000, 'kg', 1000, 't'])
  const zhWeightUnit = weightUnit.withConvert(createTranslator('zh'))
  const enWeightUnit = weightUnit.withConvert(createTranslator('en'))

  describe('format with i18n', () => {
    it('should format with Chinese translation', () => {
      expect(zhWeightUnit.format(1000)).toEqual('1 千克')
      expect(zhWeightUnit.format(1000000)).toEqual('1 吨')
      expect(zhWeightUnit.format(500)).toEqual('500 克')
    })
    it('should format with English translation', () => {
      expect(enWeightUnit.format(1000)).toEqual('1 kilograms')
      expect(enWeightUnit.format(1000000)).toEqual('1 tons')
      expect(enWeightUnit.format(500)).toEqual('500 grams')
    })

    // 未知翻译
    it('should use original unit when translation not found', () => {
      const customUnit = new SmartUnit(['unit1', 100, 'unit2'])
      const enCustomUnit = customUnit.withConvert(createTranslator('en'))
      // 由于 translation map 中没有 unit1 和 unit2，应该返回原始单位
      expect(enCustomUnit.format(50)).toEqual('50 unit1')
      expect(enCustomUnit.format(10000)).toEqual('100 unit2')
    })
  })

  const timeUnit = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h'])
  const zhTimeUnit = timeUnit.withConvert(createTranslator('zh'))
  const enTimeUnit = timeUnit.withConvert(createTranslator('en'))

  describe('formatChain with i18n', () => {
    it('should format chain with Chinese translation', () => {
      expect(zhTimeUnit.formatChain(61000, ' ')).toEqual('1 分钟 1 秒')
      expect(zhTimeUnit.formatChain(3661000, ' ')).toEqual('1 小时 1 分钟 1 秒')
    })
    it('should format chain with English translation', () => {
      expect(enTimeUnit.formatChain(61000, ' ')).toEqual('1 minutes 1 seconds')
      expect(enTimeUnit.formatChain(3661000, ' ')).toEqual('1 hours 1 minutes 1 seconds')
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
  })

  describe('fromUnitFormat with i18n', () => {
    it('should format from specific unit with translation for Chinese', () => {
      expect(zhWeightUnit.fromUnitFormat(1, 'kg')).toEqual('1 千克')
      expect(zhWeightUnit.fromUnitFormat(1000, 'g')).toEqual('1 千克')
    })
    it('should format from specific unit with translation for English', () => {
      expect(enWeightUnit.fromUnitFormat(1, 'kg')).toEqual('1 kilograms')
      expect(enWeightUnit.fromUnitFormat(1000, 'g')).toEqual('1 kilograms')
    })
  })

  describe('parse with i18n', () => {
    it('should parse with translation for Chinese', () => {
      expect(zhWeightUnit.parse('1 千克')).toEqual(1000)
      expect(zhWeightUnit.parse('1 吨')).toEqual(1000000)
    })
    it('should parse with translation for English', () => {
      expect(enWeightUnit.parse('1 kilograms')).toEqual(1000)
      expect(enWeightUnit.parse('1 tons')).toEqual(1000000)
    })
  })

  describe('parseChain with i18n', () => {
    it('should parse chain with translation for Chinese', () => {
      expect(zhTimeUnit.parseChain('1 分钟 1 秒', ' ')).toEqual(61000)
      expect(zhTimeUnit.parseChain('1 小时 1 分钟 1 秒', ' ')).toEqual(3661000)
    })
    it('should parse chain with translation for English', () => {
      expect(enTimeUnit.parseChain('1 minutes 1 seconds', ' ')).toEqual(61000)
      expect(enTimeUnit.parseChain('1 hours 1 minutes 1 seconds', ' ')).toEqual(3661000)
    })
  })
})
