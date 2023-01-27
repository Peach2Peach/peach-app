import { ReactElement } from 'react'
import { COUNTRIES } from '../../constants'
import Cash from './detail/cash'
import GeneralPaymentDetails from './detail/generalPaymentDetails'
import DetailPaypal from './detail/paypal'
import DetailRevolut from './detail/revolut'

export type PaymentTemplateProps = ComponentProps & {
  paymentData: PaymentData
  country?: Country
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
  paypal: DetailPaypal,
  revolut: DetailRevolut,
  wise: GeneralPaymentDetails,
  twint: GeneralPaymentDetails,
  swish: GeneralPaymentDetails,
  satispay: GeneralPaymentDetails,
  mbWay: GeneralPaymentDetails,
  bizum: GeneralPaymentDetails,
  'giftCard.amazon': GeneralPaymentDetails,
  cash: Cash,
}

COUNTRIES.forEach((c) => (paymentDetailTemplates[('giftCard.amazon.' + c) as PaymentMethod] = GeneralPaymentDetails))
