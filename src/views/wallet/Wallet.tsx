import { RefreshControl, View } from 'react-native'
import { PeachScrollView, Screen } from '../../components'
import { BackupReminderIcon } from '../../components/BackupReminderIcon'
import { Button } from '../../components/buttons/Button'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { peachWallet } from '../../utils/wallet/setWallet'
import { BitcoinLoading } from '../loading/BitcoinLoading'
import { TotalBalance, WalletHeader } from './components'
import { useLastUnusedAddress, useUTXOs, useWalletAddress, useWalletSetup } from './hooks'

export const Wallet = () => {
  const { balance, isRefreshing, walletLoading, refresh } = useWalletSetup({ peachWallet, syncOnLoad: true })
  if (walletLoading) return <BitcoinLoading text={i18n('wallet.loading')} />

  return (
    <Screen header={<WalletHeader />}>
      <PeachScrollView
        contentContainerStyle={tw`grow`}
        contentStyle={tw`justify-center py-16 grow`}
        refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} />}
      >
        <TotalBalance amount={balance} isRefreshing={isRefreshing} />
        <BackupReminderIcon />
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
  useUTXOs()

  const goToSend = () => {
    navigation.navigate('sendBitcoin')
  }
  const goToReceive = () => {
    navigation.navigate('receiveBitcoin')
  }
  return (
    <View style={[tw`flex-row items-center justify-center gap-2`, tw`md:gap-4`]}>
      <Button style={tw`flex-1 bg-success-main`} onPress={goToReceive}>
        {i18n('wallet.receive')}
      </Button>
      <Button style={tw`flex-1`} onPress={goToSend}>
        {i18n('wallet.send')}
      </Button>
    </View>
  )
}
