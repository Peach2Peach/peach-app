import { useOfferPreferences } from '../../../store/offerPreferenes'
import { saveOffer } from '../../../utils/offer'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { info } from './../../../utils/log'

export const handleMultipleOffersPublished = async (result: SellOffer[], offerDraft: SellOfferDraft) => {
  info('Posted offers', result)

  useOfferPreferences.getState().setMulti(undefined)
  result.forEach((offer) => saveOffer({ ...offerDraft, ...offer }))

  const internalAddress = await peachWallet.getNewInternalAddress()
  const newInternalAddress = await peachWallet.getInternalAddress(internalAddress.index + 10)

  useWalletState.getState().registerFundMultiple(
    newInternalAddress.address,
    result.map((offer) => offer.id),
  )

  // here we take the ID of the first offer to navigate. The funding screen, will handle it from there
  return { isPublished: true, navigationParams: { offerId: result[0].id }, errorMessage: null }
}
