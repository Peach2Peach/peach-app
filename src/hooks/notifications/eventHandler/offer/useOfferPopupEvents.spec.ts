/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { act, renderHook } from 'test-utils'
import { useOfferPopupEvents } from './useOfferPopupEvents'

const getOfferDetailsMock = jest.fn()
jest.mock('../../../../utils/peachAPI', () => ({
  getOfferDetails: (...args: unknown[]) => getOfferDetailsMock(...args),
}))

const showFundingAmountDifferentPopupMock = jest.fn()
jest.mock('../../../../popups/useShowFundingAmountDifferentPopup', () => ({
  useShowFundingAmountDifferentPopup: () => showFundingAmountDifferentPopupMock,
}))
const showWronglyFundedPopupMock = jest.fn()
jest.mock('../../../../popups/useShowWronglyFundedPopup', () => ({
  useShowWronglyFundedPopup: () => showWronglyFundedPopupMock,
}))
const offerOutsideRangePopupMock = jest.fn()
jest.mock('../../../../popups/useOfferOutsideRangePopup', () => ({
  useOfferOutsideRangePopup: () => offerOutsideRangePopupMock,
}))
const buyOfferExpiredPopupMock = jest.fn()
jest.mock('../../../../popups/useBuyOfferExpiredPopup', () => ({
  useBuyOfferExpiredPopup: () => buyOfferExpiredPopupMock,
}))

describe('useOfferPopupEvents', () => {
  const offerId = '123'
  const sellOffer = { id: offerId, type: 'ask' }

  it('should show confirm escrow popup on offer.fundingAmountDifferent', async () => {
    const { result } = renderHook(() => useOfferPopupEvents())
    getOfferDetailsMock.mockResolvedValueOnce([sellOffer])
    const eventData = { offerId: sellOffer.id } as PNData
    await act(() => {
      result.current['offer.fundingAmountDifferent']!(eventData)
    })
    expect(showFundingAmountDifferentPopupMock).toHaveBeenCalledWith(sellOffer)
  })

  it('should show wrongly funded popup on offer.wrongFundingAmount', async () => {
    const { result } = renderHook(() => useOfferPopupEvents())

    getOfferDetailsMock.mockResolvedValueOnce([sellOffer])
    const eventData = { offerId: sellOffer.id } as PNData
    await act(() => {
      result.current['offer.wrongFundingAmount']!(eventData)
    })
    expect(showWronglyFundedPopupMock).toHaveBeenCalledWith(sellOffer)
  })
  it('should show offer outside range popup on offer.outsideRange', () => {
    const { result } = renderHook(() => useOfferPopupEvents())

    const eventData = { offerId } as PNData
    act(() => {
      result.current['offer.outsideRange']!(eventData)
    })
    expect(offerOutsideRangePopupMock).toHaveBeenCalledWith(offerId)
  })
  it('should show buy offer expired popup on offer.buyOfferExpired', () => {
    const { result } = renderHook(() => useOfferPopupEvents())

    const eventData = { offerId: '1' } as PNData
    act(() => {
      result.current['offer.buyOfferExpired']!(eventData, { bodyLocArgs: ['P-1', '30'] })
    })
    expect(buyOfferExpiredPopupMock).toHaveBeenCalledWith('P-1', '30')
  })

  it('should not call popup functions when offerId is null', () => {
    const { result } = renderHook(() => useOfferPopupEvents())

    const eventData = {} as PNData
    act(() => {
      result.current['offer.fundingAmountDifferent']!(eventData)
      result.current['offer.wrongFundingAmount']!(eventData)
      result.current['offer.outsideRange']!(eventData)
    })
    expect(showFundingAmountDifferentPopupMock).not.toHaveBeenCalled()
    expect(showWronglyFundedPopupMock).not.toHaveBeenCalled()
    expect(offerOutsideRangePopupMock).not.toHaveBeenCalled()
  })
})
