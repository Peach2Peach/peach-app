import { ReactElement } from 'react'
import DetailIBAN from './detail/iban'
import DetailPaypal from './detail/paypal'
import DetailGiftCard from './detail/giftCard'
import DetailRevolut from './detail/revolut'
import DetailApplePay from './detail/applePay'

export type PaymentTemplateProps = { paymentData: PaymentData }

export type PaymentDetailTemplates = {
  [key in PaymentMethod]?: (props: PaymentTemplateProps) => ReactElement
}

export const paymentDetailTemplates: PaymentDetailTemplates = {
  'iban': DetailIBAN,
  'paypal': DetailPaypal,
  // 'giftCard': DetailGiftCard,
  // 'revolut': DetailRevolut,
  // 'applePay': DetailApplePay,
}