import { useTranslation } from 'react-i18next'
import SmartUnit from 'smart-unit'
import { useSmartUnit } from 'smart-unit/react'

export const weightUnit = new SmartUnit(['g', 1000, 'kg', 1000, 't'])

export const useWeightUnit = () => {
  const { t } = useTranslation()
  return useSmartUnit(weightUnit, (unit) => t(`weight.${unit}`))
}
