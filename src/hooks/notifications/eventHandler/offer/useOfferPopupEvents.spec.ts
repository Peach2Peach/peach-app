/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { act, renderHook } from '@testing-library/react-native'
import { useOfferPopupEvents } from './useOfferPopupEvents'

const getOfferDetailsMock = jest.fn()
jest.mock('../../../../utils/peachAPI', () => ({
  getOfferDetails: (...args: any[]) => getOfferDetailsMock(...args),
}))

const showFundingAmountDifferentPopupMock = jest.fn()
jest.mock('../../../../overlays/useShowFundingAmountDifferentPopup', () => ({
  useShowFundingAmountDifferentPopup: () => showFundingAmountDifferentPopupMock,
}))
const showWronglyFundedPopupMock = jest.fn()
jest.mock('../../../../overlays/useShowWronglyFundedPopup', () => ({
  useShowWronglyFundedPopup: () => showWronglyFundedPopupMock,
}))
const offerOutsideRangeOverlayMock = jest.fn()
jest.mock('../../../../overlays/useOfferOutsideRangeOverlay', () => ({
  useOfferOutsideRangeOverlay: () => offerOutsideRangeOverlayMock,
}))
const buyOfferExpiredOverlayMock = jest.fn()
jest.mock('../../../../overlays/useBuyOfferExpiredOverlay', () => ({
  useBuyOfferExpiredOverlay: () => buyOfferExpiredOverlayMock,
}))

describe('useOfferPopupEvents', () => {
  const offerId = '123'
  const sellOffer = { id: offerId, type: 'ask' }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should show confirm escrow overlay on offer.fundingAmountDifferent', async () => {
    const { result } = renderHook(() => useOfferPopupEvents())
    getOfferDetailsMock.mockResolvedValueOnce([sellOffer])
    const eventData = { offerId: sellOffer.id } as PNData
    await act(async () => {
      await result.current['offer.fundingAmountDifferent']!(eventData)
    })
    expect(showFundingAmountDifferentPopupMock).toHaveBeenCalledWith(sellOffer)
  })

  it('should show wrongly funded overlay on offer.wrongFundingAmount', async () => {
    const { result } = renderHook(() => useOfferPopupEvents())

    getOfferDetailsMock.mockResolvedValueOnce([sellOffer])
    const eventData = { offerId: sellOffer.id } as PNData
    await act(async () => {
      await result.current['offer.wrongFundingAmount']!(eventData)
    })
    expect(showWronglyFundedPopupMock).toHaveBeenCalledWith(sellOffer)
  })
  it('should show offer outside range overlay on offer.outsideRange', () => {
    const { result } = renderHook(() => useOfferPopupEvents())

    const eventData = { offerId } as PNData
    act(() => {
      result.current['offer.outsideRange']!(eventData)
    })
    expect(offerOutsideRangeOverlayMock).toHaveBeenCalledWith(offerId)
  })
  it('should show buy offer expired overlay on offer.buyOfferExpired', () => {
    const { result } = renderHook(() => useOfferPopupEvents())

    const eventData = { offerId: '1' } as PNData
    act(() => {
      result.current['offer.buyOfferExpired']!(eventData, { bodyLocArgs: ['P-1', '30'] })
    })
    expect(buyOfferExpiredOverlayMock).toHaveBeenCalledWith('P-1', '30')
  })

  it('should not call overlay functions when offerId is null', () => {
    const { result } = renderHook(() => useOfferPopupEvents())

    const eventData = {} as PNData
    act(() => {
      result.current['offer.fundingAmountDifferent']!(eventData)
      result.current['offer.wrongFundingAmount']!(eventData)
      result.current['offer.outsideRange']!(eventData)
    })
    expect(showFundingAmountDifferentPopupMock).not.toHaveBeenCalled()
    expect(showWronglyFundedPopupMock).not.toHaveBeenCalled()
    expect(offerOutsideRangeOverlayMock).not.toHaveBeenCalled()
  })
})
