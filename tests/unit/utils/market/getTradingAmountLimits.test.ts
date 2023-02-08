import { getTradingAmountLimits } from '../../../../src/utils/market'

describe('getTradingAmountLimits', () => {
  it('calculates the trading amount limits based on the given price', () => {
    const [min, max] = getTradingAmountLimits(10000)
    expect(min).toBeCloseTo(200000)
    expect(max).toBeCloseTo(8000000)
  })
})
