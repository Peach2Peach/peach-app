import { publishPGPPublicKey } from '../../../init/publishPGPPublicKey'
import { saveOffer } from '../../../utils/offer'
import { peachAPI } from '../../../utils/peachAPI'

export const publishBuyOffer = async (offerDraft: BuyOfferDraft) => {
  let { result, error: err } = await peachAPI.private.offer.postBuyOffer(offerDraft)

  if (err?.error === 'PGP_MISSING') {
    await publishPGPPublicKey()
    const response = await peachAPI.private.offer.postBuyOffer(offerDraft)
    result = response.result
    err = response.error
  }
  if (result) {
    saveOffer({ ...offerDraft, ...result })
    return { offerId: result.id, isOfferPublished: true, errorMessage: null }
  }
  return { isOfferPublished: false, errorMessage: err?.error || 'POST_OFFER_ERROR' }
}
