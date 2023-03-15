import { getTradingAmountLimits } from '.'

describe('getTradingAmountLimits', () => {
  it('calculates the trading amount limits based on the given price', () => {
    const [min, max] = getTradingAmountLimits(29980)
    expect(min).toEqual(40000)
    expect(max).toEqual(2660000)
  })
})
