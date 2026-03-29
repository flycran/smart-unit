import { describe, expect, it } from 'vitest'
import SmartUnit from '../src'

// 链式单位测试
const time = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h'], {
  separator: ' ',
})

// 格式化
describe('Chain unit formatChain', () => {
  it('should format', () => {
    expect(time.formatChain(1000)).toEqual('1s')
    expect(time.formatChain(63000)).toEqual('1m 3s')
    expect(time.formatChain(3663000)).toEqual('1h 1m 3s')
  })

  it('should format with custom separator', () => {
    expect(time.formatChain(1000, ':')).toEqual('1s')
    expect(time.formatChain(63000, ':')).toEqual('1m:3s')
    expect(time.formatChain(3663000, ':')).toEqual('1h:1m:3s')
  })

  it('should format zero', () => {
    expect(time.formatChain(0)).toEqual('0ms')
  })

  it('should format negative values', () => {
    expect(time.formatChain(-63000)).toEqual('-1m -3s')
    expect(time.formatChain(-500)).toEqual('-500ms')
    expect(time.formatChain(-1000)).toEqual('-1s')
  })
})

// 获取单位
describe('Chain unit getChainUnit', () => {
  it('should return array for 1000ms', () => {
    const result = time.getChainUnit(1000)
    expect(result).toEqual([{ num: 1, unit: 's', numStr: '1' }])
  })

  it('should return array for 63000ms', () => {
    const result = time.getChainUnit(63000)
    expect(result).toEqual([
      { num: 1, unit: 'm', numStr: '1' },
      { num: 3, unit: 's', numStr: '3' },
    ])
  })

  it('should format zero', () => {
    expect(time.getChainUnit(0)).toEqual([{ num: 0, unit: 'ms', numStr: '0' }])
  })

  it('should format negative values', () => {
    expect(time.getChainUnit(-63000)).toEqual([
      { num: -1, unit: 'm', numStr: '-1' },
      { num: -3, unit: 's', numStr: '-3' },
    ])
    expect(time.getChainUnit(-500)).toEqual([{ num: -500, unit: 'ms', numStr: '-500' }])
    expect(time.getChainUnit(-1000)).toEqual([{ num: -1, unit: 's', numStr: '-1' }])
  })
})

// 分割单位
describe('Chain unit splitChainUnit', () => {
  it('should ssplitChainUnit', () => {
    expect(time.splitChainUnit('1s')).toEqual([{ num: 1, unit: 's', numStr: '1' }])
    expect(time.splitChainUnit('1m 3s')).toEqual([
      { num: 1, unit: 'm', numStr: '1' },
      { num: 3, unit: 's', numStr: '3' },
    ])
    expect(time.splitChainUnit('1h 1m 3s')).toEqual([
      { num: 1, unit: 'h', numStr: '1' },
      { num: 1, unit: 'm', numStr: '1' },
      { num: 3, unit: 's', numStr: '3' },
    ])
  })

  it('should splitChainUnit with custom separator', () => {
    expect(time.splitChainUnit('1s', ':')).toEqual([{ num: 1, unit: 's', numStr: '1' }])
    expect(time.splitChainUnit('1m:3s', ':')).toEqual([
      { num: 1, unit: 'm', numStr: '1' },
      { num: 3, unit: 's', numStr: '3' },
    ])
    expect(time.splitChainUnit('1h:1m:3s', ':')).toEqual([
      { num: 1, unit: 'h', numStr: '1' },
      { num: 1, unit: 'm', numStr: '1' },
      { num: 3, unit: 's', numStr: '3' },
    ])
  })

  it('should splitChainUnit with zero', () => {
    expect(time.splitChainUnit('0ms')).toEqual([{ num: 0, unit: 'ms', numStr: '0' }])
  })

  it('should splitChainUnit with negative values', () => {
    expect(time.splitChainUnit('-1s')).toEqual([{ num: -1, unit: 's', numStr: '-1' }])
    expect(time.splitChainUnit('-1m -3s')).toEqual([
      { num: -1, unit: 'm', numStr: '-1' },
      { num: -3, unit: 's', numStr: '-3' },
    ])
    expect(time.splitChainUnit('-1h -1m -3s')).toEqual([
      { num: -1, unit: 'h', numStr: '-1' },
      { num: -1, unit: 'm', numStr: '-1' },
      { num: -3, unit: 's', numStr: '-3' },
    ])
  })
})

// 解析单位
describe('Chain unit parseChain', () => {
  it('should parse', () => {
    expect(time.parseChain('1s')).toEqual(1000)
    expect(time.parseChain('1m 3s')).toEqual(63000)
    expect(time.parseChain('1h 1m 3s')).toEqual(3663000)
  })

  it('should parse with custom separator', () => {
    expect(time.parseChain('1s', ':')).toEqual(1000)
    expect(time.parseChain('1m:3s', ':')).toEqual(63000)
    expect(time.parseChain('1h:1m:3s', ':')).toEqual(3663000)
  })

  it('should parse zero', () => {
    expect(time.parseChain('0ms')).toEqual(0)
  })

  it('should parse negative values', () => {
    expect(time.parseChain('-1s')).toEqual(-1000)
    expect(time.parseChain('-1m -3s')).toEqual(-63000)
    expect(time.parseChain('-1h -1m -3s')).toEqual(-3663000)
  })
})

// 巡回测试
describe('Chain unit circulation', () => {
  it('should circulation', () => {
    expect(time.formatChain(time.parseChain('1s'))).toEqual('1s')
    expect(time.formatChain(time.parseChain('1m 3s'))).toEqual('1m 3s')
    expect(time.formatChain(time.parseChain('1h 1m 3s'))).toEqual('1h 1m 3s')
  })

  it('should circulation with custom separator', () => {
    expect(time.formatChain(time.parseChain('1s', ':'), ':')).toEqual('1s')
    expect(time.formatChain(time.parseChain('1m 3s', ':'), ':')).toEqual('1m:3s')
    expect(time.formatChain(time.parseChain('1h 1m 3s', ':'), ':')).toEqual('1h:1m:3s')
  })

  it('should circulation with zero', () => {
    expect(time.formatChain(time.parseChain('0ms'))).toEqual('0ms')
  })

  it('should circulation with negative values', () => {
    expect(time.formatChain(time.parseChain('-1s'))).toEqual('-1s')
    expect(time.formatChain(time.parseChain('-1m -3s'))).toEqual('-1m -3s')
    expect(time.formatChain(time.parseChain('-1h -1m -3s'))).toEqual('-1h -1m -3s')
  })
})
