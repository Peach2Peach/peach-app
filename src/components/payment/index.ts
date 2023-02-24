import { DetailInstantSepa } from './detail/instantSepa'
import { ReactElement } from 'react'
import { COUNTRIES } from '../../constants'
import GeneralPaymentDetails from './detail/generalPaymentDetails'
import DetailPaypal from './detail/paypal'
import DetailRevolut from './detail/revolut'
import { DetailSEPA } from './detail/sepa'
import DetailBlik from './detail/blik'

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
  instantSepa: DetailInstantSepa,
  paypal: DetailPaypal,
  revolut: DetailRevolut,
  blik: DetailBlik,
  wise: GeneralPaymentDetails,
  twint: GeneralPaymentDetails,
  swish: GeneralPaymentDetails,
  satispay: GeneralPaymentDetails,
  mbWay: GeneralPaymentDetails,
  bizum: GeneralPaymentDetails,
  'giftCard.amazon': GeneralPaymentDetails,
}

COUNTRIES.forEach((c) => (paymentDetailTemplates[('giftCard.amazon.' + c) as PaymentMethod] = GeneralPaymentDetails))
