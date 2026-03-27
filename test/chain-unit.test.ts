import { describe, expect, it } from 'vitest'
import SmartUnit from '../src'

// 链式单位测试 - 时间单位
describe('Chain unit - time units', () => {
  const time = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h'])

  it('should format 1000ms as 1s', () => {
    expect(time.formatChain(1000)).toEqual('1s')
  })

  it('should format 63000ms as 1m3s', () => {
    expect(time.formatChain(63000)).toEqual('1m3s')
  })

  it('should format 3663000ms as 1h1m3s', () => {
    expect(time.formatChain(3663000)).toEqual('1h1m3s')
  })

  it('should format 500ms as 500ms', () => {
    expect(time.formatChain(500)).toEqual('500ms')
  })

  it('should format 0ms as 0ms', () => {
    expect(time.formatChain(0)).toEqual('0ms')
  })

  it('getChainUnit should return array for 63000ms', () => {
    const result = time.getChainUnit(63000)
    expect(result).toEqual([
      { num: 1, unit: 'm', numStr: '1' },
      { num: 3, unit: 's', numStr: '3' },
    ])
  })
})

// 链式单位测试 - 文件大小
describe('Chain unit - file size', () => {
  const size = new SmartUnit(['B', 1024, 'KB', 1024, 'MB', 1024, 'GB'])

  it('should format 1536B as 1KB512B', () => {
    expect(size.formatChain(1536)).toEqual('1KB512B')
  })

  it('should format 1073741824B as 1GB', () => {
    expect(size.formatChain(1073741824)).toEqual('1GB')
  })

  it('should format 1074790400B as 1GB1MB', () => {
    expect(size.formatChain(1074790400)).toEqual('1GB1MB')
  })
})

// 链式单位测试 - 距离单位
describe('Chain unit - distance units', () => {
  const distance = new SmartUnit(['mm', 10, 'cm', 100, 'm', 1000, 'km'])

  it('should format 1500mm as 1m50cm', () => {
    expect(distance.formatChain(1500)).toEqual('1m50cm')
  })

  it('should format 1234mm as 1m23cm4mm', () => {
    expect(distance.formatChain(1234)).toEqual('1m23cm4mm')
  })
})

// 链式单位测试 - 负数
describe('Chain unit - negative values', () => {
  const time = new SmartUnit(['ms', 1000, 's', 60, 'm'])

  it('should format -63000ms as -1m-3s', () => {
    expect(time.formatChain(-63000)).toEqual('-1m-3s')
  })

  it('should format -500ms as -500ms', () => {
    expect(time.formatChain(-500)).toEqual('-500ms')
  })
})
