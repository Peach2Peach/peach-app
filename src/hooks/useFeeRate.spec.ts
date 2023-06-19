import { renderHook } from '@testing-library/react-native'
import { estimatedFees } from '../../tests/unit/data/bitcoinNetworkData'
import { settingsStore } from '../store/settingsStore'
import { useFeeRate } from './useFeeRate'

const useFeeEstimateMock = jest.fn().mockReturnValue({ estimatedFees })
jest.mock('./query/useFeeEstimate', () => ({
  useFeeEstimate: () => useFeeEstimateMock(),
}))

describe('useFeeRate', () => {
  afterEach(() => {
    settingsStore.getState().reset()
  })
  it('should return custom fee rate if set', () => {
    const customFeeRate = 123
    settingsStore.getState().setFeeRate(customFeeRate)
    const { result } = renderHook(useFeeRate)

    expect(result.current).toEqual(customFeeRate)
  })
  it('should return estimated fees', () => {
    settingsStore.getState().setFeeRate('fastestFee')
    const { result, rerender } = renderHook(useFeeRate)
    expect(result.current).toEqual(estimatedFees.fastestFee)

    settingsStore.getState().setFeeRate('halfHourFee')
    rerender({})
    expect(result.current).toEqual(estimatedFees.halfHourFee)

    settingsStore.getState().setFeeRate('hourFee')
    rerender({})
    expect(result.current).toEqual(estimatedFees.hourFee)
  })
  it('should return half hour fee as fallback', () => {
    // @ts-ignore
    settingsStore.getState().setFeeRate('unknown')
    const { result, rerender } = renderHook(useFeeRate)
    expect(result.current).toEqual(estimatedFees.halfHourFee)

    settingsStore.getState().setFeeRate(0)
    rerender({})
    expect(result.current).toEqual(estimatedFees.halfHourFee)

    // @ts-ignore
    settingsStore.getState().setFeeRate(undefined)
    rerender({})
    expect(result.current).toEqual(estimatedFees.halfHourFee)
  })
})
