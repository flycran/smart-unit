import DecimalConstructor, { type Decimal } from 'decimal.js'
import { SmartUnitBase } from './SmartUnitBase'
import {
  ERROR_NAN_INPUT,
  type FormattedValue,
  type FractionDigits,
  type InputNumber,
  type SmartUnitOptions,
} from './utils'

export type DecimalOptions = Decimal.Config

export type NumPrecision = InputNumber | string | bigint | Decimal

export interface FormattedValuePrecision<U extends string> extends FormattedValue<U> {
  decimal: Decimal
}

export interface SmartUnitPrecisionOptions extends SmartUnitOptions {
  /**
   * Decimal.js configuration options
   * - Creates an isolated Decimal class for this SmartUnit instance only
   * - Used to customize precision and other parameters
   */
  decimalOptions?: DecimalOptions
}

export class SmartUnitPrecision<U extends string = string> extends SmartUnitBase<U, true> {
  private DecimalClass: typeof DecimalConstructor = DecimalConstructor

  constructor(units: (U | number)[], option: SmartUnitPrecisionOptions = {}) {
    super(units, option)
    if (option.decimalOptions) {
      this.DecimalClass = DecimalConstructor.clone(option.decimalOptions)
    }
  }

  // 根据输入数值获取单位和调整后的值
  /**
   * Gets the appropriate unit and adjusted value for the input number
   *
   * @param num - The input NumPrecision to determine the unit for
   * @param fractionDigits - Decimal precision configuration
   * @returns The FormattedValue object containing the number, unit, and decimal instance
   */
  getUnit(num: NumPrecision): FormattedValuePrecision<U> {
    if (Number.isNaN(num)) throw new Error(ERROR_NAN_INPUT)
    const unitDigitsLen = this.unitDigits.length
    const dn = new this.DecimalClass(typeof num === 'bigint' ? num.toString() : num)
    const isNegative = dn.isNegative()
    let absDn = isNegative ? dn.abs() : dn
    let i = 0
    while (i < unitDigitsLen) {
      const digit = this.unitDigits[i]
      if (absDn.lt(digit * this.threshold)) {
        break
      }
      absDn = absDn.dividedBy(digit)
      i++
    }
    const result = isNegative ? absDn.neg() : absDn
    const n = result.toNumber()
    return {
      num: n,
      decimal: result,
      unit: this.unitNames[i],
      numStr: this.formatNumber(result, this.fractionDigits),
    }
  }

  // 将数字转换为字符串表示形式，并可选择配置小数位数
  /**
   * Formats a number as a string with unit and optional decimal place configuration
   *
   * @param num - The input number to format
   * @param fractionDigits - Decimal precision configuration
   * @returns The formatted string with number and unit
   */
  format(num: NumPrecision, fractionDigits: FractionDigits = this.fractionDigits): string {
    const { decimal, unit } = this.getUnit(num)
    const formatted = this.formatNumber(decimal, fractionDigits)
    return `${formatted}${this.convert ? this.convert(unit) : unit}`
  }

  // 根据输入数值获取链式单位数组
  /**
   * Gets the chain of units for the input number
   * 
   * @param num - The input number to determine the chain for
   * @returns An array of FormattedValue objects representing the chain of units
   */
  getChainUnit(num: NumPrecision): FormattedValuePrecision<U>[] {
    if (Number.isNaN(num)) throw new Error(ERROR_NAN_INPUT)

    const result: FormattedValuePrecision<U>[] = []
    if (num === 0) {
      return [{ num: 0, unit: this.unitNames[0], numStr: '0', decimal: new this.DecimalClass(0) }]
    }
    const dn = new this.DecimalClass(typeof num === 'bigint' ? num.toString() : num)
    const isNegative = dn.isNegative()
    let absDn = isNegative ? dn.abs() : dn

    for (let i = this.accumulatedDigits.length - 1; i >= 0; i--) {
      const accDigit = this.accumulatedDigits[i]
      if (absDn.gte(accDigit)) {
        const res = absDn.dividedToIntegerBy(accDigit)
        const val = isNegative ? res.neg() : res
        result.push({
          num: val.toNumber(),
          decimal: new this.DecimalClass(val),
          unit: this.unitNames[i + 1],
          numStr: this.formatNumber(val, this.fractionDigits),
        })
        absDn = absDn.minus(new this.DecimalClass(val).times(accDigit))
        if (absDn.isZero()) break
      }
    }
    if (!absDn.isZero()) {
      const val = isNegative ? absDn.neg() : absDn
      result.push({
        num: val.toNumber(),
        decimal: val,
        unit: this.unitNames[0],
        numStr: this.formatNumber(val, this.fractionDigits),
      })
    }
    return result
  }

  // 将数字格式化为链式单位字符串
  /**
   * Formats a number as a chain of units string
   * 
   * @param num - The input number to format
   * @returns The formatted chain string
   */
  formatChain(num: NumPrecision, separator = this.separator): string {
    const chain = this.getChainUnit(num)
    return chain
      .map(({ numStr, unit }) => `${numStr}${this.convert ? this.convert(unit) : unit}`)
      .join(separator)
  }

  // 将给定数值从指定单位转换为基本单位
  /**
   * Converts a value from the specified unit to the base unit
   *
   * @param num - The number to convert
   * @param unit - The original unit of the number
   * @returns The converted value in base unit
   */
  toBase(num: NumPrecision, unit: U): Decimal {
    if (Number.isNaN(num)) throw new Error(ERROR_NAN_INPUT)

    const unitDigitsLen = this.unitDigits.length
    let dn = new this.DecimalClass(typeof num === 'bigint' ? num.toString() : num)
    for (let i = 0; i < unitDigitsLen; i++) {
      const digit = this.unitDigits[i]
      if (this.unitNames[i] === unit) {
        return dn
      }
      dn = dn.times(digit)
    }
    if (unit === this.unitNames.at(-1)) {
      return dn
    }
    throw new Error(`Undefined unit: "${unit}".`)
  }

  // 从给定字符串中分离出数字部分和单位
  /**
   * Splits a string into its numeric part and unit
   *
   * @param str - Input string containing a number followed by a unit
   * @returns An object containing the numeric value, unit, and Decimal instance
   * @throws An error if no predefined unit is matched
   */
  splitUnit(str: string): FormattedValuePrecision<U> {
    const { num, unit, numStr } = super.splitUnit(str)

    return {
      num,
      decimal: new this.DecimalClass(numStr),
      unit,
      numStr,
    }
  }

  // 将带单位的值转换为基础单位的数值
  /**
   * Parses a string with unit into a base unit numeric value
   *
   * @param str - Input string containing a number and unit
   * @returns The value converted to base unit
   */
  parse(str: string): Decimal {
    const { decimal, unit } = this.splitUnit(str)
    return this.toBase(decimal, unit)
  }

  // 将给定数值从原单位转换为最佳单位，并可指定小数精度
  /**
   * Converts a value from the original unit to the optimal unit with optional decimal precision
   *
   * @param num - The number to convert
   * @param unit - The original unit
   * @param fractionDigits - Optional decimal places for formatting output
   * @returns The converted number as a formatted string
   */
  fromUnitFormat(num: NumPrecision, unit: U, fractionDigits?: FractionDigits): string {
    const nnum = this.toBase(num, unit)
    return this.format(nnum, fractionDigits)
  }
}
