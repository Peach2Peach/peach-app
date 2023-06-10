import { account } from '../../../utils/account'
import { OfferPreferences } from '../useOfferPreferences'

export const getPreferredMethods = (ids: string[]) =>
  ids.reduce((obj, id) => {
    const method = account.paymentData.find((data) => data.id === id)?.type
    let newObj = { ...obj }
    if (method) newObj = { ...newObj, [method]: id }
    return newObj
  }, {} satisfies OfferPreferences['preferredPaymentMethods'])
