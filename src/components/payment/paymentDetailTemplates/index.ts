import { ReactElement } from 'react'
import { PaymentTemplateProps } from './GeneralPaymentDetails'
import { giftCardTemplates } from './giftCardTemplates'
import { nationalTransferTemplates } from './nationalTransferTemplates'
import * as uniquePaymentDataTemplates from './uniquePaymentDataTemplates'

export type PaymentDetailTemplates = Record<PaymentMethod, (props: PaymentTemplateProps) => ReactElement>

export const paymentDetailTemplates: PaymentDetailTemplates = {
  ...uniquePaymentDataTemplates,
  ...giftCardTemplates,
  ...nationalTransferTemplates,
}
