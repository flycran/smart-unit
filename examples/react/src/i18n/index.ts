import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

export const resources = {
  zh: {
    translation: {
      weight: {
        g: '克',
        kg: '千克',
        t: '吨',
      },
      title: 'SmartUnit React 示例',
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
  },
  en: {
    translation: {
      weight: {
        g: 'g',
        kg: 'kg',
        t: 'ton',
      },
      title: 'SmartUnit React Demo',
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
  },
} as const

i18n.use(initReactI18next).init({
  resources,
  lng: 'zh',
  interpolation: { escapeValue: false },
})
