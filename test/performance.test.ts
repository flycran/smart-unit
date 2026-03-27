import { describe, expect, it } from 'vitest'
import SmartUnit from '../src'

const results: {
  name: string
  average: number
  total: number
}[] = []

function benchmark(name: string, fn: () => void) {
  for (let i = 0; i < 100; i++) {
    fn()
  }

  const count = 100
  const iterations = 10000
  const results1: number[] = []

  for (let i = 0; i < count; i++) {
    const start = performance.now()
    for (let i = 0; i < iterations; i++) {
      fn()
    }
    const end = performance.now()
    results1.push(end - start)
  }

  const total = results1.reduce((a, b) => a + b, 0)

  results.push({
    name,
    average: total / count,
    total,
  })
}

// 链式单位性能测试
describe('performance tests', () => {
  // 测试数据
  const time = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h'])
  const timeHP = new SmartUnit(['ms', 1000, 's', 60, 'm', 60, 'h'], { useDecimal: true })

  benchmark('getChainUnit', () => {
    time.getChainUnit(6300000)
  })

  benchmark('getChainUnit & useDecimal', () => {
    timeHP.getChainUnit(6300000)
  })

  benchmark('getUnit', () => {
    time.getUnit(6300000)
  })

  benchmark('getUnit & useDecimal', () => {
    timeHP.getUnit(6300000)
  })

  console.table(
    results.map((result) => ({
      ...result,
      average: `${result.average.toFixed(2)}ms`,
      total: `${result.total.toFixed(2)}ms`,
    })),
  )

  it('getChainUnit should be less than 120ms', () => {
    expect(results[0].total).lt(120)
  })
  it('getChainUnit & useDecimal should be less than 4000ms', () => {
    expect(results[1].total).lt(4000)
  })
  it('getUnit should be less than 100ms', () => {
    expect(results[2].total).lt(100)
  })
  it('getUnit & useDecimal should be less than 2000ms', () => {
    expect(results[3].total).lt(2000)
  })
})
