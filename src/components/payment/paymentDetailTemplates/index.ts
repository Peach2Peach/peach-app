import { ReactElement } from 'react'
import { CashTradesDetailsProps } from './CashTradeDetails'
import { PaymentTemplateProps } from './GeneralPaymentDetails'
import { giftCardTemplates } from './giftCardTemplates'
import { nationalTransferTemplates } from './nationalTransferTemplates'
import * as uniquePaymentDataTemplates from './uniquePaymentDataTemplates'

export type PaymentDetailTemplates = Record<
  PaymentMethod,
  ((props: PaymentTemplateProps) => ReactElement) | ((props: CashTradesDetailsProps) => ReactElement)
>

export const paymentDetailTemplates: PaymentDetailTemplates = {
  ...uniquePaymentDataTemplates,
  ...giftCardTemplates,
  ...nationalTransferTemplates,
}
