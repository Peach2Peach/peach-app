/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { act, renderHook } from '@testing-library/react-hooks'
import { usePopupEvents } from '../../../../../src/hooks/notifications/eventHandler/usePopupEvents'
import { getOffer } from '../../../../../src/utils/offer'

const confirmEscrowOverlayMock = jest.fn()
jest.mock('../../../../../src/overlays/useConfirmEscrowOverlay', () => ({
  useConfirmEscrowOverlay: () => confirmEscrowOverlayMock,
}))
const wronglyFundedOverlayMock = jest.fn()
jest.mock('../../../../../src/overlays/useWronglyFundedOverlay', () => ({
  useWronglyFundedOverlay: () => wronglyFundedOverlayMock,
}))
jest.mock('../../../../../src/utils/offer/getOffer', () => ({
  getOffer: jest.fn(),
}))

describe('usePopupEvents', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  test('should show confirm escrow overlay on offer.fundingAmountDifferent', () => {
    const { result } = renderHook(() => usePopupEvents())
    const sellOffer = { id: '123' }
    ;(getOffer as jest.Mock).mockReturnValue(sellOffer)
    const eventData = { offerId: sellOffer.id } as PNData
    act(() => {
      result.current['offer.fundingAmountDifferent']!(eventData)
    })
    expect(confirmEscrowOverlayMock).toHaveBeenCalledWith(sellOffer)
  })

  test('should show wrongly funded overlay on offer.wrongFundingAmount', () => {
    const { result } = renderHook(() => usePopupEvents())

    const sellOffer = { id: '123' }
    ;(getOffer as jest.Mock).mockReturnValue(sellOffer)
    const eventData = { offerId: sellOffer.id } as PNData
    act(() => {
      result.current['offer.wrongFundingAmount']!(eventData)
    })
    expect(wronglyFundedOverlayMock).toHaveBeenCalledWith(sellOffer)
  })

  test('should not call overlay functions when offerId is null', () => {
    const { result } = renderHook(() => usePopupEvents())

    const eventData = {} as PNData
    act(() => {
      result.current['offer.fundingAmountDifferent']!(eventData)
      result.current['offer.wrongFundingAmount']!(eventData)
    })
    expect(confirmEscrowOverlayMock).not.toHaveBeenCalled()
    expect(wronglyFundedOverlayMock).not.toHaveBeenCalled()
  })
})
