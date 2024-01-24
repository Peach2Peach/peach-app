import { renderHook } from 'test-utils'
import { SATSINBTC } from '../constants'
import { useSettingsStore } from '../store/settingsStore/useSettingsStore'
import { round } from '../utils/math/round'
import { useBitcoinPrices } from './useBitcoinPrices'

const EUR = 20000
const CHF = 21000
jest.mock('./query/useMarketPrices', () => ({
  useMarketPrices: () => ({
    data: {
      EUR,
      CHF,
    },
  }),
}))

describe('useBitcoinPrices', () => {
  it('should return prices for 1 BTC', () => {
    const AMOUNT_OF_SATS = SATSINBTC
    const { result } = renderHook(() => useBitcoinPrices(AMOUNT_OF_SATS))

    expect(result.current).toEqual({
      displayCurrency: 'EUR',
      bitcoinPrice: EUR,
      fiatPrice: EUR * (AMOUNT_OF_SATS / SATSINBTC),
      moscowTime: SATSINBTC / EUR,
    })
  })
  it('should return prices for any sats amount', () => {
    const AMOUNT_OF_SATS = 1337420
    const { result } = renderHook(() => useBitcoinPrices(AMOUNT_OF_SATS))

    expect(result.current).toEqual({
      displayCurrency: 'EUR',
      bitcoinPrice: EUR,
      fiatPrice: round(EUR * (AMOUNT_OF_SATS / SATSINBTC), 2),
      moscowTime: SATSINBTC / EUR,
    })
  })
  it('should return correct display price for any sats amount', () => {
    useSettingsStore.getState().setDisplayCurrency('CHF')
    const AMOUNT_OF_SATS = 1337420
    const { result } = renderHook(() => useBitcoinPrices(AMOUNT_OF_SATS))

    expect(result.current.displayCurrency).toBe('CHF')
    expect(result.current.bitcoinPrice).toBe(CHF)
  })
})
