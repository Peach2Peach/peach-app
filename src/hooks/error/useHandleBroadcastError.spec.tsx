import { renderHook } from '@testing-library/react-native'
import { useHandleBroadcastError } from './useHandleBroadcastError'

const showErrorBannerMock = jest.fn()
jest.mock('../useShowErrorBanner', () => ({
  useShowErrorBanner:
    () =>
      (...args: any[]) =>
        showErrorBannerMock(...args),
}))

describe('useHandleBroadcastError', () => {
  const error = [
    new Error('INSUFFICIENT_FUNDS'),
    {
      needed: '78999997952',
      available: '1089000',
    },
  ]
  it('should return a function', () => {
    const { result } = renderHook(useHandleBroadcastError)
    expect(result.current).toBeInstanceOf(Function)
  })

  it('should handle broadcast errors', async () => {
    const { result } = renderHook(useHandleBroadcastError)

    await result.current(error)
    expect(showErrorBannerMock).toHaveBeenCalledWith('INSUFFICIENT_FUNDS', ['78999997952', '1089000'])
  })
})
