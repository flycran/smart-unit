import DecimalConstructor, { type Decimal } from 'decimal.js'

export type FractionDigits =
  | number
  | `-${number}`
  | `${number}-`
  | `${number}-${number}`
  | undefined

export type DecimalOptions = Decimal.Config

export type PickUnit<U extends string | number> = Exclude<U, number>

export interface SmartUnitOptions<HP extends boolean, U extends string | number> {
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
  /**
   * Custom unit string conversion function
   * - Often used for i18n
   */
  convert?: (str: PickUnit<U>) => string
}

export interface FormattedValue<U extends string> {
  // 数值
  /** The numeric value */
  num: number
  // Decimal 高精度数值
  /** The Decimal instance for high-precision mode */
  decimal?: Decimal
  // 单位
  /** The unit string */
  unit: U
  // 格式化后的数字字符串（已处理小数位数）
  /** The number string with decimal places applied */
  numStr?: string
}

export type Num<D extends boolean = false> = D extends true
  ? number | bigint | string | Decimal
  : number

export const ERROR_NAN_INPUT =
  'Accepting NaN as an argument may be unintentional and could lead to invalid results. If this is intentional, please set `SmartUnit.ignoreNaNInputs` to `true`.'

export const ERROR_HIGH_PRECISION_NOT_ENABLED =
  'By default, only number input is supported. To enable high-precision calculations, explicitly set the decimalSafety parameter to true.'

export class SmartUnit<D extends boolean = false, U extends string | number = string> {
  static ignoreNaNInputs = false
  readonly threshold: number
  readonly fractionDigits?: FractionDigits
  readonly unitsStr: PickUnit<U>[] = []
  readonly useDecimal: D
  public convert?: (str: PickUnit<U>) => string
  private DecimalClass: typeof DecimalConstructor = DecimalConstructor

  constructor(
    readonly units: U[],
    option: SmartUnitOptions<D, U> = {},
  ) {
    if (!units.length) throw new Error('units is empty.')
    this.threshold = option.threshold || 1
    this.fractionDigits = option.fractionDigits
    this.useDecimal = option.useDecimal
    if (option.decimalOptions) {
      this.DecimalClass = DecimalConstructor.clone(option.decimalOptions)
    }
    if (option.baseDigit) {
      const us = []
      for (let i = 0; i < units.length; i++) {
        this.unitsStr.push(units[i] as PickUnit<U>)
        us.push(units[i], option.baseDigit)
      }
      this.units = us.slice(0, -1)
    } else {
      for (let i = 0; i < units.length; i += 2) {
        this.unitsStr.push(units[i] as PickUnit<U>)
      }
      this.units = units
    }
  }

  // 根据输入数值获取单位和调整后的值
  /**
   * Gets the appropriate unit and adjusted value for the input number
   *
   * @param num - The input number to determine the unit for
   * @returns An object containing the adjusted number, its corresponding unit, and the formatted number string
   */
  getUnit(num: Num<D>): FormattedValue<PickUnit<U>> {
    if (!SmartUnit.ignoreNaNInputs && Number.isNaN(num)) throw new Error(ERROR_NAN_INPUT)
    let i = 1

    if (this.useDecimal) {
      const dn = new this.DecimalClass(typeof num === 'bigint' ? num.toString() : num)
      const isNegative = dn.isNegative()
      let absDn = isNegative ? dn.abs() : dn
      while (i < this.units.length - 1) {
        const n = this.units[i]
        if (typeof n !== 'number')
          throw new Error(
            `The unit setting is incorrect; the element at index [${i}] should be of numeric type.`,
          )
        if (absDn.lt(n * this.threshold)) {
          break
        }
        absDn = absDn.dividedBy(n)
        i += 2
      }
      const result = isNegative ? absDn.neg() : absDn
      const n = result.toNumber()
      return {
        num: n,
        decimal: result,
        unit: this.units[i - 1] as PickUnit<U>,
        numStr: this.formatNumber(result, this.fractionDigits),
      }
    } else {
      if (typeof num !== 'number') throw new Error(ERROR_HIGH_PRECISION_NOT_ENABLED)
      const isNegative = num < 0
      let absNum = isNegative ? -num : num
      while (i < this.units.length - 1) {
        const n = this.units[i]
        if (typeof n !== 'number')
          throw new Error(
            `The unit setting is incorrect; the element at index [${i}] should be of numeric type.`,
          )
        if (absNum < n * this.threshold) {
          break
        }
        absNum /= n
        i += 2
      }
      const result = isNegative ? -absNum : absNum
      return {
        num: result,
        unit: this.units[i - 1] as PickUnit<U>,
        numStr: this.formatNumber(result, this.fractionDigits),
      }
    }
  }

  // 格式化数字的小数位数
  /**
   * Formats the decimal places of a number
   *
   * @param value - The value to format (number or Decimal for high-precision mode)
   * @param fractionDigits - Decimal precision configuration (defaults to instance setting)
   *   - If a number, defines fixed decimal places
   *   - If a string in "min-max" format, defines a range of decimal places
   *   - If omitted, returns the number as-is
   * @returns The formatted string representation of the number
   */
  protected formatNumber(
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
  format(num: Num<D>, fractionDigits: FractionDigits = this.fractionDigits): string {
    const { num: n, unit, decimal } = this.getUnit(num)
    const formatted = this.formatNumber(decimal ?? n, fractionDigits)
    return `${formatted}${this.convert ? this.convert(unit) : unit}`
  }

  // 根据输入数值获取链式单位数组
  /**
   * Gets the chain of units for the input number
   * For example, 63000ms with ['ms', 1000, 's', 60, 'm'] returns
   * [{ num: 1, unit: 'm', numStr: '1', decimal: ... }, { num: 3, unit: 's', numStr: '3', decimal: ... }]
   *
   * @param num - The input number to determine the chain for
   * @returns An array of FormattedValue objects representing the chain of units
   */
  getChainUnit(num: Num<D>): FormattedValue<PickUnit<U>>[] {
    if (!SmartUnit.ignoreNaNInputs && Number.isNaN(num)) throw new Error(ERROR_NAN_INPUT)

    const result: FormattedValue<PickUnit<U>>[] = []

    if (this.useDecimal) {
      const dn = new this.DecimalClass(typeof num === 'bigint' ? num.toString() : num)
      const isNegative = dn.isNegative()
      let absDn = isNegative ? dn.abs() : dn

      // 从最大的单位开始，逐级向下计算
      // 单位数组: [unit0, base0, unit1, base1, unit2, base2, unit3, ...]
      // 从最后一个单位开始向前遍历
      for (let i = this.units.length - 1; i >= 0; i -= 2) {
        const unit = this.units[i] as PickUnit<U>

        // 计算当前单位的值：从基础单位累计乘积到当前单位
        let baseProduct = new this.DecimalClass(1)
        for (let j = 1; j < i; j += 2) {
          const base = this.units[j]
          if (typeof base === 'number') {
            baseProduct = baseProduct.times(base)
          }
        }

        if (absDn.gte(baseProduct)) {
          const quotient = absDn.dividedToIntegerBy(baseProduct)
          const remainder = absDn.minus(quotient.times(baseProduct))

          if (!quotient.isZero()) {
            const signedQuotient = isNegative ? quotient.neg() : quotient
            result.push({
              num: signedQuotient.toNumber(),
              decimal: signedQuotient,
              unit,
              numStr: this.formatNumber(signedQuotient, this.fractionDigits),
            })
          }
          absDn = remainder
        }
      }

      // 如果没有添加任何单位（值太小），添加基础单位
      if (result.length === 0) {
        const baseUnit = this.units[0] as PickUnit<U>
        const signedValue = isNegative ? absDn.neg() : absDn
        result.push({
          num: signedValue.toNumber(),
          decimal: signedValue,
          unit: baseUnit,
          numStr: this.formatNumber(signedValue, this.fractionDigits),
        })
      }
    } else {
      if (typeof num !== 'number') throw new Error(ERROR_HIGH_PRECISION_NOT_ENABLED)
      const isNegative = num < 0
      let absNum = isNegative ? -num : num

      const unitsLen = this.units.length - 1

      for (let i = 1; i < unitsLen; i += 2) {
        const n = this.units[i]
        if (typeof n !== 'number')
          throw new Error(
            `The unit setting is incorrect; the element at index [${i}] should be of numeric type.`,
          )
        const m = Math.floor(absNum % n)
        if (m >= 1) {
          const r = isNegative ? -m : m
          result.push({
            num: r,
            unit: this.units[i - 1] as PickUnit<U>,
            numStr: this.formatNumber(r, this.fractionDigits),
          })
        }
        if (absNum < 1) break
        absNum /= n
      }

      if (absNum >= 1) {
        const m = Math.floor(absNum)
        const r = isNegative ? -m : m
        result.push({
          num: r,
          unit: this.units[this.units.length - 1] as PickUnit<U>,
          numStr: this.formatNumber(r, this.fractionDigits),
        })
      }

      if (result.length === 0) {
        result.push({
          num: 0,
          unit: this.units[0] as PickUnit<U>,
          numStr: this.formatNumber(0, this.fractionDigits),
        })
      }
    }

    return result.reverse()
  }

  // 将数字格式化为链式单位字符串
  /**
   * Formats a number as a chain of units string
   * For example, 63000ms with ['ms', 1000, 's', 60, 'm'] returns "1m3s"
   *
   * @param num - The input number to format
   * @returns The formatted chain string (e.g. "1m3s")
   */
  formatChain(num: Num<D>): string {
    const chain = this.getChainUnit(num)
    return chain
      .map(({ numStr, unit }) => `${numStr}${this.convert ? this.convert(unit) : unit}`)
      .join('')
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
  toBase(num: Num<D>, unit: string): D extends true ? Decimal : number {
    if (!SmartUnit.ignoreNaNInputs && Number.isNaN(num)) throw new Error(ERROR_NAN_INPUT)
    let i = 0

    if (this.useDecimal) {
      // High-precision calculation
      let dn = new this.DecimalClass(typeof num === 'bigint' ? num.toString() : num)
      while (i < this.units.length) {
        if (this.units[i] === unit) {
          return dn as D extends true ? Decimal : number
        }
        if (typeof this.units[i] === 'undefined') {
          break
        }
        const cn = this.units[i + 1]
        if (typeof cn !== 'number')
          throw Error(
            `The unit setting is incorrect; the element at index [${i}] should be of numeric type.`,
          )
        dn = dn.times(cn)
        i += 2
      }
    } else {
      if (typeof num !== 'number') throw new Error(ERROR_HIGH_PRECISION_NOT_ENABLED)
      let nn = num
      // Normal calculation
      while (i < this.units.length) {
        if (this.units[i] === unit) {
          return nn as D extends true ? Decimal : number
        }
        if (typeof this.units[i + 1] === 'undefined') {
          break
        }
        if (typeof this.units[i + 1] !== 'number')
          throw Error(
            `The unit setting is incorrect; the element at index [${i}] should be of numeric type.`,
          )
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
   * @returns An object containing the numeric value, unit, and Decimal instance (if high-precision mode is enabled)
   * @throws An error if no predefined unit is matched
   */
  splitUnit(str: string): FormattedValue<PickUnit<U>> {
    const re = new RegExp(`^(\\d+(?:\\.\\d+)?)(${this.unitsStr.map((u) => `${u}`).join('|')})`)

    const [, num, unit] = str.match(re) || []

    if (num === undefined || unit === undefined) {
      throw new Error(`Undefined unit: "${str}".`)
    }

    return {
      num: +num,
      unit: unit as PickUnit<U>,
      decimal: this.useDecimal ? new this.DecimalClass(num) : undefined,
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
  parse(str: string): D extends true ? Decimal : number {
    const { num, unit, decimal } = this.splitUnit(str)
    return this.toBase((decimal ?? num) as Num<D>, unit)
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
  fromUnitFormat(num: Num<D>, unit: string, fractionDigits?: FractionDigits): string {
    const nnum = this.toBase(num, unit)
    return this.format(nnum, fractionDigits)
  }
}
