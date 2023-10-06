import { PaymentMethodForms } from '../../../components/inputs/paymentMethods/paymentForms'
import { isCashTrade } from '../../../utils/paymentMethod/isCashTrade'
import { TradeInfoField } from './tradeInformationGetters'

export const getTradeInfoFields = (
  { paymentMethod, releaseTxId }: Pick<Contract, 'paymentMethod' | 'releaseTxId'>,
  view: 'buyer' | 'seller',
): TradeInfoField[][] => {
  if (releaseTxId) {
    if (isCashTrade(paymentMethod)) {
      if (view === 'buyer') {
        return [
          ['youPaid', 'bitcoinPrice'],
          ['meetup'],
          ['seller', 'ratingBuyer'],
          ['tradeBreakdown'],
        ] satisfies TradeInfoField[][]
      }
      return [['soldFor', 'bitcoinPrice'], ['meetup'], ['buyer', 'ratingSeller']]
    }

    return view === 'buyer'
      ? ([
        ['youPaid', 'bitcoinPrice'],
        ['via', 'reference', 'paymentConfirmed'],
        ['seller', 'ratingBuyer'],
        ['tradeBreakdown'],
      ] satisfies TradeInfoField[][])
      : [
        ['soldFor', 'bitcoinPrice'],
        ['paidToMethod', 'reference', 'paymentConfirmed'],
        ['buyer', 'ratingSeller'],
      ]
  }
  if (isCashTrade(paymentMethod)) {
    return view === 'buyer'
      ? [['youShouldPay'], ['meetup', 'location'], ['seller', 'tradeId']]
      : [['youWillGet'], ['meetup', 'location'], ['buyer', 'tradeId']]
  }
  const activeBuyFields: TradeInfoField[][] = [
    ['youShouldPay'],
    PaymentMethodForms[paymentMethod]?.fields || [],
    ['seller', 'tradeId'],
  ]
  const activeSellOfferFields: TradeInfoField[][] = [['youWillGet'], ['paidToMethod', 'reference'], ['buyer', 'tradeId']]

  return view === 'buyer' ? activeBuyFields : activeSellOfferFields
}
