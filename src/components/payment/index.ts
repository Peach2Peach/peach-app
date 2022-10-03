import { ReactElement } from 'react'
import GeneralPaymentDetails from './detail/generalPaymentDetails'
import DetailSEPA from './detail/sepa'
import DetailRevolut from './detail/revolut'
import DetailWise from './detail/wise'
import Cash from './detail/cash'
import { COUNTRIES } from '../../constants'

export type PaymentTemplateProps = {
  paymentData: PaymentData
  country?: Country
  appLink?: string
  fallbackUrl?: string
  userLink?: string
}

export type PaymentDetailTemplates = {
  [key in PaymentMethod]?: (props: PaymentTemplateProps) => ReactElement
}

export const paymentDetailTemplates: PaymentDetailTemplates = {
  sepa: DetailSEPA,
  paypal: GeneralPaymentDetails,
  revolut: DetailRevolut,
  wise: DetailWise,
  twint: GeneralPaymentDetails,
  swish: GeneralPaymentDetails,
  satispay: GeneralPaymentDetails,
  mbWay: GeneralPaymentDetails,
  bizum: GeneralPaymentDetails,
  'giftCard.amazon': GeneralPaymentDetails,
  cash: Cash
}

COUNTRIES.forEach((c) => (paymentDetailTemplates[('giftCard.amazon.' + c) as PaymentMethod] = GeneralPaymentDetails))
