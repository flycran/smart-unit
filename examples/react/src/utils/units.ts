import { useTranslation } from 'react-i18next'
import SmartUnit from 'smart-unit'

export const weightUnit = new SmartUnit(['g', 1000, 'kg', 1000, 't'])

export const useWeightUnit = () => {
  const { t } = useTranslation()
  // react-i18next 严格约束message，传入的key如果写错了IDE会报错
  return weightUnit.withConvert((unit) => t(`weight.${unit}`))
}
