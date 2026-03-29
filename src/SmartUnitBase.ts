import type Decimal from 'decimal.js'
import type { FormattedValue, FractionDigits, InputNumber, SmartUnitOptions } from './utils'

export abstract class SmartUnitBase<U extends string = string, D extends boolean = false> {
  readonly threshold: number
  readonly separator: string
  readonly fractionDigits?: FractionDigits
  readonly unitNames: U[] = []
  readonly unitDigits: number[] = []

  _accumulatedDigits?: number[]
  /** Accumulated digits for unit conversion */
  get accumulatedDigits() {
    if (!this._accumulatedDigits) this.createAccumulatedDigits()
    return this._accumulatedDigits
  }
  _sortedUnitNames?: U[]
  /** Sorted unit names by length for efficient lookup */
  get sortedUnitNames() {
    if (!this._sortedUnitNames) this.createSortedUnitNames()
    return this._sortedUnitNames
  }

  /** Unit conversion function */
  public convert?: (str: U) => string

  constructor(units: (U | number)[], option: SmartUnitOptions = {}) {
    // Initialize
    if (!units.length) throw new Error('units is empty.')
    this.threshold = option.threshold || 1
    this.fractionDigits = option.fractionDigits
    this.separator = option.separator || ''

    if (option.baseDigit) {
      for (let i = 0; i < units.length; i++) {
        const name = units[i] as U
        if (typeof name !== 'string')
          throw new Error(
            `The unit setting is incorrect; the element at index [${i}] should be of string type.`,
          )
      }
      this.unitNames = units as U[]
      this.unitDigits = Array(units.length - 1).fill(option.baseDigit)
    } else {
      for (let i = 1; i < units.length; i += 2) {
        const digit = units[i]
        if (typeof digit !== 'number')
          throw new Error(
            `The unit setting is incorrect; the element at index [${i}] should be of numeric type.`,
          )
        this.unitDigits.push(units[i] as number)
        const name = units[i - 1] as U
        if (typeof name !== 'string')
          throw new Error(
            `The unit setting is incorrect; the element at index [${i - 1}] should be of string type.`,
          )
        this.unitNames.push(name)
      }
      this.unitNames.push(units[units.length - 1] as U)
    }
  }

  withConvert(convert: (str: U) => string): this {
    const su = Object.create(this) as this
    su.convert = convert
    return su
  }

  // 累积比例
  protected createAccumulatedDigits() {
    const accumulatedDigits = []
    this.unitDigits.forEach((digit, index) => {
      if (index === 0) {
        accumulatedDigits.push(digit)
      } else {
        accumulatedDigits.push(accumulatedDigits[index - 1] * digit)
      }
    })
    this._accumulatedDigits = accumulatedDigits
  }

  // 长度排序后的单位名称
  protected createSortedUnitNames() {
    const sortedUnits = [...this.unitNames].sort((a, b) => b.length - a.length)
    this._sortedUnitNames = sortedUnits
  }

  // 格式化数字的小数位数
  /**
   * Formats the decimal places of a number
   *
   * @param value - The value to format
   * @param fractionDigits - Decimal precision configuration
   * @returns The formatted string representation of the number
   */
  formatNumber(
    value: number | Decimal,
    fractionDigits: FractionDigits = this.fractionDigits,
  ): string {
    if (typeof fractionDigits === 'number') {
      return value.toFixed(fractionDigits)
    } else if (typeof fractionDigits === 'string') {
      const [dp1, dp2] = fractionDigits.split('-')
      const ndp = (value.toString().split('.')[1] || '').length

      const minDp = dp1 ? +dp1 : -Infinity
      const maxDp = dp2 ? +dp2 : Infinity

      if (ndp < minDp) {
        return value.toFixed(minDp)
      } else if (ndp > maxDp) {
        return value.toFixed(maxDp)
      } else {
        return value.toString()
      }
    } else {
      return value.toString()
    }
  }

  abstract getUnit(num: InputNumber, fractionDigits?: FractionDigits): FormattedValue<U>

  // format抽象方法
  protected _format(numStr: string, unit: U): string {
    return `${numStr}${this.convert ? this.convert(unit) : unit}`
  }

  abstract format(num: InputNumber, fractionDigits?: FractionDigits): string

  // 根据输入数值获取链式单位数组
  abstract getChainUnit(num: InputNumber): FormattedValue<U>[]

  protected _formatChain(chain: FormattedValue<U>[], separator = this.separator) {
    return chain.map(({ numStr, unit }) => this._format(numStr, unit)).join(separator)
  }

  // 将数字格式化为链式单位字符串
  formatChain(num: InputNumber, separator = this.separator): string {
    const chain = this.getChainUnit(num)
    return this._formatChain(chain, separator)
  }

  // 将给定数值从指定单位转换为基本单位
  abstract toBase(num: InputNumber, unit: U): D extends true ? Decimal : number

  // 从给定字符串中分离出数字部分和单位
  /**
   * Splits a string into its numeric part and unit
   *
   * @param str - Input string containing a number followed by a unit
   * @returns An object containing the numeric value, unit, and Decimal instance
   * @throws An error if no predefined unit is matched
   */
  splitUnit(str: string): FormattedValue<U> {
    const sortedUnits = this.sortedUnitNames

    for (const unit of sortedUnits) {
      const matchUnit = this.convert ? this.convert(unit) : unit
      if (str.endsWith(matchUnit)) {
        const numStr = str.slice(0, -matchUnit.length)
        const num = +numStr
        if (Number.isNaN(num)) throw new Error(`Invalid number: "${numStr}".`)
        return {
          num,
          unit,
          numStr,
        }
      }
    }

    throw new Error(`Undefined unit: "${str}".`)
  }

  // 从给定链式单位字符串中分离出数字部分和单位
  /**
   * Splits a string into its numeric part and unit
   *
   * @param str - Input string containing a number followed by a unit
   * @returns An object containing the numeric value, unit, and Decimal instance
   * @throws An error if no predefined unit is matched
   */
  splitChainUnit(str: string, separator: string = this.separator): FormattedValue<U>[] {
    const results: FormattedValue<U>[] = []
    const sortedUnits = this.sortedUnitNames

    const strLen = str.length
    let start = 0
    for (let i = 0; i < strLen; i++) {
      for (const unit of sortedUnits) {
        const matchUnit = this.convert ? this.convert(unit) : unit
        if (str.slice(i, i + matchUnit.length) === matchUnit) {
          const numStr = str.slice(start, i)
          const num = +numStr
          if (Number.isNaN(num)) throw new Error(`Invalid number: "${numStr}".`)
          results.push({
            num,
            unit,
            numStr,
          })
          i += matchUnit.length + separator.length
          start = i
          break
        }
      }
    }
    if (results.length > 0) return results
    throw new Error(`Undefined unit: "${str}".`)
  }

  // 将带单位的字符串转换为基础单位的数值
  abstract parse(str: string): D extends true ? Decimal : number

  // 将带链式单位的字符串转换为基础单位的数值
  abstract parseChain(str: string): D extends true ? Decimal : number

  // 将给定数值从原单位转换为最佳单位，并可指定小数精度
  abstract fromUnitFormat(num: InputNumber, unit: U, fractionDigits?: FractionDigits): string
}
