import { getOfferPrice } from '../../../utils/offer'

export const validatePremiumStep = (
  offer: SellOfferDraft,
  priceBook: Pricebook | null | undefined,
  tradingLimit: TradingLimit,
) => {
  if (offer.premium > 21 || offer.premium < -21) return false
  if (!priceBook) return false

  const currentPriceInCHF = getOfferPrice(offer.amount, offer.premium, priceBook, 'CHF')
  return currentPriceInCHF <= tradingLimit.daily
}
