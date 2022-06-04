import { LOCALPAYMENTMETHODS, PAYMENTCATEGORIES, PAYMENTMETHODINFOS } from '../constants'
import { intersect, unique } from './array'
import { sha256 } from './crypto'
import { SignAndEncryptResult, signAndEncryptSymmetric } from './pgp'

/**
 * @description Method to return all configured currencies
 * @param meansOfPayment payment methods mapped to currency
 * @returns array of currencies configured
 */
export const getCurrencies = (meansOfPayment: MeansOfPayment): Currency[] =>
  (Object.keys(meansOfPayment) as Currency[])
    .filter(c => meansOfPayment[c]?.length)

/**
 * @description Method to build means of payment object
 * @param mops means of payment
 * @param currency currency
 * @returns means of payment with added currency
 * @example currencies.reduce(toMeansOfPayment, {})
 */
export const toMeansOfPayment = (mops: MeansOfPayment, currency: Currency) => {
  mops[currency] = []
  return mops
}

/**
 * @description Method to build means of payment object
 * @param mops means of payment
 * @param data paymentData
 * @returns means of payment with added payment method
 * @example paymentData.reduce(dataToMeansOfPayment, {})
 */
export const dataToMeansOfPayment = (mop: MeansOfPayment, data: PaymentData) => {
  data.currencies.forEach((currency) => {
    if (!mop[currency]) mop[currency] = []
    if (mop[currency]!.indexOf(data.type) === -1) mop[currency]!.push(data.type)
  })
  return mop
}

/**
 * @description Method to return all selected payment methods
 * @param meansOfPayment payment methods mapped to currency
 * @returns array of payment methods configured
 */
export const getPaymentMethods = (meansOfPayment: MeansOfPayment): PaymentMethod[] =>
  Object.keys(meansOfPayment)
    .reduce((arr, c) => arr.concat((meansOfPayment as Required<MeansOfPayment>)[c as Currency]), [] as PaymentMethod[])
    .filter(unique())


/**
 * @description Method to get payment method info of given method id
 * @param id payment method id
 * @returns payment method info
 */
export const getPaymentMethodInfo = (id: PaymentMethod): PaymentMethodInfo => PAYMENTMETHODINFOS.find(p => p.id === id)

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
 * @description Method to check whether a payment method is a local payment method (e.g Bizum in Spain only)
 * @param paymentMethod payment method
 * @returns true if payment method is local
 * @TODO check if still needed, if yes, fix method
 */
export const isLocalPaymentMethod = (paymentMethod: PaymentMethod) => true

/**
 * @description Method to check whether a payment method is a local payment method (e.g Bizum in Spain only)
 * @param paymentCategory payment category
 * @param currency currency
 * @returns true if payment category has local payment methods
 * @TODO check if still needed, if yes, fix method
 */
export const hasLocalPaymentMethods = (paymentCategory: PaymentCategory, currency: Currency): boolean => true


/**
 * @description Method to get country of local payment method
 * @param paymentMethod payment method
 * @returns country of local payment method or empty string if it's not local
 * @TODO check if still needed, if yes, fix method
 */
export const getLocalMoPCountry = (paymentMethod: PaymentMethod): string => 'ES'

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


/**
 * @description Method to hash a payment data into hex representation using sha256
 * @param paymentData payment data to hash
 * @returns hashed payment data as hex
 */
export const hashPaymentData = (paymentData: PaymentData): string => {
  const data = JSON.parse(JSON.stringify(paymentData))
  delete data.id
  delete data.type

  return sha256(JSON.stringify(data))
}

/**
 * @description Method to encrypt payment data and sign encrypted payment data with passphrase
 * @param paymentData payment data
 * @param passphrase passphrase to encrypt with
 * @returns Promise resolving to encrypted payment data and signature
 */
export const encryptPaymentData = async (
  paymentData: PaymentData,
  symmetricKey: string
): Promise<SignAndEncryptResult> => {
  const data = JSON.parse(JSON.stringify(paymentData))

  delete data.id
  delete data.type

  return await signAndEncryptSymmetric(
    JSON.stringify(data),
    symmetricKey
  )
}
