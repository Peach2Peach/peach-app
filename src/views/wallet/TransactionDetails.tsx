import { NETWORK } from '@env'
import React from 'react'
import { View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Card, HorizontalLine, Icon, Loading, Text } from '../../components'
import { ShortBitcoinAddress } from '../../components/bitcoin'
import { MediumSatsFormat } from '../../components/text'
import tw from '../../styles/tailwind'
import { showTransaction } from '../../utils/bitcoin'
import i18n from '../../utils/i18n'
import { toDateFormat } from '../../utils/string'
import { iconMap } from './components/iconMap'
import { getTxDetailsTitle } from './helpers/getTxDetailsTitle'
import { useTransactionDetailsSetup } from './hooks/useTransactionDetailsSetup'

export default () => {
  const { transaction, receivingAddress } = useTransactionDetailsSetup()

  const openInExplorer = () => {
    if (transaction) showTransaction(transaction.id as string, NETWORK)
  }

  return (
    <View style={tw`h-full flex justify-center px-8`}>
      {!transaction ? (
        <Loading style={tw`self-center`} />
      ) : (
        <Card style={tw`w-full p-7`}>
          <Text style={tw`text-center text-black-2`}>{i18n('wallet.transaction.type')}</Text>
          <View style={tw`flex flex-row justify-center`}>
            {iconMap[transaction.type]}
            <Text style={tw`subtitle-1 text-center ml-2`}>{getTxDetailsTitle(transaction)}</Text>
          </View>
          <HorizontalLine style={tw`my-4 bg-black-5`} />
          <Text style={tw`text-center text-black-2`}>{i18n('date')}</Text>
          <Text style={tw`subtitle-1 text-center`}>
            {transaction.confirmed ? toDateFormat(transaction.date) : i18n('wallet.transaction.pending')}
          </Text>
          <HorizontalLine style={tw`my-4 bg-black-5`} />
          <Text style={tw`text-center text-black-2`}>{i18n('to')}</Text>
          <ShortBitcoinAddress
            style={tw`subtitle-1 text-center`}
            {...{ address: receivingAddress || '' }}
          ></ShortBitcoinAddress>
          <HorizontalLine style={tw`my-4 bg-black-5`} />
          <Text style={tw`text-center text-black-2`}>{i18n('amount')}</Text>
          <View style={tw`flex flex-row justify-center`}>
            <MediumSatsFormat {...{ sats: transaction.amount }} />
          </View>
          <HorizontalLine style={tw`my-4 bg-black-5`} />
          <TouchableOpacity style={tw`flex-row justify-center items-center`} onPress={openInExplorer}>
            <Text style={tw`text-black-2 underline`}>{i18n('transaction.viewInExplorer')}</Text>
            <Icon id="externalLink" style={tw`w-3 h-3 ml-1`} color={tw`text-primary-main`.color} />
          </TouchableOpacity>
        </Card>
      )}
    </View>
  )
}
