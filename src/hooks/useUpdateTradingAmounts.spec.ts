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
  it('updates buy amount if it falls out of range', () => {
    useOfferPreferences.getState().setSellAmount(5)
    useOfferPreferences.getState().setBuyAmountRange([5, 200])

    renderHook(useUpdateTradingAmounts)

    expect(useOfferPreferences.getState().buyAmountRange).toEqual([50000, 4990000])
  })

  it('does not update selected amounts if they do not fall out of range', () => {
    const buyRange: [number, number] = [60000, 100000]
    const sellAmount = 60000

    useOfferPreferences.getState().setSellAmount(sellAmount)
    useOfferPreferences.getState().setBuyAmountRange(buyRange)

    renderHook(useUpdateTradingAmounts)

    expect(useOfferPreferences.getState().sellAmount).toEqual(sellAmount)
    expect(useOfferPreferences.getState().buyAmountRange).toEqual(buyRange)
  })
})
