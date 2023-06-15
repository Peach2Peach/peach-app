import { getOfferPrice } from '../../../utils/offer'

export const validatePremiumStep = (
  { amount, premium }: Pick<SellOfferDraft, 'amount' | 'premium'>,
  priceBook: Pricebook | null | undefined,
  tradingLimit: TradingLimit,
) => {
  if (premium > 21 || premium < -21) return false
  if (!priceBook) return false

  const currentPriceInCHF = getOfferPrice(amount, premium, priceBook, 'CHF')
  return currentPriceInCHF <= tradingLimit.daily
}
