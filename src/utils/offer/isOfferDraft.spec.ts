import { buyOffer, sellOffer } from '../../../tests/unit/data/offerData'
import { getSellOfferDraft } from '../../../tests/unit/data/offerDraftData'
import { isOfferDraft } from './isOfferDraft'

describe('isOfferDraft', () => {
  test('tell if an offer is a draft or not', () => {
    expect(isOfferDraft(sellOffer)).toBeFalsy()
    expect(isOfferDraft(buyOffer)).toBeFalsy()
    expect(isOfferDraft({ ...sellOffer, id: undefined })).toBeTruthy()
    expect(isOfferDraft({ ...buyOffer, id: undefined })).toBeTruthy()
    expect(isOfferDraft(getSellOfferDraft())).toBeTruthy()
  })
})
