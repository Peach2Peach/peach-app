import { act } from 'react-test-renderer'
import { renderHook } from 'test-utils'
import { useUpdateTradingAmounts } from '.'
import { useConfigStore } from '../store/configStore'
import { useOfferPreferences } from '../store/offerPreferenes/useOfferPreferences'

const getTradingAmountLimitsMock = jest.fn().mockReturnValue([10, 100])
jest.mock('../utils/market', () => ({
  getTradingAmountLimits: (priceCHF: number) => getTradingAmountLimitsMock(priceCHF),
}))

// eslint-disable-next-line max-lines-per-function
describe('useUpdateTradingAmounts', () => {
  it('updates the min and max trading amounts correctly', () => {
    const { result: updateTradingAmounts } = renderHook(() => useUpdateTradingAmounts())

    act(() => {
      useConfigStore.getState().setMinTradingAmount(5)
      useConfigStore.getState().setMaxTradingAmount(400)
    })

    act(() => {
      updateTradingAmounts.current(50)
    })

    expect(getTradingAmountLimitsMock).toHaveBeenCalledWith(50)
    expect(useConfigStore.getState().minTradingAmount).toEqual(10)
    expect(useConfigStore.getState().maxTradingAmount).toEqual(100)
  })
  it('updates selected amounts if they fall out of range', () => {
    const { result: updateTradingAmounts } = renderHook(() => useUpdateTradingAmounts())

    act(() => {
      useOfferPreferences.getState().setSellAmount(5, { min: 5, max: 400 })
      useOfferPreferences.getState().setBuyAmountRange([5, 200], { min: 5, max: 400 })
    })

    act(() => {
      updateTradingAmounts.current(50)
    })

    expect(getTradingAmountLimitsMock).toHaveBeenCalledWith(50)
    expect(useOfferPreferences.getState().sellAmount).toEqual(10)
    expect(useOfferPreferences.getState().buyAmountRange).toEqual([10, 100])

    act(() => {
      useOfferPreferences.getState().setSellAmount(400, { min: 5, max: 400 })
    })
    act(() => {
      updateTradingAmounts.current(50)
    })

    expect(getTradingAmountLimitsMock).toHaveBeenCalledWith(50)
    expect(useOfferPreferences.getState().sellAmount).toEqual(100)
  })

  it('does not update selected amounts if they do not fall out of range', () => {
    const { result: updateTradingAmounts } = renderHook(() => useUpdateTradingAmounts())

    act(() => {
      useOfferPreferences.getState().setSellAmount(20, { min: 5, max: 400 })
      useOfferPreferences.getState().setBuyAmountRange([20, 40], { min: 5, max: 400 })
    })

    act(() => {
      updateTradingAmounts.current(50)
    })

    expect(getTradingAmountLimitsMock).toHaveBeenCalledWith(50)
    expect(useOfferPreferences.getState().sellAmount).toEqual(20)
    expect(useOfferPreferences.getState().buyAmountRange).toEqual([20, 40])
  })
  it('only updates the buy amount that fell out of range', () => {
    getTradingAmountLimitsMock.mockReturnValue([10, 300])
    const { result: updateTradingAmounts } = renderHook(() => useUpdateTradingAmounts())

    act(() => {
      useOfferPreferences.getState().setBuyAmountRange([5, 200], { min: 5, max: 400 })
    })
    act(() => {
      updateTradingAmounts.current(50)
    })

    expect(getTradingAmountLimitsMock).toHaveBeenCalledWith(50)
    expect(useOfferPreferences.getState().buyAmountRange[0]).toEqual(10)
    expect(useOfferPreferences.getState().buyAmountRange[1]).toEqual(200)
  })
})
