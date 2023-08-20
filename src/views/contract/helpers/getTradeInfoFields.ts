import { PaymentMethodForms } from '../../../components/inputs/paymentMethods/paymentForms'
import { isCashTrade } from '../../../utils/paymentMethod/isCashTrade'
import {
  pastBuyOfferFields,
  pastSellOfferFields,
  activeSellOfferFields,
  pastBuyOfferCashFields,
  pastSellOfferCashFields,
  activeCashTradeFields,
} from './tradeInformationGetters'

export const getTradeInfoFields = (contract: Contract, view: 'buyer' | 'seller') => {
  if (isCashTrade(contract.paymentMethod)) {
    if (contract.releaseTxId) {
      return view === 'buyer' ? pastBuyOfferCashFields : pastSellOfferCashFields
    }
    return activeCashTradeFields
  }
  if (contract.releaseTxId) {
    return view === 'buyer' ? pastBuyOfferFields : pastSellOfferFields
  }
  return view === 'buyer' ? PaymentMethodForms[contract.paymentMethod]?.fields || [] : activeSellOfferFields
}
