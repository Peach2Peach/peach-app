import { getTradingAmountLimits } from '../../../../src/utils/market'

describe('getTradingAmountLimits', () => {
  it('calculates the trading amount limits based on the given price', () => {
    const [min, max] = getTradingAmountLimits(29980)
    expect(min).toEqual(70000)
    expect(max).toEqual(2660000)
  })
})
