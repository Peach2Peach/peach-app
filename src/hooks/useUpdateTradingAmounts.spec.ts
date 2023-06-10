import { renderHook } from '@testing-library/react-native'
import { act } from 'react-test-renderer'
import { useUpdateTradingAmounts } from '.'
import { configStore } from '../store/configStore'
import { useOfferPreferences } from '../store/offerPreferenes/useOfferPreferences'
import { getTradingAmountLimits } from '../utils/market'

jest.mock('../utils/market', () => ({
  getTradingAmountLimits: jest.fn().mockReturnValue([10, 100]),
}))

describe('useUpdateTradingAmounts', () => {
  it('updates the min and max trading amounts correctly', async () => {
    const { result: updateTradingAmounts } = renderHook(() => useUpdateTradingAmounts())

    act(() => {
      configStore.getState().setMinTradingAmount(5)
      configStore.getState().setMaxTradingAmount(400)
    })

    act(() => {
      updateTradingAmounts.current(50)
    })

    expect(getTradingAmountLimits).toHaveBeenCalledWith(50)
    expect(configStore.getState().minTradingAmount).toEqual(10)
    expect(configStore.getState().maxTradingAmount).toEqual(100)
  })
  it('updates selected amounts if they fall out of range', async () => {
    const { result: updateTradingAmounts } = renderHook(() => useUpdateTradingAmounts())

    act(() => {
      useOfferPreferences.getState().setSellAmount(5, { min: 5, max: 400 })
      useOfferPreferences.getState().setBuyAmountRange([5, 200], { min: 5, max: 400 })
    })

    act(() => {
      updateTradingAmounts.current(50)
    })

    expect(getTradingAmountLimits).toHaveBeenCalledWith(50)
    expect(useOfferPreferences.getState().sellAmount).toEqual(10)
    expect(useOfferPreferences.getState().buyAmountRange).toEqual([10, 100])
  })

  it('does not update selected amounts if they do not fall out of range', async () => {
    const { result: updateTradingAmounts } = renderHook(() => useUpdateTradingAmounts())

    act(() => {
      useOfferPreferences.getState().setSellAmount(20, { min: 5, max: 400 })
      useOfferPreferences.getState().setBuyAmountRange([20, 40], { min: 5, max: 400 })
    })

    act(() => {
      updateTradingAmounts.current(50)
    })

    expect(getTradingAmountLimits).toHaveBeenCalledWith(50)
    expect(useOfferPreferences.getState().sellAmount).toEqual(20)
    expect(useOfferPreferences.getState().buyAmountRange).toEqual([20, 40])
  })
})
