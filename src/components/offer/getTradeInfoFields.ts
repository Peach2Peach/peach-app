import { PaymentMethodForms } from '../inputs/paymentMethods/paymentForms'
import { pastBuyOfferFields, pastSellOfferFields, activeSellOfferFields } from './tradeInformationGetters'

export const getTradeInfoFields = (contract: Contract, view: 'buyer' | 'seller') => {
  if (contract.tradeStatus === 'tradeCompleted') {
    return view === 'buyer' ? pastBuyOfferFields : pastSellOfferFields
  }
  return view === 'buyer' ? PaymentMethodForms[contract.paymentMethod]?.fields || [] : activeSellOfferFields
}
