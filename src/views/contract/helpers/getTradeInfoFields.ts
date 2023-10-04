import { PaymentMethodForms } from '../../../components/inputs/paymentMethods/paymentForms'
import { isCashTrade } from '../../../utils/paymentMethod/isCashTrade'
import {
  activeCashTradeFields,
  activeSellOfferFields,
  pastBuyOfferFields,
  pastCashTradeFields,
  pastSellOfferFields,
} from './tradeInformationGetters'

export const getTradeInfoFields = (
  { paymentMethod, releaseTxId }: Pick<Contract, 'paymentMethod' | 'releaseTxId'>,
  view: 'buyer' | 'seller',
) => {
  if (releaseTxId) {
    if (isCashTrade(paymentMethod)) {
      return pastCashTradeFields
    }
    return view === 'buyer' ? pastBuyOfferFields : pastSellOfferFields
  }
  if (isCashTrade(paymentMethod)) {
    return activeCashTradeFields
  }

  return view === 'buyer' ? PaymentMethodForms[paymentMethod]?.fields || [] : activeSellOfferFields
}
