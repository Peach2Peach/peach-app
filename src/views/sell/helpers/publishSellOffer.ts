import pgp from '../../../init/pgp'
import i18n from '../../../utils/i18n'
import { isSellOffer } from '../../../utils/offer'
import { getOfferDetails, postSellOffer } from '../../../utils/peachAPI'
import { getAndUpdateTradingLimit } from '../../buy/helpers/getAndUpdateTradingLimit'
import { info } from './../../../utils/log'
export const publishSellOffer = async (
  offerDraft: SellOfferDraft,
): Promise<[boolean, { offer: SellOffer } | null, string | null]> => {
  info('Posting offer ', JSON.stringify(offerDraft))

  await pgp() // make sure pgp has been sent

  const [result, err] = await postSellOffer({
    type: offerDraft.type,
    amount: offerDraft.amount,
    premium: offerDraft.premium,
    meansOfPayment: offerDraft.meansOfPayment,
    paymentData: offerDraft.paymentData,
    returnAddress: offerDraft.returnAddress,
  })

  if (result) {
    info('Posted offer', result)

    getAndUpdateTradingLimit()
    const [offer] = await getOfferDetails({ offerId: result.offerId })
    if (offer && isSellOffer(offer)) {
      return [true, { offer }, null]
    }
    return [true, { offer: { ...offerDraft, id: result.offerId } }, null]
  }
  return [false, null, i18n(err?.error || 'POST_OFFER_ERROR', ((err?.details as string[]) || []).join(', '))]
}
