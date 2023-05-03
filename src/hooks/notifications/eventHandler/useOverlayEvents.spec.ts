import { act, renderHook } from '@testing-library/react-native'
import { NavigationWrapper, navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useOverlayEvents } from './useOverlayEvents'

describe('useOverlayEvents', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should navigate to newBadge screen on "user.badge.unlocked" event', () => {
    const { result } = renderHook(useOverlayEvents, { wrapper: NavigationWrapper })

    const badges = 'fastTrader,superTrader'
    const data = { badges } as PNData
    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result.current['user.badge.unlocked']!(data)
    })

    expect(navigateMock).toHaveBeenCalledWith('newBadge', { badges })
  })
  it('should navigate to offerPublished screen on "offer.escrowFunded" event', () => {
    const { result } = renderHook(useOverlayEvents, { wrapper: NavigationWrapper })

    const offerId = '123'
    const data = { offerId } as PNData
    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result.current['offer.escrowFunded']!(data)
    })

    expect(navigateMock).toHaveBeenCalledWith('offerPublished', { isSellOffer: true, shouldGoBack: true })
  })

  it('should not navigate to offerPublished screen on "offer.escrowFunded" event if offerId is not provided', () => {
    const { result } = renderHook(useOverlayEvents, { wrapper: NavigationWrapper })

    const data = {} as PNData
    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result.current['offer.escrowFunded']!(data)
    })

    expect(navigateMock).not.toHaveBeenCalled()
  })
})
