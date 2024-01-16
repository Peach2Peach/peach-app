import { act, renderHook, responseUtils, waitFor } from 'test-utils'
import { defaultUser } from '../../peach-api/src/testData/userData'
import { estimatedFees } from '../../tests/unit/data/bitcoinNetworkData'
import { queryClient } from '../../tests/unit/helpers/QueryClientWrapper'
import { peachAPI } from '../utils/peachAPI'
import { useFeeRate } from './useFeeRate'

const useFeeEstimateMock = jest.fn().mockReturnValue({ estimatedFees })
jest.mock('./query/useFeeEstimate', () => ({
  useFeeEstimate: () => useFeeEstimateMock(),
}))
const getUserMock = jest.spyOn(peachAPI.private.user, 'getSelfUser')
jest.useFakeTimers()

describe('useFeeRate', () => {
  it('should return custom fee rate if set', async () => {
    const customFeeRate = 123
    getUserMock.mockResolvedValueOnce({ result: { ...defaultUser, feeRate: customFeeRate }, ...responseUtils })
    const { result } = renderHook(useFeeRate)

    await waitFor(() => {
      expect(result.current).toEqual(customFeeRate)
    })
  })
  it('should return estimated fees', async () => {
    getUserMock.mockResolvedValueOnce({ result: { ...defaultUser, feeRate: 'fastestFee' }, ...responseUtils })
    const { result } = renderHook(useFeeRate)
    await waitFor(() => {
      expect(result.current).toEqual(estimatedFees.fastestFee)
    })

    getUserMock.mockResolvedValueOnce({ result: { ...defaultUser, feeRate: 'halfHourFee' }, ...responseUtils })
    act(() => {
      queryClient.invalidateQueries(['user', 'self'])
    })
    await waitFor(() => {
      expect(result.current).toEqual(estimatedFees.halfHourFee)
    })

    getUserMock.mockResolvedValueOnce({ result: { ...defaultUser, feeRate: 'hourFee' }, ...responseUtils })
    act(() => {
      queryClient.invalidateQueries(['user', 'self'])
    })
    await waitFor(() => {
      expect(result.current).toEqual(estimatedFees.hourFee)
    })
  })
  it('should return half hour fee as fallback', async () => {
    // @ts-expect-error testing unknown fee rate
    getUserMock.mockResolvedValueOnce({ result: { ...defaultUser, feeRate: 'unknown' }, ...responseUtils })
    const { result } = renderHook(useFeeRate)
    await waitFor(() => {
      expect(result.current).toEqual(estimatedFees.halfHourFee)
    })

    getUserMock.mockResolvedValueOnce({ result: { ...defaultUser, feeRate: 0 }, ...responseUtils })
    act(() => {
      queryClient.invalidateQueries(['user', 'self'])
    })
    await waitFor(() => {
      expect(result.current).toEqual(estimatedFees.halfHourFee)
    })

    // @ts-expect-error testing undefined fee rate
    getUserMock.mockResolvedValueOnce({ result: { ...defaultUser, feeRate: undefined }, ...responseUtils })
    act(() => {
      queryClient.invalidateQueries(['user', 'self'])
    })
    await waitFor(() => {
      expect(result.current).toEqual(estimatedFees.halfHourFee)
    })
  })
})
