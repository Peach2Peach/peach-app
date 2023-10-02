import { publishPGPPublicKey } from '../../../init/publishPGPPublicKey'
import { saveOffer } from '../../../utils/offer'
import { postBuyOffer } from '../../../utils/peachAPI'

export const publishBuyOffer = async (offerDraft: BuyOfferDraft) => {
  let [result, err] = await postBuyOffer(offerDraft)

  if (err?.error === 'PGP_MISSING') {
    await publishPGPPublicKey()
    const response = await postBuyOffer(offerDraft)
    result = response[0]
    err = response[1]
  }
  if (result) {
    saveOffer({ ...offerDraft, ...result })
    return { offerId: result.id, isOfferPublished: true, errorMessage: null }
  }
  return { isOfferPublished: false, errorMessage: err?.error || 'POST_OFFER_ERROR', errorDetails: err?.details }
}
