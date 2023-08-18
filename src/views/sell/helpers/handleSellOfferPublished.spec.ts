import { sellOffer } from '../../../../tests/unit/data/offerData'
import { validSEPAData } from '../../../../tests/unit/data/paymentData'
import { handleSellOfferPublished } from './handleSellOfferPublished'

const saveOfferMock = jest.fn()
jest.mock('../../../utils/offer', () => ({
  saveOffer: (offer: any) => saveOfferMock(offer),
}))

describe('handleSellOfferPublished', () => {
  const offerDraft: SellOfferDraft = {
    ...sellOffer,
    originalPaymentData: [validSEPAData],
  }

  it('should call saveOffer with offerDraft and result', async () => {
    await handleSellOfferPublished(sellOffer, offerDraft)

    expect(saveOfferMock).toHaveBeenCalledWith({ ...offerDraft, ...sellOffer })
  })

  it('should return publishing result data', async () => {
    const {
      isPublished: result,
      navigationParams: offer,
      errorMessage: error,
    } = await handleSellOfferPublished(sellOffer, offerDraft)

    expect(result).toBeTruthy()
    expect(offer).toEqual({ offerId: sellOffer.id })
    expect(error).toBeNull()
  })
})
