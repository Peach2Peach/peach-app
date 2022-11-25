import { matchOffer } from '../../../utils/peachAPI'
import { generateMatchOfferData } from './generateMatchOfferData'

export const matchFn = async (
  match: Match,
  offer: BuyOffer | SellOffer,
  selectedCurrency?: Currency,
  selectedPaymentMethod?: PaymentMethod,
  // eslint-disable-next-line max-params
) => {
  if (!offer?.id) {
    throw new Error('No offer id')
  }
  if (!selectedCurrency || !selectedPaymentMethod) {
    throw new Error('Missing values')
  }

  const matchOfferData = await generateMatchOfferData(offer, match, selectedCurrency, selectedPaymentMethod)
  if (!matchOfferData) throw new Error('Missing paymentdata')

  const [result, err] = await matchOffer(matchOfferData)

  if (result) {
    return result
  }
  throw new Error(err?.error)
}
