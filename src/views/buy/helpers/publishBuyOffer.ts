import pgp from '../../../init/pgp'
import { saveOffer } from '../../../utils/offer'
import { postBuyOffer } from '../../../utils/peachAPI'
import { getAndUpdateTradingLimit } from './getAndUpdateTradingLimit'

export const publishBuyOffer = async (
  offerDraft: BuyOfferDraft,
): Promise<{ isOfferPublished: boolean; errorMessage: string | null }> => {
  await pgp() // make sure pgp has been sent
  const [result, err] = await postBuyOffer(offerDraft)

  if (result) {
    getAndUpdateTradingLimit()
    saveOffer({ ...offerDraft, ...result })
    return { isOfferPublished: true, errorMessage: null }
  }
  return { isOfferPublished: false, errorMessage: err?.error || 'POST_OFFER_ERROR' }
}
