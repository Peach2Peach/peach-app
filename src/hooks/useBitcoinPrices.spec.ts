import { renderHook } from 'test-utils'
import { useSettingsStore } from '../store/settingsStore'
import { useBitcoinPrices } from './useBitcoinPrices'

const useMarketPricesMock = jest.fn().mockReturnValue({
  data: {
    EUR: 20000,
    CHF: 21000,
  },
})
jest.mock('./query/useMarketPrices', () => ({
  useMarketPrices: () => useMarketPricesMock(),
}))

describe('useBitcoinPrices', () => {
  it('should return prices for 1 BTC', () => {
    const { result } = renderHook(useBitcoinPrices, {
      initialProps: { sats: 100000000 },
    })

    expect(result.current).toEqual({
      displayCurrency: 'EUR',
      displayPrice: 20000,
      prices: {
        EUR: 20000,
        CHF: 21000,
      },
      fullDisplayPrice: 20000,
      fullPrices: {
        CHF: 21000,
        EUR: 20000,
      },
    })
  })
  it('should return prices for any sats amount', () => {
    const { result } = renderHook(useBitcoinPrices, {
      initialProps: { sats: 1337420 },
    })

    expect(result.current).toEqual({
      displayCurrency: 'EUR',
      displayPrice: 267.48,
      prices: {
        EUR: 267.48,
        CHF: 280.86,
      },
      fullDisplayPrice: 20000,
      fullPrices: {
        CHF: 21000,
        EUR: 20000,
      },
    })
  })
  it('should return correct display price for any sats amount', () => {
    useSettingsStore.getState().setDisplayCurrency('CHF')
    const { result } = renderHook(useBitcoinPrices, {
      initialProps: { sats: 1337420 },
    })

    expect(result.current.displayCurrency).toBe('CHF')
    expect(result.current.displayPrice).toBe(280.86)
  })
})
