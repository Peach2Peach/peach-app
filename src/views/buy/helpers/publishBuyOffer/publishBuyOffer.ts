import pgp from '../../../../init/pgp'
import { saveOffer } from '../../../../utils/offer'
import { getOfferDetails, postBuyOffer } from '../../../../utils/peachAPI'
import { getAndUpdateTradingLimit } from '../getAndUpdateTradingLimit'

export const publishBuyOffer = async (offerDraft: BuyOfferDraft): Promise<[boolean, string | null]> => {
  await pgp() // make sure pgp has been sent
  const [result, err] = await postBuyOffer(offerDraft)

  if (result) {
    getAndUpdateTradingLimit()
    const [offer] = await getOfferDetails({ offerId: result.offerId })
    if (offer) {
      saveOffer(offer)
    }
    return [true, null]
  }
  return [false, err?.error || 'POST_OFFER_ERROR']
}
