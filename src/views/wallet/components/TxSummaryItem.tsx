import React from 'react'
import { SummaryItem } from '../../../components/lists/SummaryItem'
import { useNavigation } from '../../../hooks'
import { getTxSummaryTitle } from '../helpers/getTxSummaryTitle'
import { iconMap } from './iconMap'
import { levelMap } from './levelMap'

type TxSummaryItemProps = ComponentProps & {
  tx: TransactionSummary
}

export const TxSummaryItem = ({ tx, style }: TxSummaryItemProps) => {
  const navigation = useNavigation()

  return (
    <SummaryItem
      {...{
        style,
        title: getTxSummaryTitle(tx),
        icon: iconMap[tx.type],
        amount: tx.amount,
        currency: tx.currency,
        price: tx.price,
        date: tx.date,
        action: {
          callback: () => {
            navigation.navigate('transactionDetails', { txId: tx.id })
          },
        },
        level: levelMap[tx.type],
      }}
    />
  )
}
