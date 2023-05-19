/* eslint-disable max-lines-per-function */
import { act, renderHook } from '@testing-library/react-native'
import { estimatedFees } from '../../../../tests/unit/data/bitcoinNetworkData'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useHeaderState } from '../../../components/header/store'
import { settingsStore } from '../../../store/settingsStore'
import { useNetworkFeesSetup } from './useNetworkFeesSetup'
import { apiSuccess, unauthorizedError } from '../../../../tests/unit/data/peachAPIData'

const updateMessageMock = jest.fn()
jest.mock('../../../contexts/message', () => ({
  useMessageContext: () => [, updateMessageMock],
}))

jest.mock('../../../hooks/query/useFeeEstimate', () => ({
  useFeeEstimate: () => ({
    estimatedFees,
  }),
}))

const updateUserMock = jest.fn().mockResolvedValue([apiSuccess])
jest.mock('../../../utils/peachAPI', () => ({
  updateUser: (...args: any[]) => updateUserMock(...args),
}))

describe('useNetworkFeesSetup', () => {
  beforeEach(() => {
    settingsStore.getState().setFeeRate('halfHourFee')
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('returns default correct values', () => {
    const { result } = renderHook(useNetworkFeesSetup, { wrapper: NavigationWrapper })
    expect(result.current).toEqual({
      estimatedFees,
      selectedFeeRate: 'halfHourFee',
      setSelectedFeeRate: expect.any(Function),
      customFeeRate: undefined,
      setCustomFeeRate: expect.any(Function),
      submit: expect.any(Function),
      isValid: true,
      feeRateSet: true,
    })
  })
  it('sets custom fee rate if custom had been selected before', () => {
    settingsStore.getState().setFeeRate(3)
    const { result } = renderHook(useNetworkFeesSetup, { wrapper: NavigationWrapper })
    expect(result.current.selectedFeeRate).toBe('custom')
    expect(result.current.customFeeRate).toBe('3')
    expect(result.current.isValid).toBeTruthy()
    expect(result.current.feeRateSet).toBeTruthy()
  })
  it('handles invalid fee selection', () => {
    const { result } = renderHook(useNetworkFeesSetup, { wrapper: NavigationWrapper })

    act(() => {
      result.current.setSelectedFeeRate('custom')
      result.current.setCustomFeeRate('0')
    })
    expect(result.current.customFeeRate).toBeUndefined()
    expect(result.current.isValid).toBeFalsy()
    act(() => {
      result.current.setCustomFeeRate('abc')
    })
    expect(result.current.customFeeRate).toBeUndefined()
    expect(result.current.isValid).toBeFalsy()
  })
  it('returns info whether a new fee rate has been set', async () => {
    const { result } = renderHook(useNetworkFeesSetup, { wrapper: NavigationWrapper })

    expect(result.current.feeRateSet).toBeTruthy()
    act(() => {
      result.current.setSelectedFeeRate('fastestFee')
    })
    expect(result.current.feeRateSet).toBeFalsy()
  })
  it('sets header as expected', () => {
    renderHook(useNetworkFeesSetup, { wrapper: NavigationWrapper })
    expect(useHeaderState.getState().title).toBe('network fees')
    expect(useHeaderState.getState().icons?.[0].id).toBe('helpCircle')
    expect(useHeaderState.getState().icons?.[0].onPress).toEqual(expect.any(Function))
  })
  it('sets fee preferences', async () => {
    const { result } = renderHook(useNetworkFeesSetup, { wrapper: NavigationWrapper })
    act(() => {
      result.current.setSelectedFeeRate('fastestFee')
    })
    expect(result.current.selectedFeeRate).toBe('fastestFee')
  })
  it('submits fee preferences', async () => {
    const { result } = renderHook(useNetworkFeesSetup, { wrapper: NavigationWrapper })
    await act(async () => {
      await result.current.submit()
    })
    expect(updateUserMock).toHaveBeenCalledWith({
      feeRate: 'halfHourFee',
    })
    expect(settingsStore.getState().feeRate).toEqual('halfHourFee')

    act(() => {
      result.current.setSelectedFeeRate('fastestFee')
    })
    await act(async () => {
      await result.current.submit()
    })
    expect(updateUserMock).toHaveBeenCalledWith({
      feeRate: 'fastestFee',
    })
    expect(settingsStore.getState().feeRate).toEqual('fastestFee')
  })
  it('submits custom fee preferences', async () => {
    const { result } = renderHook(useNetworkFeesSetup, { wrapper: NavigationWrapper })

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
    expect(settingsStore.getState().feeRate).toEqual(4)
  })
  it('handles request errors', async () => {
    updateUserMock.mockResolvedValueOnce([null, unauthorizedError])
    const { result } = renderHook(useNetworkFeesSetup, { wrapper: NavigationWrapper })

    await result.current.submit()
    expect(updateMessageMock).toHaveBeenCalledWith({
      msgKey: unauthorizedError.error,
      level: 'ERROR',
    })
  })
})
