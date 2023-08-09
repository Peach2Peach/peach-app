import { Alert, View } from 'react-native'
import { Screen } from '../../components'
import i18n from '../../utils/i18n'
import { BitcoinLoading } from '../loading/BitcoinLoading'
import { TotalBalance } from './components/overview/TotalBalance'
import { useWalletSetup } from './hooks/useWalletSetup'
import { WalletHeader } from './components/WalletHeader'
import tw from '../../styles/tailwind'
import { NewButton as Button } from '../../components/buttons/Button'
import { useNavigation } from '../../hooks'

export const Wallet = () => {
  const { balance, isRefreshing, walletLoading } = useWalletSetup()

  if (walletLoading) return <BitcoinLoading text={i18n('wallet.loading')} />

  return (
    <Screen>
      <WalletHeader />
      <View style={tw`items-center justify-center flex-grow`}>
        <TotalBalance amount={balance} isRefreshing={isRefreshing} />
      </View>
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
