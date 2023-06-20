import { RefreshControl, View } from 'react-native'
import { AvoidKeyboard, Loading, PeachScrollView } from '../../components'
import { SlideToUnlock } from '../../components/inputs'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { peachWallet } from '../../utils/wallet/setWallet'
import { BitcoinLoading } from '../loading/BitcoinLoading'
import { TotalBalance } from './components/overview/TotalBalance'
import { useWalletSetup } from './hooks/useWalletSetup'
import { SendTo } from './components/overview/SendTo'

export default () => {
  const {
    walletStore,
    refresh,
    isRefreshing,
    address,
    setAddress,
    addressErrors,
    canWithdrawAll,
    openWithdrawalConfirmation,
    walletLoading,
  } = useWalletSetup(true)

  if (walletLoading) return <BitcoinLoading text={i18n('wallet.loading')} />

  return (
    <AvoidKeyboard iOSBehavior={'height'} androidBehavior={'height'}>
      <PeachScrollView
        style={tw`h-full`}
        contentContainerStyle={tw`h-full px-8 py-6`}
        refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} />}
      >
        <View style={tw`justify-between h-full`}>
          <View style={tw`items-center justify-center flex-1 gap-16`}>
            <TotalBalance style={isRefreshing && tw`opacity-60`} amount={walletStore.balance} />
            {isRefreshing && <Loading style={tw`absolute`} />}
            <SendTo {...{ address, setAddress, addressErrors }} />
          </View>
          <SlideToUnlock
            disabled={canWithdrawAll}
            label1={i18n('wallet.withdrawAll')}
            onUnlock={openWithdrawalConfirmation}
          />
        </View>
      </PeachScrollView>
    </AvoidKeyboard>
  )
}
