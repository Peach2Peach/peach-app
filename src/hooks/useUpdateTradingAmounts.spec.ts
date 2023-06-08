import { renderHook } from '@testing-library/react-native'
import { act } from 'react-test-renderer'
import { useUpdateTradingAmounts } from '.'
import { useConfigStore } from '../store/configStore'
import { useOfferPreferences } from '../store/useOfferPreferences'
import { getTradingAmountLimits } from '../utils/market'

jest.mock('../utils/market', () => ({
  getTradingAmountLimits: jest.fn().mockReturnValue([10, 100]),
}))

describe('useUpdateTradingAmounts', () => {
  it('updates the min and max trading amounts correctly', async () => {
    const { result: updateTradingAmounts } = renderHook(() => useUpdateTradingAmounts())
    const { result: configStoreResult } = renderHook(() => useConfigStore((state) => state))

    act(() => {
      configStoreResult.current.setMinTradingAmount(5)
      configStoreResult.current.setMaxTradingAmount(400)
    })

    act(() => {
      updateTradingAmounts.current(50)
    })

    expect(getTradingAmountLimits).toHaveBeenCalledWith(50)
    expect(configStoreResult.current.minTradingAmount).toEqual(10)
    expect(configStoreResult.current.maxTradingAmount).toEqual(100)
  })
  it('updates selected amounts if they fall out of range', async () => {
    const { result: updateTradingAmounts } = renderHook(() => useUpdateTradingAmounts())

    act(() => {
      useOfferPreferences.getState().setSellAmount(5)
      useOfferPreferences.getState().setMinBuyAmount(5)
      useOfferPreferences.getState().setMaxBuyAmount(200)
    })

    act(() => {
      updateTradingAmounts.current(50)
    })

    expect(getTradingAmountLimits).toHaveBeenCalledWith(50)
    expect(useOfferPreferences.getState().sellPreferences.amount).toEqual(10)
    expect(useOfferPreferences.getState().buyPreferences.amount).toEqual([10, 100])
  })

  it('does not update selected amounts if they do not fall out of range', async () => {
    const { result: updateTradingAmounts } = renderHook(() => useUpdateTradingAmounts())

    act(() => {
      useOfferPreferences.getState().setSellAmount(20)
      useOfferPreferences.getState().setMinBuyAmount(20)
      useOfferPreferences.getState().setMaxBuyAmount(40)
    })

    act(() => {
      updateTradingAmounts.current(50)
    })

    expect(getTradingAmountLimits).toHaveBeenCalledWith(50)
    expect(useOfferPreferences.getState().sellPreferences.amount).toEqual(20)
    expect(useOfferPreferences.getState().buyPreferences.amount).toEqual([20, 40])
  })
})
