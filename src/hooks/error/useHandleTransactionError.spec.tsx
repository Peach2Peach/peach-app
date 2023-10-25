import { renderHook } from 'test-utils'
import { transactionError } from '../../../tests/unit/data/errors'
import { useHandleTransactionError } from './useHandleTransactionError'

const showErrorBannerMock = jest.fn()
jest.mock('../useShowErrorBanner', () => ({
  useShowErrorBanner:
    () =>
      (...args: any[]) =>
        showErrorBannerMock(...args),
}))

describe('useHandleTransactionError', () => {
  it('should return a function', () => {
    const { result } = renderHook(useHandleTransactionError)
    expect(result.current).toBeInstanceOf(Function)
  })

  it('should handle broadcast errors', () => {
    const { result } = renderHook(useHandleTransactionError)

    result.current(transactionError)
    expect(showErrorBannerMock).toHaveBeenCalledWith('INSUFFICIENT_FUNDS', ['78999997952', '1089000'])
  })
})
