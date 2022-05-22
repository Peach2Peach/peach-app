import { LOCALPAYMENTMETHODS, PAYMENTCATEGORIES, PAYMENTMETHODINFOS } from '../constants'
import { intersect, unique } from './array'

/**
 * @description Method to return all selected payment methods
 * @param meansOfPayment payment methods mapped to currency
 * @returns array of payment methods configured
 */
export const getPaymentMethods = (meansOfPayment: MeansOfPayment): PaymentMethod[] =>
  Object.keys(meansOfPayment)
    .reduce((arr, c: Currency) => arr.concat(meansOfPayment[c]), [] as PaymentMethod[])
    .filter(unique())

/**
 * @description Method to check whether MoP supports given currency
 * @param paymentMethod id of MoP
 * @param currencies currencies
 * @returns true if payment method supports  selected currency
 */
export const paymentMethodAllowedForCurrency = (paymentMethod: PaymentMethod, currency: Currency) => {
  const paymentMethodInfo = PAYMENTMETHODINFOS.find(info => info.id === paymentMethod)
  return paymentMethodInfo?.currencies.some(c => currency === c)
}

/**
 * @description Method to check whether MoP supports at least one of the given currencies
 * @param paymentMethod id of MoP
 * @param currencies currencies
 * @returns true if payment method supports at least one of the selected currencies
 */
export const paymentMethodAllowedForCurrencies = (paymentMethod: PaymentMethod, currencies: Currency[]) => {
  const paymentMethodInfo = PAYMENTMETHODINFOS.find(info => info.id === paymentMethod)
  return paymentMethodInfo?.currencies.some(c => currencies.indexOf(c) !== -1)
}

/**
 * @description Method to check whether another MoP of the same type has not been selected
 * @param paymentData MoP in question
 * @param allPaymentData all MoPs of account
 * @returns true if no other MoP of the same type has been selected
 */
export const paymentMethodNotYetSelected = (paymentData: PaymentData, allPaymentData: PaymentData[]) => {
  const sameTypeMoPs = allPaymentData.filter(p => p.type === paymentData.type && p.id !== paymentData.id)
  return !sameTypeMoPs.some(p => p.selected)
}

/**
 * @description Method to check whether a payment method is a local payment method (e.g Bizum in Spain only)
 * @param paymentMethod payment method
 * @returns true if payment method is local
 */
export const isLocalPaymentMethod = (paymentMethod: PaymentMethod) => LOCALPAYMENTMETHODS
  .map(tuple => tuple[0])
  .indexOf(paymentMethod) !== -1

/**
 * @description Method to check whether a payment method is a local payment method (e.g Bizum in Spain only)
 * @param paymentCategory payment category
 * @param currency currency
 * @returns true if payment category has local payment methods
 */
export const hasLocalPaymentMethods = (paymentCategory: PaymentCategory, currency: Currency): boolean =>
  intersect(LOCALPAYMENTMETHODS.map(tuple => tuple[0]), PAYMENTCATEGORIES[paymentCategory])
    .filter(paymentMethod => paymentMethodAllowedForCurrency(paymentMethod, currency)).length > 0


/**
 * @description Method to get country of local payment method
 * @param paymentMethod payment method
 * @returns country of local payment method or empty string if it's not local
 */
export const getLocalMoPCountry = (paymentMethod: PaymentMethod): string => {
  const localMoP = LOCALPAYMENTMETHODS.find(tuple => tuple[0] === paymentMethod)
  return localMoP ? localMoP[1] : ''
}

/**
 * @description Method to check whether a payment method category has applicable MoPs for given currency
 * @param paymentCategory payment category
 * @param currency currency
 * @returns true if payment category has payment method for given currency
 */
export const hasApplicablePaymentMethods = (paymentCategory: PaymentCategory, currency: Currency): boolean =>
  PAYMENTCATEGORIES[paymentCategory].filter(paymentMethod =>
    paymentMethodAllowedForCurrency(paymentMethod, currency)
  ).length > 0

/**
 * @description Method to get paument categories which are applicable for given currency
 * @param currency currency
 * @returns applicable payment categories
 */
export const getApplicablePaymentCategories = (currency: Currency): PaymentCategory[] =>
  (Object.keys(PAYMENTCATEGORIES) as PaymentCategory[])
    .filter(category => hasApplicablePaymentMethods(category, currency))

/**
 * @description Method to check whether a payment method is selected
 * @param paymentMethod payment method
 * @param [selectedPaymentMethods] selected payment methods
 */
export const paymentMethodSelected = (paymentMethod: PaymentMethod, selectedPaymentMethods: PaymentMethod[] = []) =>
  selectedPaymentMethods.indexOf(paymentMethod) !== -1