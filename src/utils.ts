import type { SmartUnitBase } from 'SmartUnitBase'

export type FractionDigits =
  | number
  | `-${number}`
  | `${number}-`
  | `${number}-${number}`
  | undefined

export interface SmartUnitOptions {
  // 进制位数
  /** Base digit for auto-generating unit conversions */
  baseDigit?: number
  // 阈值 - 最终的比较会先乘以 threshold
  /**
   * Threshold for unit switching
   * The comparison value is multiplied by this threshold
   */
  threshold?: number
  /**
   * Number of decimal places to preserve in the result
   * Can be a fixed number or a range like "min-max"
   */
  fractionDigits?: FractionDigits
  /**
   * The separator for chain formatting
   * - Default is an empty string
   */
  separator?: string
}

export interface FormattedValue<U extends string> {
  // 数值
  /** The numeric value */
  num: number
  // 单位
  /** The unit string */
  unit: U
  // 格式化后的数字字符串（已处理小数位数）
  /** The number string with decimal places applied */
  numStr: string
}

export type InputNumber = number

export type GetUnitNames<SU extends SmartUnitBase<any>> =
  SU extends SmartUnitBase<infer U> ? U : never

export const ERROR_NAN_INPUT =
  'Accepting NaN as an argument may be unintentional and could lead to invalid results.'
