/*!
 * smart-unit
 * Copyright (c) [2026] [flycran]
 * MIT License. See LICENSE for details.
 */

import DecimalConstructor, { type Decimal } from 'decimal.js'

export type FractionDigits =
  | number
  | `-${number}`
  | `${number}-`
  | `${number}-${number}`
  | undefined

export type DecimalOptions = Decimal.Config

export interface SmartUnitOptions<HP extends boolean = false> {
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
   * Enable high-precision calculation using decimal.js
   * - Uses decimal.js for high-precision floating-point calculations
   * - Supports calculations beyond JavaScript's safe integer limit
   * - Enables string, BigInt, and Decimal inputs for format and other methods
   */
  useDecimal?: HP
  /**
   * Decimal.js configuration options
   * - Creates an isolated Decimal class for this SmartUnit instance only
   * - Used to customize precision and other parameters
   */
  decimalOptions?: DecimalOptions
}

export interface NumUnit {
  // 数值
  /** The numeric value */
  num: number
  // Decimal 高精度数值
  /** The Decimal instance for high-precision mode */
  decimal?: Decimal
  // 单位
  /** The unit string */
  unit: string
}

export type Num<DS extends boolean = false> = DS extends true ? number | bigint | string | Decimal : number

export const ERROR_NAN_INPUT = 'Accepting NaN as an argument may be unintentional and could lead to invalid results. If this is intentional, please set `SmartUnit.ignoreNaNInputs` to `true`.'

export const ERROR_HIGH_PRECISION_NOT_ENABLED = 'By default, only number input is supported. To enable high-precision calculations, explicitly set the decimalSafety parameter to true.'

export class SmartUnit<HP extends boolean = false> {
  static ignoreNaNInputs = false
  readonly threshold: number
  readonly decimal?: FractionDigits
  readonly unitsStr: string[] = []
  readonly highPrecision: HP
  private DecimalClass: typeof DecimalConstructor = DecimalConstructor

  constructor(
    readonly units: (string | number)[],
    option: SmartUnitOptions<HP> = {},
  ) {
    if (!units.length) throw new Error('units is empty.')
    this.threshold = option.threshold || 1
    this.decimal = option.fractionDigits
    this.highPrecision = option.useDecimal
    if (option.decimalOptions) {
      this.DecimalClass = DecimalConstructor.clone(option.decimalOptions)
    }
    if (option.baseDigit) {
      const us = []
      for (let i = 0; i < units.length; i++) {
        this.unitsStr.push(units[i].toString())
        us.push(units[i], option.baseDigit)
      }
      this.units = us.slice(0, -1)
    } else {
      for (let i = 0; i < units.length; i += 2) {
        this.unitsStr.push(units[i].toString())
      }
      this.units = units
    }
  }

  // 根据输入数值获取单位和调整后的值
  /**
   * Gets the appropriate unit and adjusted value for the input number
   *
   * @param num - The input number to determine the unit for
   * @returns An object containing the adjusted number and its corresponding unit
   */
  getUnit(num: Num<HP>): NumUnit {
    if (!SmartUnit.ignoreNaNInputs && Number.isNaN(num)) throw new Error(ERROR_NAN_INPUT)
    let i = 1

    if (this.highPrecision) {
      const dn = new this.DecimalClass(typeof num === 'bigint' ? num.toString() : num)
      const isNegative = dn.isNegative()
      let absDn = isNegative ? dn.abs() : dn
      while (i < this.units.length - 1) {
        const n = this.units[i]
        if (typeof n === 'string') throw new Error(`The unit setting is incorrect; the element at index [${i}] should be of numeric type.`)
        if (absDn.lt(n * this.threshold)) {
          break
        }
        absDn = absDn.dividedBy(n)
        i += 2
      }
      const result = isNegative ? absDn.neg() : absDn
      return {
        num: result.toNumber(),
        decimal: result,
        unit: this.units[i - 1].toString(),
      }
    } else {
      if (typeof num !== 'number') throw new Error(ERROR_HIGH_PRECISION_NOT_ENABLED)
      const isNegative = num < 0
      let absNum = isNegative ? -num : num
      while (i < this.units.length - 1) {
        const n = this.units[i]
        if (typeof n === 'string') throw new Error(`The unit setting is incorrect; the element at index [${i}] should be of numeric type.`)
        if (absNum < n * this.threshold) {
          break
        }
        absNum /= n
        i += 2
      }
      return {
        num: isNegative ? -absNum : absNum,
        unit: this.units[i - 1].toString(),
      }
    }
  }

  // 将数字转换为字符串表示形式，并可选择配置小数位数
  /**
   * Formats a number as a string with optional decimal place configuration
   *
   * @param num - The number to convert to string
   * @param decimal - Decimal precision configuration (defaults to instance setting)
   *   - If a number, defines fixed decimal places
   *   - If a string in "min-max" format, defines a range of decimal places
   *   - If omitted, uses the instance's default decimal configuration
   * @returns The formatted string representation with unit
   */
  format(num: Num<HP>, decimal: FractionDigits = this.decimal): string {
    const {
      num: n,
      unit,
      decimal: dec,
    } = this.getUnit(num)
    let ns: string
    if (typeof decimal === 'number') {
      ns = (dec ?? n).toFixed(decimal)
    } else if (typeof decimal === 'string') {
      const [dp1, dp2] = decimal
        .split('-')
      const ndp = (n.toString().split('.')[1] || '').length

      const minDp = dp1 ? +dp1 : -Infinity
      const maxDp = dp2 ? +dp2 : Infinity

      if (ndp < minDp) {
        ns = (dec ?? n).toFixed(minDp)
      } else if (ndp > maxDp) {
        ns = (dec ?? n).toFixed(maxDp)
      } else {
        ns = (dec ?? n).toString()
      }
    } else {
      ns = (dec ?? n).toString()
    }
    return `${ns}${unit}`
  }

  // 将给定数值从指定单位转换为基本单位
  /**
   * Converts a value from the specified unit to the base unit
   *
   * @param num - The number to convert
   * @param unit - The original unit of the number
   * @returns The converted value in base unit
   *   - Returns Decimal if high-precision mode is enabled
   */
  toBase(num: Num<HP>, unit: string): HP extends true ? Decimal : number {
    if (!SmartUnit.ignoreNaNInputs && Number.isNaN(num)) throw new Error(ERROR_NAN_INPUT)
    let i = 0

    if (this.highPrecision) {
      // High-precision calculation
      let dn = new this.DecimalClass(typeof num === 'bigint' ? num.toString() : num)
      while (i < this.units.length) {
        if (this.units[i] === unit) {
          return dn as HP extends true ? Decimal : number
        }
        if (typeof this.units[i] === 'undefined') {
          break
        }
        const cn = this.units[i + 1]
        if (typeof cn !== 'number') throw Error(`The unit setting is incorrect; the element at index [${i}] should be of numeric type.`)
        dn = dn.times(cn)
        i += 2
      }
    } else {
      if (typeof num !== 'number') throw new Error(ERROR_HIGH_PRECISION_NOT_ENABLED)
      let nn = num
      // Normal calculation
      while (i < this.units.length) {
        if (this.units[i] === unit) {
          return nn as HP extends true ? Decimal : number
        }
        if (typeof this.units[i + 1] === 'undefined') {
          break
        }
        if (typeof this.units[i + 1] !== 'number') throw Error(`The unit setting is incorrect; the element at index [${i}] should be of numeric type.`)
        nn *= this.units[i + 1] as number
        i += 2
      }
    }
    throw new Error(`Undefined unit: "${unit}".`)
  }

  // 从给定字符串中分离出数字部分和单位
  /**
   * Splits a string into its numeric part and unit
   *
   * @param str - Input string containing a number followed by a unit
   * @returns An object containing the numeric value and unit
   * Only supports predefined units
   * Throws an error if no match is found
   */
  splitUnit(str: string): NumUnit {
    const re = new RegExp(`^(\\d+(?:\\.\\d+)?)(${this.unitsStr.map(u => `${u}`).join('|')})`)

    const [, num, unit] = str.match(re) || []

    if (num === undefined || unit === undefined) {
      throw new Error(`Undefined unit: "${str}".`)
    }

    return {
      num: +num,
      unit,
      decimal: this.highPrecision ? new this.DecimalClass(num) : undefined,
    }
  }

  // 将带单位的值转换为基础单位的数值
  /**
   * Parses a string with unit into a base unit numeric value
   *
   * @param str - Input string containing a number and unit
   * @returns The value converted to base unit
   *   - Returns Decimal if high-precision mode is enabled
   */
  parse(str: string): HP extends true ? Decimal : number {
    const {
      num,
      unit,
      decimal,
    } = this.splitUnit(str)
    return this.toBase(((decimal ?? num) as Num<HP>), unit)
  }

  // 将给定数值从原单位转换为最佳单位，并可指定小数精度
  /**
   * Converts a value from the original unit to the optimal unit with optional decimal precision
   *
   * @param num - The number to convert
   * @param unit - The original unit
   * @param decimal - Optional decimal places for formatting output
   * @returns The converted number as a formatted string
   */
  fromUnitFormat(num: Num<HP>, unit: string, decimal?: FractionDigits): string {
    const nnum = this.toBase(num, unit)
    return this.format(nnum, decimal)
  }
}

export default SmartUnit
