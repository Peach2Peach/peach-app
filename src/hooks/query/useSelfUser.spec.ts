import { renderHook, waitFor } from 'test-utils'
import { buyer } from '../../../tests/unit/data/accountData'
import { unauthorizedError } from '../../../tests/unit/data/peachAPIData'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { useSelfUser } from './useSelfUser'

jest.useFakeTimers()

const getSelfUserMock = jest.fn().mockResolvedValue([buyer])
jest.mock('../../utils/peachAPI', () => ({
  getSelfUser: () => getSelfUserMock(),
}))

describe('useSelfUser', () => {
  afterEach(() => {
    queryClient.clear()
  })

  it('fetches user from API', async () => {
    const { result } = renderHook(useSelfUser)
    expect(result.current).toEqual({
      user: undefined,
      isLoading: true,
      error: null,
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current).toEqual({
      user: buyer,
      isLoading: false,
      error: null,
    })
  })
  it('returns error if server did not return result', async () => {
    getSelfUserMock.mockResolvedValueOnce([null, unauthorizedError])
    const { result } = renderHook(useSelfUser)
    expect(result.current).toEqual({
      user: undefined,
      isLoading: true,
      error: null,
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current).toEqual({
      user: undefined,
      isLoading: false,
      error: new Error(unauthorizedError.error),
    })
  })
})
