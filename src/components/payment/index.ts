import { NATIONALTRANSFERCOUNTRIES } from './../../constants'
import { ReactElement } from 'react'
import { GIFTCARDCOUNTRIES } from '../../constants'
import GeneralPaymentDetails from './detail/generalPaymentDetails'

export type PaymentTemplateProps = ComponentProps & {
  paymentMethod: PaymentMethod
  paymentData: PaymentData
  country?: PaymentMethodCountry
  appLink?: string
  fallbackUrl?: string
  userLink?: string
  copyable?: boolean
}

export type PaymentDetailTemplates = {
  [key in PaymentMethod]?: (props: PaymentTemplateProps) => ReactElement
}

export const paymentDetailTemplates: PaymentDetailTemplates = {
  sepa: GeneralPaymentDetails,
  fasterPayments: GeneralPaymentDetails,
  instantSepa: GeneralPaymentDetails,
  paypal: GeneralPaymentDetails,
  revolut: GeneralPaymentDetails,
  advcash: GeneralPaymentDetails,
  blik: GeneralPaymentDetails,
  wise: GeneralPaymentDetails,
  twint: GeneralPaymentDetails,
  swish: GeneralPaymentDetails,
  satispay: GeneralPaymentDetails,
  mbWay: GeneralPaymentDetails,
  bizum: GeneralPaymentDetails,
  mobilePay: GeneralPaymentDetails,
  vipps: GeneralPaymentDetails,
  keksPay: GeneralPaymentDetails,
  n26: GeneralPaymentDetails,
  skrill: GeneralPaymentDetails,
  neteller: GeneralPaymentDetails,
  paysera: GeneralPaymentDetails,
  straksbetaling: GeneralPaymentDetails,
  friends24: GeneralPaymentDetails,
  paylib: GeneralPaymentDetails,
  'giftCard.amazon': GeneralPaymentDetails,
}
export const possiblePaymentFields: Partial<Record<PaymentMethod, string[]>> = {
  sepa: ['beneficiary', 'iban', 'bic'],
  fasterPayments: ['beneficiary', 'ukBankAccount', 'ukSortCode'],
  instantSepa: ['beneficiary', 'iban', 'bic'],
  paypal: ['phone', 'userName', 'email'],
  revolut: ['phone', 'userName', 'email'],
  advcash: ['wallet', 'email'],
  blik: ['beneficiary', 'phone'],
  wise: ['beneficiary', 'phone', 'email'],
  twint: ['beneficiary', 'phone', 'userName', 'email', 'iban', 'bic', 'address'],
  swish: ['beneficiary', 'phone', 'userName', 'email', 'iban', 'bic', 'address'],
  satispay: ['beneficiary', 'phone', 'userName', 'email', 'iban', 'bic', 'address'],
  mbWay: ['beneficiary', 'phone', 'userName', 'email', 'iban', 'bic', 'address'],
  bizum: ['beneficiary', 'phone', 'userName', 'email', 'iban', 'bic', 'address'],
  mobilePay: ['beneficiary', 'phone'],
  keksPay: ['beneficiary', 'phone'],
  vipps: ['beneficiary', 'phone'],
  skrill: ['beneficiary', 'email'],
  neteller: ['beneficiary', 'email'],
  paysera: ['beneficiary', 'phone'],
  straksbetaling: ['beneficiary', 'accountNumber'],
  friends24: ['beneficiary', 'phone'],
  n26: ['beneficiary', 'phone'],
  paylib: ['beneficiary', 'phone'],
}
GIFTCARDCOUNTRIES.forEach((c) => {
  const id: PaymentMethod = `giftCard.amazon.${c}`
  paymentDetailTemplates[id] = GeneralPaymentDetails
  possiblePaymentFields[id] = ['beneficiary', 'email']
})
NATIONALTRANSFERCOUNTRIES.forEach((c) => {
  const id: PaymentMethod = `nationalTransfer${c}`
  paymentDetailTemplates[id] = GeneralPaymentDetails
  possiblePaymentFields[id] = ['beneficiary', 'iban', 'accountNumber', 'bic', 'address']
})
