import { renderHook, waitFor } from '@testing-library/react-native'
import { unauthorizedError } from '../../../tests/unit/data/peachAPIData'
import { QueryClientWrapper, queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { placeholder, useUserPaymentMethodInfo } from './useUserPaymentMethodInfo'

jest.useFakeTimers()

const paymentMethodInfo = { forbidden: { buy: [], sell: [] } }
const getUserPaymentMethodInfo = jest.fn().mockResolvedValue([paymentMethodInfo])
jest.mock('../../utils/peachAPI', () => ({
  getUserPaymentMethodInfo: () => getUserPaymentMethodInfo(),
}))

const wrapper = QueryClientWrapper

describe('useUserPaymentMethodInfo', () => {
  afterEach(() => {
    queryClient.clear()
  })

  it('fetches user from API', async () => {
    const { result } = renderHook(useUserPaymentMethodInfo, { wrapper })
    expect(result.current).toEqual({
      data: placeholder,
      isLoading: true,
      error: null,
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current).toEqual({
      data: paymentMethodInfo,
      isLoading: false,
      error: null,
    })
  })
  it('returns error and placeholder if server did not return result', async () => {
    getUserPaymentMethodInfo.mockResolvedValueOnce([null, unauthorizedError])
    const { result } = renderHook(useUserPaymentMethodInfo, { wrapper })
    expect(result.current).toEqual({
      data: placeholder,
      isLoading: true,
      error: null,
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current).toEqual({
      data: placeholder,
      isLoading: false,
      error: new Error(unauthorizedError.error),
    })
  })
})
