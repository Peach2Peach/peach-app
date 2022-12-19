import {
  getMatchCurrency,
  getMatchPaymentMethod,
  getAvailableCurrencies,
  getAvailableMethods,
} from '../../../utils/match'
import { hasMoPsInCommon, getMoPsInCommon } from '../../../utils/paymentMethod'

export type MatchSelectors = {
  [id: Match['offerId']]: {
    selectedCurrency: Currency
    selectedPaymentMethod: PaymentMethod
    availableCurrencies: Currency[]
    availablePaymentMethods: PaymentMethod[]
    mopsInCommon: MeansOfPayment
    meansOfPayment: MeansOfPayment
  }
}

export const createMatchSelectors = (matches: Match[], offerMeansOfPayment: MeansOfPayment) =>
  matches.reduce((acc: MatchSelectors, match) => {
    const defaultCurrency = getMatchCurrency(offerMeansOfPayment, match.meansOfPayment)
    const defaultPaymentMethod = getMatchPaymentMethod(offerMeansOfPayment, match.meansOfPayment) || ''
    const mopsInCommon = hasMoPsInCommon(offerMeansOfPayment, match.meansOfPayment)
      ? getMoPsInCommon(offerMeansOfPayment, match.meansOfPayment)
      : match.meansOfPayment
    acc[match.offerId] = {
      selectedCurrency: defaultCurrency,
      selectedPaymentMethod: defaultPaymentMethod,
      availableCurrencies: getAvailableCurrencies(mopsInCommon, match.meansOfPayment),
      availablePaymentMethods: getAvailableMethods(match.meansOfPayment, defaultCurrency, mopsInCommon),
      mopsInCommon,
      meansOfPayment: match.meansOfPayment,
    }
    return acc
  }, {})
