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
  wise: ['beneficiary', 'phone', 'userName', 'email', 'iban', 'bic', 'address'],
  twint: ['beneficiary', 'phone', 'userName', 'email', 'iban', 'bic', 'address'],
  swish: ['beneficiary', 'phone', 'userName', 'email', 'iban', 'bic', 'address'],
  satispay: ['beneficiary', 'phone', 'userName', 'email', 'iban', 'bic', 'address'],
  mbWay: ['beneficiary', 'phone', 'userName', 'email', 'iban', 'bic', 'address'],
  bizum: ['beneficiary', 'phone', 'userName', 'email', 'iban', 'bic', 'address'],
  mobilePay: ['beneficiary', 'phone'],
  vipps: ['beneficiary', 'phone'],
  'giftCard.amazon': ['beneficiary', 'phone', 'userName', 'email', 'iban', 'bic', 'address'],
}
GIFTCARDCOUNTRIES.forEach(
  (c) => (paymentDetailTemplates[('giftCard.amazon.' + c) as PaymentMethod] = GeneralPaymentDetails),
)
NATIONALTRANSFERCOUNTRIES.forEach(
  (c) => (paymentDetailTemplates[('nationalTransfer' + c) as PaymentMethod] = GeneralPaymentDetails),
)
