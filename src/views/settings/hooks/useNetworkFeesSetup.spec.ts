/* eslint-disable max-lines-per-function */
import { act, renderHook, responseUtils, waitFor } from 'test-utils'
import { defaultUser } from '../../../../peach-api/src/testData/user'
import { unauthorizedError } from '../../../../tests/unit/data/peachAPIData'
import { queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { useMessageState } from '../../../components/message/useMessageState'
import { peachAPI } from '../../../utils/peachAPI'
import { useNetworkFeesSetup } from './useNetworkFeesSetup'

jest.useFakeTimers()

const updateUserMock = jest.fn().mockResolvedValue([{ success: true }])
jest.mock('../../../utils/peachAPI/updateUser', () => ({
  updateUser: (...args: unknown[]) => updateUserMock(...args),
}))

const getSelfUserMock = jest
  .spyOn(peachAPI.private.user, 'getSelfUser')
  .mockResolvedValue({ result: { ...defaultUser, feeRate: 'halfHourFee' }, ...responseUtils })

describe('useNetworkFeesSetup', () => {
  afterEach(() => {
    queryClient.clear()
  })
  it('returns default correct values', async () => {
    const { result } = renderHook(useNetworkFeesSetup)

    await waitFor(() => {
      expect(result.current).toEqual({
        selectedFeeRate: 'halfHourFee',
        setSelectedFeeRate: expect.any(Function),
        customFeeRate: '',
        setCustomFeeRate: expect.any(Function),
        submit: expect.any(Function),
        isValid: true,
        feeRateSet: true,
      })
    })
  })
  it('sets custom fee rate if custom had been selected before', async () => {
    getSelfUserMock.mockResolvedValueOnce({ result: { ...defaultUser, feeRate: 3 }, ...responseUtils })
    const { result } = renderHook(useNetworkFeesSetup)

    await waitFor(() => {
      expect(result.current.selectedFeeRate).toBe('custom')
      expect(result.current.customFeeRate).toBe('3')
      expect(result.current.isValid).toBeTruthy()
      expect(result.current.feeRateSet).toBeTruthy()
    })
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
  it('returns info whether a new fee rate has been set', async () => {
    const { result } = renderHook(useNetworkFeesSetup)
    await waitFor(() => {
      expect(result.current.feeRateSet).toBeTruthy()
    })
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

    act(() => {
      result.current.setSelectedFeeRate('fastestFee')
    })
    await act(async () => {
      await result.current.submit()
    })
    expect(updateUserMock).toHaveBeenCalledWith({
      feeRate: 'fastestFee',
    })
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
  })
  it('handles request errors', async () => {
    updateUserMock.mockResolvedValueOnce([null, unauthorizedError])
    const { result } = renderHook(useNetworkFeesSetup)

    result.current.submit()
    await waitFor(() => {
      expect(useMessageState.getState()).toEqual(
        expect.objectContaining({ msgKey: unauthorizedError.error, level: 'ERROR' }),
      )
    })
  })
})
