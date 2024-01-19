import { responseUtils } from 'test-utils'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { validSEPAData } from '../../../../tests/unit/data/paymentData'
import { createTestWallet } from '../../../../tests/unit/helpers/createTestWallet'
import { peachAPI } from '../../../utils/peachAPI'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { publishSellOffer } from './publishSellOffer'

const postSellOfferMock = jest.spyOn(peachAPI.private.offer, 'postSellOffer')

const infoMock = jest.fn()
jest.mock('../../../utils/log/info', () => ({
  info: (...args: unknown[]) => infoMock(...args),
}))

const singleOfferResult = { isPublished: true, navigationParams: { offerId: sellOffer.id }, errorMessage: null }
const multipleOffersResult = { isPublished: true, navigationParams: { offerId: '40' }, errorMessage: null }

// eslint-disable-next-line max-lines-per-function
describe('publishSellOffer', () => {
  beforeAll(() => {
    setPeachWallet(new PeachWallet({ wallet: createTestWallet() }))
  })
  const offerDraft: SellOfferDraft = {
    ...sellOffer,
    originalPaymentData: [validSEPAData],
  }

  it('should call info with "Posting offer"', async () => {
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
    postSellOfferMock.mockResolvedValue({
      result: undefined,
      error: { error: 'INTERNAL_SERVER_ERROR' },
      ...responseUtils,
    })
    const { isPublished: result, navigationParams: offer, errorMessage: error } = await publishSellOffer(offerDraft)

    expect(result).toBeFalsy()
    expect(offer).toBeNull()
    expect(error).toBe('INTERNAL_SERVER_ERROR')
  })

  it('should handle single offer being published', async () => {
    postSellOfferMock.mockResolvedValue({
      result: sellOffer,
      error: undefined,
      ...responseUtils,
    })
    const publishSellOfferResult = await publishSellOffer(offerDraft)
    expect(publishSellOfferResult).toEqual(singleOfferResult)
  })
  it('should handle multiple offer being published', async () => {
    postSellOfferMock.mockResolvedValue({
      result: [{ ...sellOffer, id: '40' }, sellOffer],
      error: undefined,
      ...responseUtils,
    })
    const publishSellOfferResult = await publishSellOffer(offerDraft)
    expect(publishSellOfferResult).toEqual(multipleOffersResult)
  })
})
