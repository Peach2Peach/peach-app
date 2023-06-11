import { account } from '../../../utils/account'
import { OfferPreferences } from '../useOfferPreferences'

export const getPreferredMethods = (ids: string[]): OfferPreferences['preferredPaymentMethods'] =>
  ids.reduce((obj, id) => {
    const method = account.paymentData.find((data) => data.id === id)?.type
    if (method) return { ...obj, [method]: id }
    return obj
  }, {})
