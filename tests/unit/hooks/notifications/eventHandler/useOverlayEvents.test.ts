import { act, renderHook } from '@testing-library/react-hooks'
import { useNavigation } from '../../../../../src/hooks'
import { useOverlayEvents } from '../../../../../src/hooks/notifications/eventHandler/useOverlayEvents'

jest.mock('../../../../../src/hooks/useNavigation', () => ({
  useNavigation: jest.fn().mockReturnValue({
    navigate: jest.fn(),
  }),
}))

describe('useOverlayEvents', () => {
  afterEach(() => {
    ;(<jest.Mock>useNavigation().navigate).mockReset()
  })
  it('should navigate to offerPublished screen on "offer.escrowFunded" event', () => {
    const { result } = renderHook(() => useOverlayEvents())

    const offerId = '123'
    const data = { offerId } as PNData
    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result.current['offer.escrowFunded']!(data)
    })

    expect(useNavigation().navigate).toHaveBeenCalledWith('offerPublished', { offerId, shouldGoBack: true })
  })

  it('should not navigate to offerPublished screen on "offer.escrowFunded" event if offerId is not provided', () => {
    const { result } = renderHook(() => useOverlayEvents())

    const data = {} as PNData
    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result.current['offer.escrowFunded']!(data)
    })

    expect(useNavigation().navigate).not.toHaveBeenCalled()
  })
})
