import { PaymentMethodForms } from '../../../components/inputs/paymentMethods/paymentForms'
import { isCashTrade } from '../../../utils/paymentMethod/isCashTrade'
import {
  activeCashTradeFields,
  activeSellOfferFields,
  pastBuyOfferCashFields,
  pastBuyOfferFields,
  pastSellOfferCashFields,
  pastSellOfferFields,
} from './tradeInformationGetters'

export const getTradeInfoFields = (
  { paymentMethod, releaseTxId }: Pick<Contract, 'paymentMethod' | 'releaseTxId'>,
  view: 'buyer' | 'seller',
) => {
  if (isCashTrade(paymentMethod)) {
    if (releaseTxId) {
      return view === 'buyer' ? pastBuyOfferCashFields : pastSellOfferCashFields
    }
    return activeCashTradeFields
  }
  if (releaseTxId) {
    return view === 'buyer' ? pastBuyOfferFields : pastSellOfferFields
  }
  return view === 'buyer' ? PaymentMethodForms[paymentMethod]?.fields || [] : activeSellOfferFields
}
