import { renderHook } from '@testing-library/react-native'
import { NavigationWrapper, goBackMock, replaceMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useOfferPublishedSetup } from './useOfferPublishedSetup'

const offerId = '123'
const useRouteMock = jest.fn().mockReturnValue({ params: { offerId, isSellOffer: false, shouldGoBack: false } })
jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

describe('useOfferPublishedSetup', () => {
  it('returns defaults', () => {
    const { result } = renderHook(useOfferPublishedSetup, { wrapper: NavigationWrapper })
    expect(result.current).toEqual({
      goToOffer: expect.any(Function),
      closeAction: expect.any(Function),
    })
  })

  it('should navigate to search', () => {
    const { result } = renderHook(useOfferPublishedSetup, { wrapper: NavigationWrapper })
    result.current.goToOffer()
    expect(replaceMock).toHaveBeenCalledWith('search', { offerId })
  })
  it('should go back to buy for buy offers for close action', () => {
    const { result } = renderHook(useOfferPublishedSetup, { wrapper: NavigationWrapper })
    result.current.closeAction()
    expect(replaceMock).toHaveBeenCalledWith('buy')
  })
  it('should go back to sell for sell offers for close action', () => {
    useRouteMock.mockReturnValueOnce({ params: { isSellOffer: true, shouldGoBack: false } })
    const { result } = renderHook(useOfferPublishedSetup, { wrapper: NavigationWrapper })
    result.current.closeAction()
    expect(replaceMock).toHaveBeenCalledWith('sell')
  })
  it('should go back when for close action when shouldGoBack is true', () => {
    useRouteMock.mockReturnValueOnce({ params: { isSellOffer: true, shouldGoBack: true } })
    const { result } = renderHook(useOfferPublishedSetup, { wrapper: NavigationWrapper })
    result.current.closeAction()
    expect(goBackMock).toHaveBeenCalled()
  })
})
