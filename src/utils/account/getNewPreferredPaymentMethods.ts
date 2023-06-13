import { OfferPreferences } from '../../store/offerPreferenes/useOfferPreferences'

export const getNewPreferredPaymentMethods = (
  preferredPaymentMethods: OfferPreferences['preferredPaymentMethods'],
  updateDatedPaymentData: PaymentData[],
) =>
  (Object.keys(preferredPaymentMethods) as PaymentMethod[]).reduce((obj, method) => {
    const id = preferredPaymentMethods[method]
    const data = updateDatedPaymentData.find((d) => d.id === id)
    let newObj = { ...obj }
    if (data && !data.hidden) newObj = { ...newObj, [method]: id }
    return newObj
  }, {} satisfies OfferPreferences['preferredPaymentMethods'])
