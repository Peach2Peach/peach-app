import { ReactElement } from 'react'
import DetailSEPA from './detail/sepa'
import DetailPaypal from './detail/paypal'
// import DetailGiftCard from './detail/giftCard'
import DetailRevolut from './detail/revolut'
import DetailApplePay from './detail/applePay'

export type PaymentTemplateProps = { paymentData: PaymentData }

export type PaymentDetailTemplates = {
  [key in PaymentMethod]?: (props: PaymentTemplateProps) => ReactElement
}

export const paymentDetailTemplates: PaymentDetailTemplates = {
  sepa: DetailSEPA,
  bankTransferCH: DetailSEPA,
  bankTransferUK: DetailSEPA,
  paypal: DetailPaypal,
  revolut: DetailRevolut,
  applePay: DetailApplePay,
  wise: DetailSEPA,
  twint: DetailSEPA,
  swish: DetailSEPA,
  mbWay: DetailSEPA,
  bizum: DetailSEPA,
  tether: DetailSEPA,
  // giftCard: DetailGiftCard,
}