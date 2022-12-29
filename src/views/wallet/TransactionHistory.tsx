import React, { ReactElement, useMemo } from 'react'
import { View } from 'react-native'
import { Icon, Text } from '../../components'
import { SummaryItem } from '../../components/lists/SummaryItem'
import { useHeaderSetup } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { TransactionType, useTransactionHistorySetup } from './hooks/useTransactionHistorySetup'

const iconMap: Record<TransactionType, ReactElement> = {
  TRADE: <Icon id="download" color={tw`text-success-main`.color} />,
  WITHDRAWAL: <Icon id="upload" color={tw`text-primary-main`.color} />,
  DEPOSIT: <Icon id="download" color={tw`text-black-3`.color} />,
}

const levelMap: Record<TransactionType, Level> = {
  TRADE: 'SUCCESS',
  WITHDRAWAL: 'APP',
  DEPOSIT: 'DEFAULT',
}

export default () => {
  useHeaderSetup(useMemo(() => ({ title: i18n('wallet.transactionHistory') }), []))
  const { navigation, transactions } = useTransactionHistorySetup()

  return (
    <View style={tw`px-8 pt-12`}>
      {transactions.map((tx, i) => (
        <SummaryItem
          key={tx.id}
          style={i > 0 ? tw`mt-4` : {}}
          {...{
            title: tx.offerId
              ? i18n('wallet.trade', tx.offerId)
              : tx.type === 'WITHDRAWAL'
                ? i18n('wallet.withdrawal')
                : i18n('wallet.deposit'),
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
      ))}
    </View>
  )
}
