import { ReactElement } from 'react'
import { GIFTCARDCOUNTRIES } from '../../../constants'
import { GeneralPaymentDetails, PaymentTemplateProps } from './GeneralPaymentDetails'

export const giftCardTemplates = GIFTCARDCOUNTRIES.reduce((obj, c) => {
  const id: PaymentMethod = `giftCard.amazon.${c}`
  obj[id] = GeneralPaymentDetails
  return obj
}, {} as Record<AmazonGiftCard, (props: PaymentTemplateProps) => ReactElement>)
