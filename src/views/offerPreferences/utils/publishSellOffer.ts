import { publishPGPPublicKey } from '../../../init/publishPGPPublicKey'
import i18n from '../../../utils/i18n'
import { info } from '../../../utils/log'
import { isSellOffer, saveOffer } from '../../../utils/offer'
import { peachAPI } from '../../../utils/peachAPI'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'

export const publishSellOffer = async (offerDraft: SellOfferDraft) => {
  info('Posting sell offer')
  const { type, amount, premium, meansOfPayment, paymentData, returnAddress, multi, instantTradeCriteria } = offerDraft

  const payload = { type, amount, premium, meansOfPayment, paymentData, returnAddress, multi, instantTradeCriteria }

  let { result, error: err } = await peachAPI.private.offer.postSellOffer(payload)
  if (err?.error === 'PGP_MISSING') {
    await publishPGPPublicKey()
    const response = await peachAPI.private.offer.postSellOffer(payload)
    result = response.result
    err = response.error
  }

  if (result) {
    if (!Array.isArray(result)) {
      if (isSellOffer(result)) {
        info('Posted offer', result)
        saveOffer({ ...offerDraft, ...result })

        return { isPublished: true, navigationParams: { offerId: result.id }, errorMessage: null } as const
      }
    } else if (result.every(isSellOffer)) {
      return handleMultipleOffersPublished(result, offerDraft)
    }
  }
  return {
    isPublished: false,
    navigationParams: null,
    errorMessage: i18n(err?.error || 'POST_OFFER_ERROR', (err?.details || []).join(', ')),
  } as const
}

async function handleMultipleOffersPublished (result: SellOffer[], offerDraft: SellOfferDraft) {
  info('Posted offers', result)

  result.forEach((offer) => saveOffer({ ...offerDraft, ...offer }))

  const internalAddress = await peachWallet.getInternalAddress()
  const newInternalAddress = await peachWallet.getInternalAddress(internalAddress.index + 10)
  useWalletState.getState().registerFundMultiple(
    newInternalAddress.address,
    result.map((offer) => offer.id),
  )

  return { isPublished: true, navigationParams: { offerId: result[0].id }, errorMessage: null } as const
}
