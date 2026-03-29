import { createI18n } from 'vue-i18n'

export const messages = {
  zh: {
    weight: {
      g: '克',
      kg: '千克',
      t: '吨',
    },
    title: 'SmartUnit Vue 示例',
    subtitle: '带国际化的重量单位转换',
    inputLabel: '输入数值 (克)',
    currentLocale: '当前语言',
    switchTo: '切换到',
    resultTitle: '转换结果',
    valueLabel: '数值',
    unitLabel: '单位',
    formatLabel: '格式化',
    examplesTitle: '更多示例',
  },
  en: {
    weight: {
      g: 'g',
      kg: 'kg',
      t: 'ton',
    },
    title: 'SmartUnit Vue Demo',
    subtitle: 'Weight unit conversion with i18n',
    inputLabel: 'Input value (g)',
    currentLocale: 'Current Locale',
    switchTo: 'Switch to',
    resultTitle: 'Conversion Result',
    valueLabel: 'Value',
    unitLabel: 'Unit',
    formatLabel: 'Formatted',
    examplesTitle: 'More Examples',
  },
}

export const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages,
})
