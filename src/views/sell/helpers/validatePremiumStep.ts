import { getOfferPrice } from '../../../utils/offer'

export const validatePremiumStep = (
  offer: SellOfferDraft,
  marketPrice: Pricebook | null | undefined,
  tradingLimit: TradingLimit,
) => {
  if (offer.premium > 21 || offer.premium < -21) return false
  if (!marketPrice) return false

  const currentPriceInCHF = getOfferPrice(offer.amount, offer.premium, marketPrice, 'CHF')
  return currentPriceInCHF < tradingLimit.daily
}
