import { renderHook } from 'test-utils'
import { useConfigStore } from '../store/configStore/configStore'
import { useOfferPreferences } from '../store/offerPreferenes/useOfferPreferences'
import { useUpdateTradingAmounts } from './useUpdateTradingAmounts'

jest.mock('./query/useMarketPrices', () => ({
  useMarketPrices: jest.fn(() => ({ data: { CHF: 20000 } })),
}))

describe('useUpdateTradingAmounts', () => {
  it('updates the min and max trading amounts correctly', () => {
    useConfigStore.getState().setMinTradingAmount(5)
    useConfigStore.getState().setMaxTradingAmount(400)

    renderHook(useUpdateTradingAmounts)

    expect(useConfigStore.getState().minTradingAmount).toEqual(50000)
    expect(useConfigStore.getState().maxTradingAmount).toEqual(4990000)
  })
  it('updates selected amounts if they fall out of range', () => {
    useOfferPreferences.getState().setSellAmount(5, { min: 5, max: 400 })
    useOfferPreferences.getState().setBuyAmountRange([5, 200], { min: 5, max: 400 })

    renderHook(useUpdateTradingAmounts)

    expect(useOfferPreferences.getState().sellAmount).toEqual(50000)
    expect(useOfferPreferences.getState().buyAmountRange).toEqual([50000, 4990000])
  })

  it('does not update selected amounts if they do not fall out of range', () => {
    const buyRange: [number, number] = [60000, 100000]
    const sellAmount = 60000

    useOfferPreferences.getState().setSellAmount(sellAmount, { min: 50000, max: 4990000 })
    useOfferPreferences.getState().setBuyAmountRange(buyRange, { min: 50000, max: 4990000 })

    renderHook(useUpdateTradingAmounts)

    expect(useOfferPreferences.getState().sellAmount).toEqual(sellAmount)
    expect(useOfferPreferences.getState().buyAmountRange).toEqual(buyRange)
  })
})
