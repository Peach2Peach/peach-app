import { getTradingAmountLimits } from '../../../../src/utils/market'

describe('getTradingAmountLimits', () => {
  it('calculates the trading amount limits based on the given price', () => {
    const [min, max] = getTradingAmountLimits(29980)
    expect(min).toBeCloseTo(70000)
    expect(max).toBeCloseTo(2660000)
  })
})
