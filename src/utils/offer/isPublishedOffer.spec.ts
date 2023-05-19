import { buyOffer, sellOffer } from '../../../tests/unit/data/offerData'
import { getBuyOfferDraft, getSellOfferDraft } from '../../../tests/unit/data/offerDraftData'
import { isPublishedOffer } from './isPublishedOffer'

describe('isPublishedOffer', () => {
  test('tell if an offer is published or not', () => {
    expect(isPublishedOffer(buyOffer)).toBeTruthy()
    expect(isPublishedOffer(sellOffer)).toBeTruthy()
    expect(isPublishedOffer({ ...buyOffer, id: undefined })).toBeFalsy()
    expect(isPublishedOffer({ ...sellOffer, id: undefined })).toBeFalsy()
    expect(isPublishedOffer(getBuyOfferDraft())).toBeFalsy()
    expect(isPublishedOffer(getSellOfferDraft())).toBeFalsy()
  })
})
