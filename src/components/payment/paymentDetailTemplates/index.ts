import { ReactElement } from 'react'
import { CashTradesDetailsProps } from './CashTradeDetails'
import { giftCardTemplates } from './giftCardTemplates'
import { nationalTransferTemplates } from './nationalTransferTemplates'
import * as uniquePaymentDataTemplates from './uniquePaymentDataTemplates'

export type PaymentTemplateProps = ComponentProps & {
  paymentMethod: PaymentMethod
  paymentData: PaymentData
  country?: PaymentMethodCountry
  appLink?: string
  fallbackUrl?: string
  userLink?: string
  copyable?: boolean
}

export type PaymentDetailTemplates = Record<
  PaymentMethod,
  ((props: PaymentTemplateProps) => ReactElement) | ((props: CashTradesDetailsProps) => ReactElement)
>

export const paymentDetailTemplates: PaymentDetailTemplates = {
  ...uniquePaymentDataTemplates,
  ...giftCardTemplates,
  ...nationalTransferTemplates,
}
