import { ReactElement } from 'react'
import { Icon } from '../../../components'
import tw from '../../../styles/tailwind'

export const iconMap: Record<TransactionType, ReactElement> = {
  TRADE: <Icon id="download" color={tw.color('success-main')} />,
  WITHDRAWAL: <Icon id="upload" color={tw.color('primary-main')} />,
  DEPOSIT: <Icon id="download" color={tw.color('success-main')} />,
  REFUND: <Icon id="download" color={tw.color('black-3')} />,
}
