import { RefreshControl, View } from 'react-native'
import { PeachScrollView, Screen } from '../../components'
import { NewButton as Button } from '../../components/buttons/Button'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { BitcoinLoading } from '../loading/BitcoinLoading'
import { TotalBalance } from './components/TotalBalance'
import { WalletHeader } from './components/WalletHeader'
import { useLastUnusedAddress } from './hooks/useLastUnusedAddress'
import { useWalletAddress } from './hooks/useWalletAddress'
import { useWalletSetup } from './hooks/useWalletSetup'

export const Wallet = () => {
  const { balance, isRefreshing, walletLoading, refresh } = useWalletSetup()

  if (walletLoading) return <BitcoinLoading text={i18n('wallet.loading')} />

  return (
    <Screen>
      <WalletHeader />
      <PeachScrollView
        contentContainerStyle={tw`flex-grow`}
        contentStyle={tw`justify-center flex-grow`}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
      >
        <TotalBalance amount={balance} />
      </PeachScrollView>
      <WalletButtons />
    </Screen>
  )
}

const useAddressPrefetch = () => {
  const { data } = useLastUnusedAddress()
  const displayIndex = data?.index ?? 0
  useWalletAddress(displayIndex)
  useWalletAddress(displayIndex + 1)
  useWalletAddress(displayIndex - 1)
}
function WalletButtons () {
  const navigation = useNavigation()
  useAddressPrefetch()

  const goToSend = () => {
    navigation.navigate('sendBitcoin')
  }
  const goToReceive = () => {
    navigation.navigate('receiveBitcoin')
  }
  return (
    <View style={[tw`flex-row items-center justify-center gap-2`, tw.md`gap-4`]}>
      <Button style={tw`flex-1`} onPress={goToSend}>
        {i18n('wallet.send')}
      </Button>
      <Button style={tw`flex-1 bg-success-main`} onPress={goToReceive}>
        {i18n('wallet.receive')}
      </Button>
    </View>
  )
}
