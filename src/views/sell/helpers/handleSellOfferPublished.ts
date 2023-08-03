import { saveOffer } from '../../../utils/offer'
import { info } from './../../../utils/log'

export const handleSellOfferPublished = (result: SellOffer, offerDraft: SellOfferDraft) => {
  info('Posted offer', result)

  saveOffer({ ...offerDraft, ...result })
  return { isPublished: true, navigationParams: { offerId: result.id }, errorMessage: null }
}
