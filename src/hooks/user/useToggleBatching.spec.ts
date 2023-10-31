import { renderHook, waitFor } from 'test-utils'
import { defaultSelfUser } from '../../../tests/unit/data/userData'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { useToggleBatching } from './useToggleBatching'

const showErrorBannerMock = jest.fn()
jest.mock('../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => showErrorBannerMock,
}))

const setBatchingMock = jest.fn().mockResolvedValue([{ success: true }, null])
jest.mock('../../utils/peachAPI', () => ({
  setBatching: (...args: unknown[]) => setBatchingMock(...args),
}))

jest.useFakeTimers()

describe('useToggleBatching', () => {
  beforeEach(() => {
    queryClient.setQueryData(['user', 'self'], defaultSelfUser)
  })
  it('should call setBatching with inverted boolean', async () => {
    const { result } = renderHook(() => useToggleBatching(defaultSelfUser))
    await result.current.mutate()

    await waitFor(() => {
      expect(queryClient.getQueryData<SelfUser>(['user', 'self'])).toEqual({
        ...defaultSelfUser,
        isBatchingEnabled: !defaultSelfUser.isBatchingEnabled,
      })
    })
    await waitFor(() => {
      expect(setBatchingMock).toHaveBeenCalledWith({
        enableBatching: !defaultSelfUser.isBatchingEnabled,
      })
    })
  })

  it('should call showErrorBanner on error', async () => {
    const error = [null, { error: 'errorMessage' }]
    setBatchingMock.mockReturnValueOnce(Promise.resolve(error))
    const { result } = renderHook(() => useToggleBatching(defaultSelfUser))
    result.current.mutate()

    await waitFor(() => {
      expect(showErrorBannerMock).toHaveBeenCalledWith('errorMessage')
    })
  })
})
