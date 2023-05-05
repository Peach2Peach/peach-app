import { renderHook } from '@testing-library/react-native'
import { useBitcoinPrices } from './useBitcoinPrices'
import { settingsStore } from '../store/settingsStore'

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
      displayPrice: 20000,
      prices: {
        EUR: 20000,
        CHF: 21000,
      },
    })
  })
  it('should return prices for any sats amount', () => {
    const { result } = renderHook(useBitcoinPrices, {
      initialProps: { sats: 1337420 },
    })

    expect(result.current).toEqual({
      displayPrice: 267.48,
      prices: {
        EUR: 267.48,
        CHF: 280.86,
      },
    })
  })
  it('should return correct display price for any sats amount', () => {
    settingsStore.getState().setDisplayCurrency('CHF')
    const { result } = renderHook(useBitcoinPrices, {
      initialProps: { sats: 1337420 },
    })

    expect(result.current.displayPrice).toBe(280.86)
  })
})
