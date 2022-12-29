import React, { useMemo } from 'react'
import { View } from 'react-native'
import { Text } from '../../components'
import { SummaryItem } from '../../components/lists/SummaryItem'
import { useHeaderSetup } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { useTransactionHistorySetup } from './hooks/useTransactionHistorySetup'

export default () => {
  useHeaderSetup(useMemo(() => ({ title: i18n('wallet.transactionHistory') }), []))
  const { navigation, walletStore } = useTransactionHistorySetup()

  return (
    <View style={tw`px-8 pt-12`}>
      {walletStore.transactions.confirmed.map(({ txid, sent, received }, i) => (
        <SummaryItem
          key={txid}
          style={i > 0 ? tw`mt-4` : {}}
          {...{
            title: 'todo',
            icon: undefined,
            amount: sent || received,
            currency: 'EUR',
            price: 1,
            date: new Date(),
            action: {
              callback: () => {
                navigation.navigate('transactionDetails', { txId: txid })
              },
            },
            level: 'APP',
          }}
        />
      ))}
      {walletStore.transactions.pending.map(({ txid, sent, received }) => (
        <Text>
          confirmed tx {txid}
          {'\n'}
          sent: {sent}
          {'\n'}
          received: {received}
        </Text>
      ))}
    </View>
  )
}
