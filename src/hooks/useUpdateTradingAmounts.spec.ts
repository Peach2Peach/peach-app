import { act } from 'react-test-renderer'
import { renderHook } from 'test-utils'
import { useConfigStore } from '../store/configStore/configStore'
import { useOfferPreferences } from '../store/offerPreferenes/useOfferPreferences'
import { useUpdateTradingAmounts } from './useUpdateTradingAmounts'

describe('useUpdateTradingAmounts', () => {
  const priceCHF = 20000
  it('updates the min and max trading amounts correctly', () => {
    const { result: updateTradingAmounts } = renderHook(useUpdateTradingAmounts)

    act(() => {
      useConfigStore.getState().setMinTradingAmount(5)
      useConfigStore.getState().setMaxTradingAmount(400)
      useConfigStore.getState().setMaxSellTradingAmount(300)
    })
    act(() => updateTradingAmounts.current(priceCHF))

    expect(useConfigStore.getState().minTradingAmount).toEqual(50000)
    expect(useConfigStore.getState().maxTradingAmount).toEqual(4990000)
    expect(useConfigStore.getState().maxSellTradingAmount).toEqual(3990000)
  })
  it('updates selected amounts if they fall out of range', () => {
    const { result: updateTradingAmounts } = renderHook(useUpdateTradingAmounts)

    act(() => {
      useOfferPreferences.getState().setSellAmount(5, { min: 5, max: 400 })
      useOfferPreferences.getState().setBuyAmountRange([5, 200], { min: 5, max: 400 })
    })
    act(() => updateTradingAmounts.current(priceCHF))

    expect(useOfferPreferences.getState().sellAmount).toEqual(50000)
    expect(useOfferPreferences.getState().buyAmountRange).toEqual([50000, 4990000])
  })

  it('does not update selected amounts if they do not fall out of range', () => {
    const buyRange: [number, number] = [60000, 100000]
    const sellAmount = 60000
    const { result: updateTradingAmounts } = renderHook(useUpdateTradingAmounts)

    act(() => {
      useOfferPreferences.getState().setSellAmount(sellAmount, { min: 50000, max: 4990000 })
      useOfferPreferences.getState().setBuyAmountRange(buyRange, { min: 50000, max: 4990000 })
    })
    act(() => updateTradingAmounts.current(priceCHF))

    expect(useOfferPreferences.getState().sellAmount).toEqual(sellAmount)
    expect(useOfferPreferences.getState().buyAmountRange).toEqual(buyRange)
  })
})
