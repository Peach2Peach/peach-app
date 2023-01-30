import { getAvailableCurrencies } from '../../../utils/match'
import { hasMoPsInCommon, getMoPsInCommon, getPaymentMethods } from '../../../utils/paymentMethod'

export type MatchSelectors = {
  [id: Match['offerId']]: {
    selectedCurrency?: Currency
    selectedPaymentMethod?: PaymentMethod
    availableCurrencies: Currency[]
    availablePaymentMethods: PaymentMethod[]
    mopsInCommon: MeansOfPayment
    meansOfPayment: MeansOfPayment
    showCurrencyPulse: boolean
    showPaymentMethodPulse: boolean
  }
}

export const createMatchSelectors = (matches: Match[], offerMeansOfPayment: MeansOfPayment) =>
  matches.reduce((acc: MatchSelectors, match) => {
    const mopsInCommon = hasMoPsInCommon(offerMeansOfPayment, match.meansOfPayment)
      ? getMoPsInCommon(offerMeansOfPayment, match.meansOfPayment)
      : match.meansOfPayment

    const availableCurrencies = getAvailableCurrencies(mopsInCommon, match.meansOfPayment)
    const availablePaymentMethods = getPaymentMethods(mopsInCommon)

    acc[match.offerId] = {
      selectedCurrency: availableCurrencies.length === 1 ? availableCurrencies[0] : undefined,
      selectedPaymentMethod: availablePaymentMethods.length === 1 ? availablePaymentMethods[0] : undefined,
      availableCurrencies,
      availablePaymentMethods,
      mopsInCommon,
      meansOfPayment: match.meansOfPayment,
      showCurrencyPulse: false,
      showPaymentMethodPulse: false,
    }
    return acc
  }, {})
