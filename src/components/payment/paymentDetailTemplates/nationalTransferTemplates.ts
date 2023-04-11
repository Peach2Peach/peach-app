import { ReactElement } from 'react'
import { NATIONALTRANSFERCOUNTRIES } from '../../../constants'
import { GeneralPaymentDetails, PaymentTemplateProps } from './GeneralPaymentDetails'

export const nationalTransferTemplates = NATIONALTRANSFERCOUNTRIES.reduce((obj, c) => {
  const id: PaymentMethod = `nationalTransfer${c}`
  obj[id] = GeneralPaymentDetails
  return obj
}, {} as Record<NationalTransfer, (props: PaymentTemplateProps) => ReactElement>)
