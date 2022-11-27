import { error } from '../../../utils/log'
import { matchOffer } from '../../../utils/peachAPI'
import { generateMatchOfferData } from './generateMatchOfferData'
import { handleError } from './handleError'

export const matchFn = async (
  match: Match,
  offer: BuyOffer | SellOffer,
  selectedCurrency: Currency | undefined,
  selectedPaymentMethod: PaymentMethod | undefined,
  updateMessage: (value: MessageState) => void,
  // eslint-disable-next-line max-params
) => {
  if (!offer?.id) throw new Error()
  if (!selectedCurrency || !selectedPaymentMethod) throw new Error('Missing values')

  const matchOfferData = await generateMatchOfferData(offer, match, selectedCurrency, selectedPaymentMethod)
  if (!matchOfferData) throw new Error('Missing paymentdata')

  const [result, err] = await matchOffer(matchOfferData)

  if (result) {
    return result
  }
  error('Error', err)
  handleError(err, updateMessage)
  throw new Error()
}
