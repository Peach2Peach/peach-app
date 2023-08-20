import { sellOffer } from '../../../../tests/unit/data/offerData'
import { validSEPAData } from '../../../../tests/unit/data/paymentData'
import i18n from '../../../utils/i18n'
import { publishSellOffer } from './publishSellOffer'

const pgpMock = jest.fn().mockResolvedValue(undefined)
const postSellOfferMock = jest.fn().mockResolvedValue([undefined, undefined])
const getOfferDetailsMock = jest.fn().mockResolvedValue([undefined])
const infoMock = jest.fn()

jest.mock('../../../init/publishPGPPublicKey', () => ({
  publishPGPPublicKey: () => pgpMock(),
}))

jest.mock('../../../utils/log', () => ({
  info: (...args: unknown[]) => infoMock(...args),
}))

jest.mock('../../../utils/peachAPI', () => ({
  postSellOffer: (offerDraft: unknown) => postSellOfferMock(offerDraft),
  getOfferDetails: (offerId: unknown) => getOfferDetailsMock(offerId),
}))

const singleOfferResult = { isPublished: true, navigationParams: { offerId: sellOffer.id }, errorMessage: null }
const handleSellOfferPublishedMock = jest.fn().mockReturnValue(singleOfferResult)
jest.mock('./handleSellOfferPublished', () => ({
  handleSellOfferPublished: (...args: unknown[]) => handleSellOfferPublishedMock(...args),
}))

const multipleOffersResult = { isPublished: true, navigationParams: { offerId: '40' }, errorMessage: null }
const handleMultipleOffersPublishedMock = jest.fn().mockResolvedValue(multipleOffersResult)
jest.mock('./handleMultipleOffersPublished', () => ({
  handleMultipleOffersPublished: (...args: unknown[]) => handleMultipleOffersPublishedMock(...args),
}))

// eslint-disable-next-line max-lines-per-function
describe('publishSellOffer', () => {
  const offerDraft: SellOfferDraft = {
    ...sellOffer,
    originalPaymentData: [validSEPAData],
  }

  it('should call info with "Posting offer"', async () => {
    // @ts-ignore
    await publishSellOffer(offerDraft)

    expect(infoMock).toHaveBeenCalledWith('Posting sell offer')
  })

  it('should call postSellOffer with offerDraft', async () => {
    await publishSellOffer(offerDraft)

    expect(postSellOfferMock).toHaveBeenCalledWith({
      amount: offerDraft.amount,
      multi: undefined,
      meansOfPayment: offerDraft.meansOfPayment,
      paymentData: offerDraft.paymentData,
      premium: offerDraft.premium,
      returnAddress: offerDraft.returnAddress,
      type: 'ask',
    })
  })

  test('if there is no result from postSellOffer it should return an errorMessage', async () => {
    postSellOfferMock.mockResolvedValue([undefined])
    const { isPublished: result, navigationParams: offer, errorMessage: error } = await publishSellOffer(offerDraft)

    expect(result).toBeFalsy()
    expect(offer).toBeNull()
    expect(error).toBe(i18n('POST_OFFER_ERROR'))
  })

  it('should handle single offer being published', async () => {
    postSellOfferMock.mockResolvedValue([sellOffer, undefined])
    const publishSellOfferResult = await publishSellOffer(offerDraft)
    expect(publishSellOfferResult).toEqual(singleOfferResult)
    expect(handleSellOfferPublishedMock).toHaveBeenCalledWith(sellOffer, offerDraft)
  })
  it('should handle multiple offer being published', async () => {
    postSellOfferMock.mockResolvedValue([[sellOffer, sellOffer], undefined])
    const publishSellOfferResult = await publishSellOffer(offerDraft)
    expect(publishSellOfferResult).toEqual(multipleOffersResult)
    expect(handleMultipleOffersPublishedMock).toHaveBeenCalledWith([sellOffer, sellOffer], offerDraft)
  })

  it('should send pgp keys and retry posting buy offer if first error is PGP_MISSING', async () => {
    postSellOfferMock.mockResolvedValueOnce([undefined, { error: 'PGP_MISSING' }])
    postSellOfferMock.mockResolvedValueOnce([sellOffer, undefined])

    const { isPublished: result, navigationParams: offer, errorMessage: error } = await publishSellOffer(offerDraft)

    expect(pgpMock).toHaveBeenCalled()
    expect(result).toBeTruthy()
    expect(offer).toEqual({ offerId: sellOffer.id })
    expect(error).toBeNull()
  })
})
