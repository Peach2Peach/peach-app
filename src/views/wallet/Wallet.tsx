import React from 'react'
import { RefreshControl, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { AvoidKeyboard, Icon, PeachScrollView, Text } from '../../components'
import { BitcoinAddressInput, SlideToUnlock } from '../../components/inputs'
import { BigSatsFormat } from '../../components/text'
import tw from '../../styles/tailwind'
import { openInWallet } from '../../utils/bitcoin'
import i18n from '../../utils/i18n'
import { peachWallet } from '../../utils/wallet/setWallet'
import { useWalletSetup } from './hooks/useWalletSetup'
import { WalletLoading } from './WalletLoading'

const openWalletApp = () => openInWallet('bitcoin:')

export default () => {
  const { walletStore, refresh, loading, onChange, isValid, address, addressErrors, openWithdrawalConfirmation }
    = useWalletSetup()

  if (loading) return <WalletLoading />

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
            <BigSatsFormat sats={walletStore.balance} />
            <Text style={tw`mt-16 button-medium`}>{i18n('wallet.withdrawTo')}:</Text>
            <BitcoinAddressInput
              style={tw`mt-4`}
              {...{
                onChange,
                isValid,
                value: address,
                errorMessage: addressErrors,
              }}
            />
            <TouchableOpacity style={tw`flex-row items-center justify-center`} onPress={openWalletApp}>
              <Text style={tw`underline uppercase body-s text-black-2`}>{i18n('wallet.openWalletApp')}</Text>
              <Icon id="externalLink" style={tw`w-4 h-4 ml-1 -mt-1`} color={tw`text-primary-main`.color} />
            </TouchableOpacity>
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
