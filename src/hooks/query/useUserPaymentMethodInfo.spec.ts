import { renderHook, responseUtils, waitFor } from 'test-utils'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { peachAPI } from '../../utils/peachAPI'
import { placeholder, useUserPaymentMethodInfo } from './useUserPaymentMethodInfo'

jest.useFakeTimers()

const paymentMethodInfo = { forbidden: { buy: [], sell: [] } }
const getUserPaymentMethodInfo = jest.spyOn(peachAPI.private.user, 'getUserPaymentMethodInfo')

describe('useUserPaymentMethodInfo', () => {
  afterEach(() => {
    queryClient.clear()
  })

  it('fetches user from API', async () => {
    const { result } = renderHook(useUserPaymentMethodInfo)
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
    getUserPaymentMethodInfo.mockResolvedValueOnce({ error: { error: 'UNAUTHORIZED' }, ...responseUtils })
    const { result } = renderHook(useUserPaymentMethodInfo)
    expect(result.current).toEqual({
      data: placeholder,
      isLoading: true,
      error: null,
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current).toEqual({
      data: placeholder,
      isLoading: false,
      error: new Error('UNAUTHORIZED'),
    })
  })
})
