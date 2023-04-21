import { publishPGPPublicKey } from '../../../init/publishPGPPublicKey'
import i18n from '../../../utils/i18n'
import { saveOffer } from '../../../utils/offer'
import { postSellOffer } from '../../../utils/peachAPI'
import { info } from './../../../utils/log'

export const publishSellOffer = async (
  offerDraft: SellOfferDraft,
): Promise<{ isPublished: boolean; navigationParams: { offerId: string } | null; errorMessage: string | null }> => {
  info('Posting sell offer')

  const payload = {
    type: offerDraft.type,
    amount: offerDraft.amount,
    premium: offerDraft.premium,
    meansOfPayment: offerDraft.meansOfPayment,
    paymentData: offerDraft.paymentData,
    returnAddress: offerDraft.returnAddress,
  }

  let [result, err] = await postSellOffer(payload)
  if (err?.error === 'PGP_MISSING') {
    await publishPGPPublicKey()
    const response = await postSellOffer(payload)
    result = response[0]
    err = response[1]
  }

  if (result) {
    info('Posted offer', result)

    saveOffer({ ...offerDraft, ...result })
    return { isPublished: true, navigationParams: { offerId: result.id }, errorMessage: null }
  }
  return {
    isPublished: false,
    navigationParams: null,
    errorMessage: i18n(err?.error || 'POST_OFFER_ERROR', ((err?.details as string[]) || []).join(', ')),
  }
}
