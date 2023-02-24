import { ReactElement } from 'react'
import { COUNTRIES } from '../../constants'
import Cash from './detail/cash'
import GeneralPaymentDetails from './detail/generalPaymentDetails'
import DetailPaypal from './detail/paypal'
import DetailRevolut from './detail/revolut'
import { DetailSEPA } from './detail/sepa'

export type PaymentTemplateProps = ComponentProps & {
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
  sepa: DetailSEPA,
  paypal: DetailPaypal,
  revolut: DetailRevolut,
  wise: GeneralPaymentDetails,
  twint: GeneralPaymentDetails,
  swish: GeneralPaymentDetails,
  satispay: GeneralPaymentDetails,
  mbWay: GeneralPaymentDetails,
  bizum: GeneralPaymentDetails,
  mobilePay: GeneralPaymentDetails,
  'giftCard.amazon': GeneralPaymentDetails,
  cash: Cash,
}

COUNTRIES.forEach((c) => (paymentDetailTemplates[('giftCard.amazon.' + c) as PaymentMethod] = GeneralPaymentDetails))
