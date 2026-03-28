import SmartUnit from 'smart-unit'
import { useI18n } from 'vue-i18n'

export const weightUnit = new SmartUnit(['g', 1000, 'kg', 1000, 't'])

export const useWeightUnit = () => {
  const { t } = useI18n()
  // vue-i18n 无法严格约束message，这里的key如果写错了通常会被忽略
  return weightUnit.withConvert((unit) => t(`weight.${unit}`))
}
