import { getAvailableCurrencies } from '../../../utils/match/getAvailableCurrencies'
import { getAvailableMethods } from '../../../utils/match/getAvailableMethods'
import { getMoPsInCommon } from '../../../utils/paymentMethod/getMoPsInCommon'
import { hasMoPsInCommon } from '../../../utils/paymentMethod/hasMoPsInCommon'

export type MatchSelectors = {
  [id: Match['offerId']]: {
    selectedCurrency: Currency
    selectedPaymentMethod?: PaymentMethod
    availableCurrencies: Currency[]
    availablePaymentMethods: PaymentMethod[]
    mopsInCommon: MeansOfPayment
    meansOfPayment: MeansOfPayment
    showPaymentMethodPulse: boolean
  }
}

export const createMatchSelectors = (matches: Match[], offerMeansOfPayment: MeansOfPayment) =>
  matches.reduce((acc: MatchSelectors, match) => {
    const mopsInCommon = hasMoPsInCommon(offerMeansOfPayment, match.meansOfPayment)
      ? getMoPsInCommon(offerMeansOfPayment, match.meansOfPayment)
      : match.meansOfPayment

    const availableCurrencies = getAvailableCurrencies(mopsInCommon, match.meansOfPayment)
    const availablePaymentMethods = getAvailableMethods(match.meansOfPayment, availableCurrencies[0], mopsInCommon)

    acc[match.offerId] = {
      selectedCurrency: availableCurrencies[0],
      selectedPaymentMethod: availablePaymentMethods.length === 1 ? availablePaymentMethods[0] : undefined,
      availableCurrencies,
      availablePaymentMethods,
      mopsInCommon,
      meansOfPayment: match.meansOfPayment,
      showPaymentMethodPulse: false,
    }
    return acc
  }, {})
