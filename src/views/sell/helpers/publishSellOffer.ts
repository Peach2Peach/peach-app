import pgp from '../../../init/pgp'
import i18n from '../../../utils/i18n'
import { postSellOffer } from '../../../utils/peachAPI'
import { getAndUpdateTradingLimit } from '../../buy/helpers/getAndUpdateTradingLimit'
import { info } from './../../../utils/log'
export const publishSellOffer = async (
  offerDraft: SellOfferDraft,
): Promise<{ isPublished: boolean; navigationParams: { offer: SellOffer } | null; errorMessage: string | null }> => {
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
    return { isPublished: true, navigationParams: { offer: { ...offerDraft, ...result } }, errorMessage: null }
  }
  return {
    isPublished: false,
    navigationParams: null,
    errorMessage: i18n(err?.error || 'POST_OFFER_ERROR', ((err?.details as string[]) || []).join(', ')),
  }
}
