/* eslint-disable max-lines-per-function */
import { act, renderHook } from '@testing-library/react-native'
import { estimatedFees } from '../../../../tests/unit/data/bitcoinNetworkData'
import { settingsStore } from '../../../store/settingsStore'
import { useNetworkFeesSetup } from './useNetworkFeesSetup'

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}))
const mockNavigate = jest.fn()
jest.mock('../../../hooks/useNavigation', () => ({
  useNavigation: jest.fn().mockReturnValue({
    navigate: (...args: any) => mockNavigate(...args),
  }),
}))

const updateMessageMock = jest.fn()
jest.mock('../../../contexts/message', () => ({
  useMessageContex: () => [, updateMessageMock],
}))

const useHeaderSetupMock = jest.fn()
jest.mock('../../../hooks/useHeaderSetup', () => ({
  useHeaderSetup: (...args: any[]) => useHeaderSetupMock(...args),
}))
jest.mock('../../../hooks/query/useFeeEstimate', () => ({
  useFeeEstimate: () => ({
    estimatedFees,
  }),
}))

const apiSuccess = { success: true }
const apiError = { error: 'UNAUTHORIZED' }
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
    const { result } = renderHook(useNetworkFeesSetup)
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
    expect(result.current.customFeeRate).toBeUndefined()
    expect(result.current.isValid).toBeFalsy()
    act(() => {
      result.current.setCustomFeeRate('abc')
    })
    expect(result.current.customFeeRate).toBeUndefined()
    expect(result.current.isValid).toBeFalsy()
  })
  it('returns info whether a new fee rate has been set', async () => {
    const { result } = renderHook(useNetworkFeesSetup)

    expect(result.current.feeRateSet).toBeTruthy()
    act(() => {
      result.current.setSelectedFeeRate('fastestFee')
    })
    expect(result.current.feeRateSet).toBeFalsy()
  })
  it('sets header as expected', () => {
    renderHook(useNetworkFeesSetup)
    expect(useHeaderSetupMock).toMatchSnapshot()
  })
  it('sets fee preferences', async () => {
    const { result } = renderHook(useNetworkFeesSetup)
    act(() => {
      result.current.setSelectedFeeRate('fastestFee')
    })
    expect(result.current.selectedFeeRate).toBe('fastestFee')
  })
  it('submits fee preferences', async () => {
    const { result } = renderHook(useNetworkFeesSetup)
    await result.current.submit()
    expect(updateUserMock).toHaveBeenCalledWith({
      feeRate: 'halfHourFee',
    })
    expect(settingsStore.getState().feeRate).toEqual('halfHourFee')

    act(() => {
      result.current.setSelectedFeeRate('fastestFee')
    })
    await result.current.submit()
    expect(updateUserMock).toHaveBeenCalledWith({
      feeRate: 'fastestFee',
    })
    expect(settingsStore.getState().feeRate).toEqual('fastestFee')
  })
  it('submits custom fee preferences', async () => {
    const { result } = renderHook(useNetworkFeesSetup)

    act(() => {
      result.current.setSelectedFeeRate('custom')
      result.current.setCustomFeeRate('4')
    })
    await result.current.submit()
    expect(updateUserMock).toHaveBeenCalledWith({
      feeRate: 4,
    })
    expect(settingsStore.getState().feeRate).toEqual(4)
  })
  it('handles request errors', async () => {
    updateUserMock.mockResolvedValueOnce([null, apiError])
    const { result } = renderHook(useNetworkFeesSetup)

    await result.current.submit()
    expect(updateMessageMock).toHaveBeenCalledWith({
      msgKey: apiError.error,
      level: 'ERROR',
    })
  })
})
