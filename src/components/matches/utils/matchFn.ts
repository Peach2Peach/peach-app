import { matchOffer } from '../../../utils/peachAPI'
import { generateMatchOfferData } from './generateMatchOfferData'
import { handleError } from './handleError'

const hasId = (offer: BuyOffer | SellOffer): offer is (BuyOffer | SellOffer) & { id: string } => offer.id !== undefined

export const matchFn = async (
  match: Match,
  offer: BuyOffer | SellOffer,
  selectedCurrency: Currency | undefined,
  selectedPaymentMethod: PaymentMethod | undefined,
  updateMessage: (value: MessageState) => void,
  // eslint-disable-next-line max-params
) => {
  if (!hasId(offer)) throw new Error()
  if (!selectedCurrency || !selectedPaymentMethod) throw new Error('Missing values')

  const matchOfferData = await generateMatchOfferData(offer, match, selectedCurrency, selectedPaymentMethod)
  if (typeof matchOfferData === 'string') throw new Error(matchOfferData)

  const [result, err] = await matchOffer(matchOfferData)

  if (result) {
    return result
  }
  handleError(err, updateMessage)
  throw new Error()
}
