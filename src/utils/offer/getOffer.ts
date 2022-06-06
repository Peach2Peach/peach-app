import { account } from '../account'

type LegacyOffer = (SellOffer|BuyOffer) & {
  currencies: Currency[],
  paymentMethods: PaymentMethod[],
}

/**
  * @description Method to get saved offer
  * @param id offer id
  * @returns offer
  */
export const getOffer = (id: string): SellOffer|BuyOffer|null => {
  const offer = account.offers.find(c => c.id === id)

  if (!offer) return null

  if (!offer.seenMatches) offer.seenMatches = []

  // TODO remove for release 0.1.0
  if ((offer as LegacyOffer).currencies && Array.isArray((offer as LegacyOffer).currencies)) {
    offer.meansOfPayment = (offer as LegacyOffer).currencies.reduce((mops, currency) => ({
      ...mops,
      [currency]: (offer as LegacyOffer).paymentMethods
    }), {})
  }

  // TODO remove for release 0.1.0
  if (offer.funding?.amount) {
    offer.funding.amounts = [offer.funding.amount]
  }
  return offer
}