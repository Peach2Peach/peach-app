import { matchOffer } from '../../../utils/peachAPI'
import { generateMatchOfferData } from './generateMatchOfferData'
import { handleError } from './handleError'

const hasId = (offer: BuyOffer | SellOffer): offer is (BuyOffer | SellOffer) & { id: string } => offer.id !== undefined

export const matchFn = async (
  match: Match,
  offer: BuyOffer | SellOffer,
  currency: Currency | undefined,
  paymentMethod: PaymentMethod | undefined,
  updateMessage: (value: MessageState) => void,
  // eslint-disable-next-line max-params
) => {
  if (!hasId(offer)) throw new Error()
  if (!currency || !paymentMethod) throw new Error('MISSING_VALUES')

  const { result: matchOfferData, error: dataError } = await generateMatchOfferData({
    offer,
    match,
    currency,
    paymentMethod,
  })
  if (!matchOfferData) throw new Error(dataError || 'UNKNOWN_ERROR')

  const [result, err] = await matchOffer(matchOfferData)

  if (result) {
    return result
  }
  handleError(err, updateMessage)
  throw new Error('OFFER_TAKEN')
}
