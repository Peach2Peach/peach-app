import { renderHook } from '@testing-library/react-hooks'
import { act } from 'react-test-renderer'
import { useUpdateTradingAmounts } from '../../../src/hooks'
import { useConfigStore } from '../../../src/store/configStore'
import { useSettingsStore } from '../../../src/store/settingsStore'
import { getTradingAmountLimits } from '../../../src/utils/market'

jest.mock('../../../src/utils/market', () => ({
  getTradingAmountLimits: jest.fn().mockReturnValue([10, 100]),
}))

describe('useUpdateTradingAmounts', () => {
  it('updates the min and max trading amounts correctly', async () => {
    const { result: updateTradingAmounts } = renderHook(() => useUpdateTradingAmounts())
    const { result: configStoreResult } = renderHook(() => useConfigStore())

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
    const { result: settingsStoreResult } = renderHook(() => useSettingsStore())

    act(() => {
      settingsStoreResult.current.setSellAmount(5)
      settingsStoreResult.current.setMinBuyAmount(5)
      settingsStoreResult.current.setMaxBuyAmount(200)
    })

    act(() => {
      updateTradingAmounts.current(50)
    })

    expect(getTradingAmountLimits).toHaveBeenCalledWith(50)
    expect(settingsStoreResult.current.sellAmount).toEqual(10)
    expect(settingsStoreResult.current.minBuyAmount).toEqual(10)
    expect(settingsStoreResult.current.maxBuyAmount).toEqual(100)
  })

  it('does not update selected amounts if they do not fall out of range', async () => {
    const { result: updateTradingAmounts } = renderHook(() => useUpdateTradingAmounts())
    const { result: settingsStoreResult } = renderHook(() => useSettingsStore())

    act(() => {
      settingsStoreResult.current.setSellAmount(20)
      settingsStoreResult.current.setMinBuyAmount(20)
      settingsStoreResult.current.setMaxBuyAmount(40)
    })

    act(() => {
      updateTradingAmounts.current(50)
    })

    expect(getTradingAmountLimits).toHaveBeenCalledWith(50)
    expect(settingsStoreResult.current.sellAmount).toEqual(20)
    expect(settingsStoreResult.current.minBuyAmount).toEqual(20)
    expect(settingsStoreResult.current.maxBuyAmount).toEqual(40)
  })
})
