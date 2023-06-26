import { RefreshControl, View } from 'react-native'
import { AvoidKeyboard, Loading, PeachScrollView, Text, BigSatsFormat } from '../../components'
import { OpenWallet } from '../../components/bitcoin'
import { BitcoinAddressInput, SlideToUnlock } from '../../components/inputs'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { peachWallet } from '../../utils/wallet/setWallet'
import { BitcoinLoading } from '../loading/BitcoinLoading'
import { useWalletSetup } from './hooks/useWalletSetup'

export default () => {
  const {
    walletStore,
    refresh,
    isRefreshing,
    isValid,
    address,
    setAddress,
    addressErrors,
    openWithdrawalConfirmation,
    walletLoading,
  } = useWalletSetup(true)

  if (walletLoading) return <BitcoinLoading text={i18n('wallet.loading')} />

  return (
    <AvoidKeyboard iOSBehavior={'height'} androidBehavior={'height'}>
      <PeachScrollView
        style={tw`h-full`}
        contentContainerStyle={tw`h-full px-8`}
        refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} />}
      >
        <View style={tw`flex flex-col justify-between h-full`}>
          <View style={tw`flex flex-col items-center justify-center flex-shrink h-full`}>
            <Text style={tw`mb-4 button-medium`}>{i18n('wallet.totalBalance')}:</Text>
            <BigSatsFormat style={isRefreshing ? tw`opacity-60` : {}} sats={walletStore.balance} />
            {isRefreshing && <Loading style={tw`absolute`} />}
            <Text style={tw`mt-16 button-medium`}>{i18n('wallet.withdrawTo')}:</Text>
            <BitcoinAddressInput style={tw`mt-4`} onChange={setAddress} value={address} errorMessage={addressErrors} />
            <OpenWallet />
          </View>
          <SlideToUnlock
            style={tw`mb-6`}
            disabled={!walletStore.balance || !peachWallet.synced || !address || !isValid}
            label1={i18n('wallet.withdrawAll')}
            onUnlock={openWithdrawalConfirmation}
          />
        </View>
      </PeachScrollView>
    </AvoidKeyboard>
  )
}
