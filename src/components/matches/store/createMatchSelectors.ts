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
  }
}

export const createMatchSelectors = (matches: Match[], offerMeansOfPayment: MeansOfPayment) =>
  matches.reduce((acc: MatchSelectors, match) => {
    const mopsInCommon = hasMoPsInCommon(offerMeansOfPayment, match.meansOfPayment)
      ? getMoPsInCommon(offerMeansOfPayment, match.meansOfPayment)
      : match.meansOfPayment

    acc[match.offerId] = {
      selectedCurrency: undefined,
      selectedPaymentMethod: undefined,
      availableCurrencies: getAvailableCurrencies(mopsInCommon, match.meansOfPayment),
      availablePaymentMethods: getPaymentMethods(mopsInCommon),
      mopsInCommon,
      meansOfPayment: match.meansOfPayment,
    }
    return acc
  }, {})
