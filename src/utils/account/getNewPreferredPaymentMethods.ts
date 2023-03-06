export const getNewPreferredPaymentMethods = (
  preferredPaymentMethods: Settings['preferredPaymentMethods'],
  updateDatedPaymentData: PaymentData[],
) =>
  (Object.keys(preferredPaymentMethods) as PaymentMethod[]).reduce((obj, method) => {
    const id = preferredPaymentMethods[method]
    const data = updateDatedPaymentData.find((d) => d.id === id)
    if (data && !data.hidden) obj[method] = id
    return obj
  }, {} as Settings['preferredPaymentMethods'])
