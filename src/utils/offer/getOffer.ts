import { useAccountStore } from '../account/account'
import { isSellOffer } from './isSellOffer'

export const getOffer = (id: string): SellOffer | BuyOffer | undefined => {
  const account = useAccountStore.getState().account
  const offer = account.offers.find((c) => c.id === id)

  if (!offer) return undefined

  if (isSellOffer(offer)) {
    offer.funding.txIds = offer.funding.txIds || []
    offer.funding.vouts = offer.funding.vouts || []
    offer.funding.amounts = offer.funding.amounts || []
  }
  return offer
}
