import { useMarketPrices } from '../../../../src/hooks'
import { useExchangeRate } from '../../../../src/utils/market'

jest.mock('../../../../src/hooks/useMarketPrices', () => ({
  useMarketPrices: jest.fn(),
}))

describe('useExchangeRate', () => {
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
    expect(useExchangeRate('USD', 'EUR')).toEqual(0.8)
    expect(useExchangeRate('EUR', 'USD')).toEqual(1.25)
    expect(useExchangeRate('CHF', 'GBP')).toBeCloseTo(0.75, 3)
    expect(useExchangeRate('GBP', 'SEK')).toEqual(16)
  })

  it('should return 1 when marketPrices is not available', () => {
    ;(<jest.Mock>useMarketPrices).mockReturnValue({
      data: null,
    })
    expect(useExchangeRate('USD', 'EUR')).toBe(1)
  })

  it('should return 1 when price for currency is not available', () => {
    ;(<jest.Mock>useMarketPrices).mockReturnValue({
      data: {
        USD: 1,
        EUR: 1.2,
        CHF: 1.1,
      },
    })
    expect(useExchangeRate('USD', 'GBP')).toBe(1)
  })
})
