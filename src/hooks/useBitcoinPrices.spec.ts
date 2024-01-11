import { renderHook } from 'test-utils'
import { useSettingsStore } from '../store/settingsStore/useSettingsStore'
import { useBitcoinPrices } from './useBitcoinPrices'

jest.mock('./query/useMarketPrices', () => ({
  useMarketPrices: () => ({
    data: {
      EUR: 20000,
      CHF: 21000,
    },
  }),
}))

describe('useBitcoinPrices', () => {
  it('should return prices for 1 BTC', () => {
    const { result } = renderHook(() => useBitcoinPrices(100000000))

    expect(result.current).toEqual({
      displayCurrency: 'EUR',
      bitcoinPrice: 20000,
      fiatPrice: 20000,
      moscowTime: 5000,
    })
  })
  it('should return prices for any sats amount', () => {
    const { result } = renderHook(() => useBitcoinPrices(1337420))

    expect(result.current).toEqual({
      displayCurrency: 'EUR',
      bitcoinPrice: 20000,
      fiatPrice: 267.48,
      moscowTime: 5000,
    })
  })
  it('should return correct display price for any sats amount', () => {
    useSettingsStore.getState().setDisplayCurrency('CHF')
    const { result } = renderHook(() => useBitcoinPrices(1337420))

    expect(result.current.displayCurrency).toBe('CHF')
    expect(result.current.bitcoinPrice).toBe(21000)
  })
})
