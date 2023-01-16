import { useMarketPrices } from '../../../../src/hooks'
import { getExchangeRate } from '../../../../src/utils/market'

jest.mock('../../../../src/hooks/useMarketPrices', () => ({
  useMarketPrices: jest.fn(),
}))

describe('getExchangeRate', () => {
  it('should return the correct exchange rate', () => {
    ;(<jest.Mock>useMarketPrices).mockReturnValue({
      data: {
        USD: 1,
        EUR: 1.25,
        CHF: 1.2,
        GBP: 1.6,
        SEK: 0.1,
      },
    })
    expect(getExchangeRate('USD', 'EUR')).toEqual(0.8)
    expect(getExchangeRate('EUR', 'USD')).toEqual(1.25)
    expect(getExchangeRate('CHF', 'GBP')).toBeCloseTo(0.75, 3)
    expect(getExchangeRate('GBP', 'SEK')).toEqual(16)
  })

  it('should return 1 when marketPrices is not available', () => {
    ;(<jest.Mock>useMarketPrices).mockReturnValue({
      data: null,
    })
    expect(getExchangeRate('USD', 'EUR')).toBe(1)
  })

  it('should return 1 when price for currency is not available', () => {
    ;(<jest.Mock>useMarketPrices).mockReturnValue({
      data: {
        USD: 1,
        EUR: 1.2,
        CHF: 1.1,
      },
    })
    expect(getExchangeRate('USD', 'GBP')).toBe(1)
  })
})
