/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { act, renderHook } from '@testing-library/react-native'
import { useOfferPopupEvents } from './useOfferPopupEvents'
import { getOffer } from '../../../../utils/offer'

const confirmEscrowOverlayMock = jest.fn()
jest.mock('../../../../overlays/useConfirmEscrowOverlay', () => ({
  useConfirmEscrowOverlay: () => confirmEscrowOverlayMock,
}))
const wronglyFundedOverlayMock = jest.fn()
jest.mock('../../../../overlays/useWronglyFundedOverlay', () => ({
  useWronglyFundedOverlay: () => wronglyFundedOverlayMock,
}))
const buyOfferExpiredOverlayMock = jest.fn()
jest.mock('../../../../overlays/useBuyOfferExpiredOverlay', () => ({
  useBuyOfferExpiredOverlay: () => buyOfferExpiredOverlayMock,
}))
jest.mock('../../../../utils/offer', () => ({
  getOffer: jest.fn(),
}))

describe('useOfferPopupEvents', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  test('should show confirm escrow overlay on offer.fundingAmountDifferent', () => {
    const { result } = renderHook(() => useOfferPopupEvents())
    const sellOffer = { id: '123' }
    ;(getOffer as jest.Mock).mockReturnValue(sellOffer)
    const eventData = { offerId: sellOffer.id } as PNData
    act(() => {
      result.current['offer.fundingAmountDifferent']!(eventData)
    })
    expect(confirmEscrowOverlayMock).toHaveBeenCalledWith(sellOffer)
  })

  test('should show wrongly funded overlay on offer.wrongFundingAmount', () => {
    const { result } = renderHook(() => useOfferPopupEvents())

    const sellOffer = { id: '123' }
    ;(getOffer as jest.Mock).mockReturnValue(sellOffer)
    const eventData = { offerId: sellOffer.id } as PNData
    act(() => {
      result.current['offer.wrongFundingAmount']!(eventData)
    })
    expect(wronglyFundedOverlayMock).toHaveBeenCalledWith(sellOffer)
  })
  test('should show buy offer expired overlay on offer.buyOfferExpired', () => {
    const { result } = renderHook(() => useOfferPopupEvents())

    const eventData = { offerId: '1' } as PNData
    act(() => {
      result.current['offer.buyOfferExpired']!(eventData, { bodyLocArgs: ['P-1', '30'] })
    })
    expect(buyOfferExpiredOverlayMock).toHaveBeenCalledWith('P-1', '30')
  })

  test('should not call overlay functions when offerId is null', () => {
    const { result } = renderHook(() => useOfferPopupEvents())

    const eventData = {} as PNData
    act(() => {
      result.current['offer.fundingAmountDifferent']!(eventData)
      result.current['offer.wrongFundingAmount']!(eventData)
    })
    expect(confirmEscrowOverlayMock).not.toHaveBeenCalled()
    expect(wronglyFundedOverlayMock).not.toHaveBeenCalled()
  })
})
