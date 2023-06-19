import { renderHook } from '@testing-library/react-native'
import { estimatedFees } from '../../tests/unit/data/bitcoinNetworkData'
import { useSettingsStore } from '../store/settingsStore'
import { useFeeRate } from './useFeeRate'

const useFeeEstimateMock = jest.fn().mockReturnValue({ estimatedFees })
jest.mock('./query/useFeeEstimate', () => ({
  useFeeEstimate: () => useFeeEstimateMock(),
}))

describe('useFeeRate', () => {
  afterEach(() => {
    useSettingsStore.getState().reset()
  })
  it('should return custom fee rate if set', () => {
    const customFeeRate = 123
    useSettingsStore.getState().setFeeRate(customFeeRate)
    const { result } = renderHook(useFeeRate)

    expect(result.current).toEqual(customFeeRate)
  })
  it('should return estimated fees', () => {
    useSettingsStore.getState().setFeeRate('fastestFee')
    const { result, rerender } = renderHook(useFeeRate)
    expect(result.current).toEqual(estimatedFees.fastestFee)

    useSettingsStore.getState().setFeeRate('halfHourFee')
    rerender({})
    expect(result.current).toEqual(estimatedFees.halfHourFee)

    useSettingsStore.getState().setFeeRate('hourFee')
    rerender({})
    expect(result.current).toEqual(estimatedFees.hourFee)
  })
  it('should return half hour fee as fallback', () => {
    // @ts-ignore
    useSettingsStore.getState().setFeeRate('unknown')
    const { result, rerender } = renderHook(useFeeRate)
    expect(result.current).toEqual(estimatedFees.halfHourFee)

    useSettingsStore.getState().setFeeRate(0)
    rerender({})
    expect(result.current).toEqual(estimatedFees.halfHourFee)

    // @ts-ignore
    useSettingsStore.getState().setFeeRate(undefined)
    rerender({})
    expect(result.current).toEqual(estimatedFees.halfHourFee)
  })
})
