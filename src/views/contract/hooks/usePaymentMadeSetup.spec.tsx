import { renderHook } from 'test-utils'
import { canGoBackMock, goBackMock, navigateMock, resetMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { usePaymentMadeSetup } from './usePaymentMadeSetup'

const contractId = '123-456'
const useRouteMock = jest.fn(() => ({
  params: { contractId },
}))
jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))
describe('usePaymentMadeSetup', () => {
  it('should return defaults', () => {
    const { result } = renderHook(usePaymentMadeSetup)
    expect(result.current).toEqual({
      close: expect.any(Function),
      goToTrade: expect.any(Function),
    })
  })
  it('should go to trade by resetting navigation', () => {
    // background is to avoid mounting 2 contract screens
    const { result } = renderHook(usePaymentMadeSetup)
    result.current.goToTrade()
    expect(resetMock).toHaveBeenCalledWith({
      index: 1,
      routes: [{ name: 'yourTrades' }, { name: 'contract', params: { contractId } }],
    })
  })
  it('should close popup by going back', () => {
    canGoBackMock.mockReturnValueOnce(true)
    const { result } = renderHook(usePaymentMadeSetup)
    result.current.close()
    expect(goBackMock).toHaveBeenCalled()
  })
  it('should close popup by navigating to buy if cannot go back', () => {
    canGoBackMock.mockReturnValueOnce(false)
    const { result } = renderHook(usePaymentMadeSetup)
    result.current.close()
    expect(navigateMock).toHaveBeenCalledWith('buy')
  })
})
