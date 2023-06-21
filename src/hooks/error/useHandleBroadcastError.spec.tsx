import { renderHook } from '@testing-library/react-native'
import { useHandleBroadcastError } from './useHandleBroadcastError'
import { broadcastError } from '../../../tests/unit/data/errors'

const showErrorBannerMock = jest.fn()
jest.mock('../useShowErrorBanner', () => ({
  useShowErrorBanner:
    () =>
      (...args: any[]) =>
        showErrorBannerMock(...args),
}))

describe('useHandleBroadcastError', () => {
  it('should return a function', () => {
    const { result } = renderHook(useHandleBroadcastError)
    expect(result.current).toBeInstanceOf(Function)
  })

  it('should handle broadcast errors', () => {
    const { result } = renderHook(useHandleBroadcastError)

    result.current(broadcastError)
    expect(showErrorBannerMock).toHaveBeenCalledWith('INSUFFICIENT_FUNDS', ['78999997952', '1089000'])
  })
})
