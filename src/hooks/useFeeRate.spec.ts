import { act, renderHook } from 'test-utils'
import { estimatedFees } from '../../tests/unit/data/bitcoinNetworkData'
import { useSettingsStore } from '../store/settingsStore'
import { useFeeRate } from './useFeeRate'

const useFeeEstimateMock = jest.fn().mockReturnValue({ estimatedFees })
jest.mock('./query/useFeeEstimate', () => ({
  useFeeEstimate: () => useFeeEstimateMock(),
}))

describe('useFeeRate', () => {
  afterEach(() => {
    act(() => useSettingsStore.getState().reset())
  })
  it('should return custom fee rate if set', () => {
    const customFeeRate = 123
    act(() => useSettingsStore.getState().setFeeRate(customFeeRate))
    const { result } = renderHook(useFeeRate)

    expect(result.current).toEqual(customFeeRate)
  })
  it('should return estimated fees', () => {
    act(() => useSettingsStore.getState().setFeeRate('fastestFee'))
    const { result, rerender } = renderHook(useFeeRate)
    expect(result.current).toEqual(estimatedFees.fastestFee)

    act(() => useSettingsStore.getState().setFeeRate('halfHourFee'))
    rerender({})
    expect(result.current).toEqual(estimatedFees.halfHourFee)

    act(() => useSettingsStore.getState().setFeeRate('hourFee'))
    rerender({})
    expect(result.current).toEqual(estimatedFees.hourFee)
  })
  it('should return half hour fee as fallback', () => {
    // @ts-ignore
    act(() => useSettingsStore.getState().setFeeRate('unknown'))
    const { result, rerender } = renderHook(useFeeRate)
    expect(result.current).toEqual(estimatedFees.halfHourFee)

    act(() => useSettingsStore.getState().setFeeRate(0))
    rerender({})
    expect(result.current).toEqual(estimatedFees.halfHourFee)

    // @ts-ignore
    act(() => useSettingsStore.getState().setFeeRate(undefined))
    rerender({})
    expect(result.current).toEqual(estimatedFees.halfHourFee)
  })
})
