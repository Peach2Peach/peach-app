import { Alert, RefreshControl, View } from 'react-native'
import { PeachScrollView, Screen } from '../../components'
import { NewButton as Button } from '../../components/buttons/Button'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { BitcoinLoading } from '../loading/BitcoinLoading'
import { WalletHeader } from './components/WalletHeader'
import { TotalBalance } from './components/overview/TotalBalance'
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

function WalletButtons () {
  const navigation = useNavigation()
  const onPress = () => {
    Alert.alert('TODO: Navigate to send/receive screen')
  }
  const goToReceive = () => {
    navigation.navigate('receiveBitcoin')
  }
  return (
    <View style={[tw`flex-row items-center justify-center gap-2`, tw.md`gap-4`]}>
      <Button style={tw`flex-1`} onPress={onPress}>
        {i18n('wallet.send')}
      </Button>
      <Button style={tw`flex-1 bg-success-main`} onPress={goToReceive}>
        {i18n('wallet.receive')}
      </Button>
    </View>
  )
}
