import { ReactElement } from 'react'
import GeneralPaymentDetails from './detail/generalPaymentDetails'
import DetailSEPA from './detail/sepa'
import DetailRevolut from './detail/revolut'
import DetailBankTransferCH from './detail/bankTransferCH'
import DetailWise from './detail/wise'

export type PaymentTemplateProps = {
  paymentData: PaymentData,
  appLink?: string,
  fallbackUrl?: string,
  userLink?: string,
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
  mbWay: GeneralPaymentDetails,
  bizum: GeneralPaymentDetails,
}