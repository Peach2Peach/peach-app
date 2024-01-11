/* eslint-disable max-lines-per-function */
import { act, renderHook } from 'test-utils'
import { estimatedFees } from '../../../../tests/unit/data/bitcoinNetworkData'
import { unauthorizedError } from '../../../../tests/unit/data/peachAPIData'
import { useMessageState } from '../../../components/message/useMessageState'
import { useSettingsStore } from '../../../store/settingsStore/useSettingsStore'
import { useNetworkFeesSetup } from './useNetworkFeesSetup'

jest.mock('../../../hooks/query/useFeeEstimate', () => ({
  useFeeEstimate: () => ({
    estimatedFees,
  }),
}))

const updateUserMock = jest.fn().mockResolvedValue([{ success: true }])
jest.mock('../../../utils/peachAPI', () => ({
  updateUser: (...args: unknown[]) => updateUserMock(...args),
}))

describe('useNetworkFeesSetup', () => {
  beforeEach(() => {
    useSettingsStore.getState().setFeeRate('halfHourFee')
  })
  it('returns default correct values', () => {
    const { result } = renderHook(useNetworkFeesSetup)
    expect(result.current).toEqual({
      estimatedFees,
      selectedFeeRate: 'halfHourFee',
      setSelectedFeeRate: expect.any(Function),
      customFeeRate: '',
      setCustomFeeRate: expect.any(Function),
      submit: expect.any(Function),
      isValid: true,
      feeRateSet: true,
    })
  })
  it('sets custom fee rate if custom had been selected before', () => {
    useSettingsStore.getState().setFeeRate(3)
    const { result } = renderHook(useNetworkFeesSetup)
    expect(result.current.selectedFeeRate).toBe('custom')
    expect(result.current.customFeeRate).toBe('3')
    expect(result.current.isValid).toBeTruthy()
    expect(result.current.feeRateSet).toBeTruthy()
  })
  it('handles invalid fee selection', () => {
    const { result } = renderHook(useNetworkFeesSetup)

    act(() => {
      result.current.setSelectedFeeRate('custom')
      result.current.setCustomFeeRate('0')
    })
    expect(result.current.customFeeRate).toBe('')
    expect(result.current.isValid).toBeFalsy()
    act(() => {
      result.current.setCustomFeeRate('abc')
    })
    expect(result.current.customFeeRate).toBe('')
    expect(result.current.isValid).toBeFalsy()
  })
  it('returns info whether a new fee rate has been set', () => {
    const { result } = renderHook(useNetworkFeesSetup)

    expect(result.current.feeRateSet).toBeTruthy()
    act(() => {
      result.current.setSelectedFeeRate('fastestFee')
    })
    expect(result.current.feeRateSet).toBeFalsy()
  })
  it('sets fee preferences', () => {
    const { result } = renderHook(useNetworkFeesSetup)
    act(() => {
      result.current.setSelectedFeeRate('fastestFee')
    })
    expect(result.current.selectedFeeRate).toBe('fastestFee')
  })
  it('submits fee preferences', async () => {
    const { result } = renderHook(useNetworkFeesSetup)
    await act(async () => {
      await result.current.submit()
    })
    expect(updateUserMock).toHaveBeenCalledWith({
      feeRate: 'halfHourFee',
    })
    expect(useSettingsStore.getState().feeRate).toEqual('halfHourFee')

    act(() => {
      result.current.setSelectedFeeRate('fastestFee')
    })
    await act(async () => {
      await result.current.submit()
    })
    expect(updateUserMock).toHaveBeenCalledWith({
      feeRate: 'fastestFee',
    })
    expect(useSettingsStore.getState().feeRate).toEqual('fastestFee')
  })
  it('submits custom fee preferences', async () => {
    const { result } = renderHook(useNetworkFeesSetup)

    act(() => {
      result.current.setSelectedFeeRate('custom')
      result.current.setCustomFeeRate('4')
    })
    await act(async () => {
      await result.current.submit()
    })
    expect(updateUserMock).toHaveBeenCalledWith({
      feeRate: 4,
    })
    expect(useSettingsStore.getState().feeRate).toEqual(4)
  })
  it('handles request errors', async () => {
    updateUserMock.mockResolvedValueOnce([null, unauthorizedError])
    const { result } = renderHook(useNetworkFeesSetup)

    await result.current.submit()
    expect(useMessageState.getState()).toEqual(
      expect.objectContaining({ msgKey: unauthorizedError.error, level: 'ERROR' }),
    )
  })
})
