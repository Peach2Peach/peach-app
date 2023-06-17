import { RefreshControl, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Card, HorizontalLine, Icon, Loading, PeachScrollView, PrimaryButton, Text } from '../../components'
import { ShortBitcoinAddress } from '../../components/bitcoin'
import { MediumSatsFormat } from '../../components/text'
import tw from '../../styles/tailwind'
import { toDateFormat } from '../../utils/date'
import i18n from '../../utils/i18n'
import { iconMap } from './components/iconMap'
import { getTxDetailsTitle } from './helpers/getTxDetailsTitle'
import { useTransactionDetailsSetup } from './hooks/useTransactionDetailsSetup'

export default () => {
  const { transaction, receivingAddress, openInExplorer, refresh, isRefreshing, goToBumpNetworkFees }
    = useTransactionDetailsSetup()

  return (
    <PeachScrollView
      style={tw`h-full`}
      contentContainerStyle={tw`justify-center flex-grow px-8`}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
    >
      {!transaction ? (
        <Loading style={tw`self-center`} />
      ) : (
        <Card style={tw`w-full p-7`}>
          <Text style={tw`text-center text-black-2`}>{i18n('wallet.transaction.type')}</Text>
          <View style={tw`flex flex-row justify-center`}>
            {iconMap[transaction.type]}
            <Text style={tw`ml-2 text-center subtitle-1`}>{getTxDetailsTitle(transaction)}</Text>
          </View>
          <HorizontalLine style={tw`my-4`} />
          <Text style={tw`text-center text-black-2`}>{i18n('date')}</Text>
          <Text style={tw`text-center subtitle-1`}>
            {transaction.confirmed ? toDateFormat(transaction.date) : i18n('wallet.transaction.pending')}
          </Text>
          <HorizontalLine style={tw`my-4`} />
          <Text style={tw`text-center text-black-2`}>{i18n('to')}</Text>
          <ShortBitcoinAddress
            style={tw`text-center subtitle-1`}
            {...{ address: receivingAddress || '' }}
          ></ShortBitcoinAddress>
          <HorizontalLine style={tw`my-4`} />
          <Text style={tw`text-center text-black-2`}>{i18n('amount')}</Text>
          <View style={tw`flex flex-row justify-center`}>
            <MediumSatsFormat {...{ sats: transaction.amount }} />
          </View>
          <HorizontalLine style={tw`my-4`} />
          <TouchableOpacity style={tw`flex-row items-center justify-center`} onPress={openInExplorer}>
            <Text style={tw`underline text-black-2`}>{i18n('transaction.viewInExplorer')}</Text>
            <Icon id="externalLink" style={tw`w-3 h-3 ml-1`} color={tw`text-primary-main`.color} />
          </TouchableOpacity>
          <PrimaryButton onPress={goToBumpNetworkFees}>{i18n('wallet.bumpNetworkFees.button')}</PrimaryButton>
        </Card>
      )}
    </PeachScrollView>
  )
}
