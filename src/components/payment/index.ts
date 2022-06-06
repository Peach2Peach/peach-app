import { ReactElement } from 'react'
import GeneralPaymentDetails from './detail/generalPaymentDetails'
import DetailSEPA from './detail/sepa'
import DetailPaypal from './detail/paypal'
import DetailRevolut from './detail/revolut'
import DetailApplePay from './detail/applePay'
import DetailBankTransferCH from './detail/bankTransferCH'
import DetailSWIFT from './detail/swift'

export type PaymentTemplateProps = { paymentData: PaymentData }

export type PaymentDetailTemplates = {
  [key in PaymentMethod]?: (props: PaymentTemplateProps) => ReactElement
}

export const paymentDetailTemplates: PaymentDetailTemplates = {
  sepa: DetailSEPA,
  swift: DetailSWIFT,
  bankTransferCH: DetailBankTransferCH,
  bankTransferUK: GeneralPaymentDetails,
  paypal: GeneralPaymentDetails,
  revolut: DetailRevolut,
  applePay: GeneralPaymentDetails,
  wise: GeneralPaymentDetails,
  twint: GeneralPaymentDetails,
  swish: GeneralPaymentDetails,
  mbWay: GeneralPaymentDetails,
  bizum: GeneralPaymentDetails,
  tether: GeneralPaymentDetails,
}