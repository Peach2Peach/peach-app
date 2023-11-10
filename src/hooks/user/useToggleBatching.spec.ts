import { renderHook, waitFor } from 'test-utils'
import { defaultUser } from '../../../tests/unit/data/userData'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { useToggleBatching } from './useToggleBatching'

const showErrorBannerMock = jest.fn()
jest.mock('../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => showErrorBannerMock,
}))

const setBatchingMock = jest.fn().mockResolvedValue([{ success: true }, null])
jest.mock('../../utils/peachAPI/private/user/setBatching', () => ({
  setBatching: (...args: unknown[]) => setBatchingMock(...args),
}))

jest.useFakeTimers()

describe('useToggleBatching', () => {
  beforeEach(() => {
    queryClient.setQueryData(['user', 'self'], defaultUser)
  })
  it('should call setBatching with inverted boolean', async () => {
    const { result } = renderHook(() => useToggleBatching(defaultUser))
    await result.current.mutate()

    await waitFor(() => {
      expect(queryClient.getQueryData<User>(['user', 'self'])).toEqual({
        ...defaultUser,
        isBatchingEnabled: !defaultUser.isBatchingEnabled,
      })
    })
    await waitFor(() => {
      expect(setBatchingMock).toHaveBeenCalledWith({
        enableBatching: !defaultUser.isBatchingEnabled,
      })
    })
  })

  it('should call showErrorBanner on error', async () => {
    const error = [null, { error: 'errorMessage' }]
    setBatchingMock.mockReturnValueOnce(Promise.resolve(error))
    const { result } = renderHook(() => useToggleBatching(defaultUser))
    result.current.mutate()

    await waitFor(() => {
      expect(showErrorBannerMock).toHaveBeenCalledWith('errorMessage')
    })
  })
})
