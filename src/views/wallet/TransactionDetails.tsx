import { RefreshControl } from 'react-native'
import { Card, HorizontalLine, Loading, PeachScrollView } from '../../components'
import { Bubble } from '../../components/bubble'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { TransactionHeader } from './components/transactionDetails/TransactionHeader'
import { TransactionDetailsInfo } from './components/transcactionDetails/TransactionDetailsInfo'
import { useTransactionDetailsSetup } from './hooks/useTransactionDetailsSetup'

export const TransactionDetails = () => {
  const {
    transaction,
    receivingAddress,
    openInExplorer,
    refresh,
    isRefreshing,
    canBumpNetworkFees,
    goToBumpNetworkFees,
  } = useTransactionDetailsSetup()

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
          <TransactionHeader style={tw`self-center`} {...transaction} />
          <HorizontalLine style={tw`my-4`} />
          <TransactionDetailsInfo {...{ transaction, receivingAddress }} />
          <HorizontalLine style={tw`my-4`} />
          <Bubble color="primary" style={tw`self-center`} ghost iconId="externalLink" onPress={openInExplorer}>
            {i18n('transaction.viewInExplorer')}
          </Bubble>
          {canBumpNetworkFees && (
            <Bubble color="primary" onPress={goToBumpNetworkFees} iconId="chevronsUp" style={tw`self-center mt-4`}>
              {i18n('wallet.bumpNetworkFees.button')}
            </Bubble>
          )}
        </Card>
      )}
    </PeachScrollView>
  )
}
