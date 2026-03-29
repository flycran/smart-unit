import {
  SmartUnitBase,
} from './SmartUnitBase'
import { ERROR_NAN_INPUT, type FormattedValue, type FractionDigits, type InputNumber, type SmartUnitOptions } from './utils'

export class SmartUnit<U extends string = string> extends SmartUnitBase<U> {
  constructor(units: (U | number)[], option: SmartUnitOptions = {}) {
    super(units, option)
  }

  // 根据输入数值获取单位和调整后的值
  /**
   * Gets the appropriate unit and adjusted value for the input number
   *
   * @param num - The input number to determine the unit for
   * @param fractionDigits - Decimal precision configuration
   * @returns The FormattedValue object containing the number, unit, and formatted number string
   */
  getUnit(num: InputNumber, fractionDigits: FractionDigits = this.fractionDigits): FormattedValue<U> {
    if (Number.isNaN(num)) throw new Error(ERROR_NAN_INPUT)
    const unitDigitsLen = this.unitDigits.length
    const isNegative = num < 0
    let absNum = isNegative ? -num : num
    let i = 0
    while (i < unitDigitsLen) {
      const digit = this.unitDigits[i]
      if (absNum < digit * this.threshold) {
        break
      }
      absNum /= digit
      i++
    }
    const result = isNegative ? -absNum : absNum
    return {
      num: result,
      unit: this.unitNames[i],
      numStr: this.formatNumber(result, fractionDigits),
    }
  }

  // 将数字转换为字符串表示形式，并可选择配置小数位数
  /**
   * Formats a number as a string with unit and optional decimal place configuration
   *
   * @param num - The input number to format
   * @param fractionDigits - Decimal precision configuration (defaults to instance setting)
   *   - If a number, defines fixed decimal places
   *   - If a string in "min-max" format, defines a range of decimal places
   *   - If omitted, uses the instance's default decimal configuration
   * @returns The formatted string with number and unit (e.g. "1.50KB")
   */
  format(num: InputNumber, fractionDigits: FractionDigits = this.fractionDigits): string {
    const { numStr, unit } = this.getUnit(num, fractionDigits)
    return this._format(numStr, unit)
  }

  // 根据输入数值获取链式单位数组
  /**
   * Gets the chain of units for the input number
   * @param num - The input number to determine the chain for
   * @returns An array of FormattedValue objects representing the chain of units
   */
  getChainUnit(num: InputNumber): FormattedValue<U>[] {
    if (Number.isNaN(num)) throw new Error(ERROR_NAN_INPUT)

    const result: FormattedValue<U>[] = []
    if (num === 0) {
      return [{ num: 0, unit: this.unitNames[0], numStr: '0' }]
    }
    const isNegative = num < 0
    let absNum = isNegative ? -num : num

    const accDigLen = this.accumulatedDigits.length

    for (let i = accDigLen - 1; i >= 0; i--) {
      const accDigit = this.accumulatedDigits[i]
      if (absNum < accDigit) continue
      const res = Math.floor(absNum / accDigit)
      const val = isNegative ? -res : res
      result.push({
        num: val,
        unit: this.unitNames[i + 1],
        numStr: val.toString(),
      })
      absNum %= accDigit
      if (absNum === 0) break
    }

    if (absNum !== 0) {
      const val = isNegative ? -absNum : absNum
      result.push({
        num: val,
        unit: this.unitNames[0],
        numStr: this.formatNumber(val, this.fractionDigits),
      })
    }
    return result
  }

  // 将数字格式化为链式单位字符串
  /**
   * Formats a number as a chain of units string
   * @param num - The input number to format
   * @returns The formatted chain string
   */
  formatChain(num: InputNumber, separator = this.separator): string {
    const chain = this.getChainUnit(num)
    return this._formatChain(chain, separator)
  }

  // 将给定数值从指定单位转换为基本单位
  /**
   * Converts a value from the specified unit to the base unit
   *
   * @param num - The number to convert
   * @param unit - The original unit of the number
   * @returns The converted value in base unit
   */
  toBase(num: InputNumber, unit: U): number {
    if (Number.isNaN(num)) throw new Error(ERROR_NAN_INPUT)
    const unitDigitsLen = this.unitDigits.length
    let nn = num
    for (let i = 0; i < unitDigitsLen; i++) {
      const digit = this.unitDigits[i]
      if (this.unitNames[i] === unit) {
        return nn
      }
      nn *= digit
    }
    if (unit === this.unitNames.at(-1)) {
      return nn
    }
    throw new Error(`Undefined unit: "${unit}".`)
  }

  // 将带单位的值转换为基础单位的数值
  /**
   * Parses a string with unit into a base unit numeric value
   *
   * @param str - Input string containing a number and unit
   * @returns The value converted to base unit
   */
  parse(str: string): number {
    const { num, unit } = this.splitUnit(str)
    return this.toBase(num, unit)
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
  fromUnitFormat(num: InputNumber, unit: U, fractionDigits?: FractionDigits): string {
    const nnum = this.toBase(num, unit)
    return this.format(nnum, fractionDigits)
  }
}
