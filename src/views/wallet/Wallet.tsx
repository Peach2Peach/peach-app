import React, { useCallback } from 'react'
import { View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Icon, Text } from '../../components'
import { BitcoinAddressInput, SlideToUnlock } from '../../components/inputs'
import { BigSatsFormat } from '../../components/text'
import { useValidatedState } from '../../hooks'
import tw from '../../styles/tailwind'
import { openInWallet } from '../../utils/bitcoin'
import i18n from '../../utils/i18n'
import { useWalletSetup } from './hooks/useWalletSetup'

const bitcoinAddressRules = { required: false, bitcoinAddress: true }

export default () => {
  useWalletSetup()
  const [address, setAddress, isValid, addressErrors] = useValidatedState<string>('', bitcoinAddressRules)

  const openWalletApp = () => openInWallet('bitcoin:')

  const onChange = useCallback(
    (value: string) => {
      setAddress(value)
    },
    [setAddress],
  )

  return (
    <View style={tw`h-full flex flex-col justify-between px-8`}>
      <View style={tw`h-full flex-shrink flex flex-col justify-center items-center`}>
        <Text style={tw`button-medium mb-4`}>{i18n('wallet.totalBalance')}:</Text>
        <BigSatsFormat sats={50000} />
        <Text style={tw`button-medium mt-16`}>{i18n('wallet.withdrawTo')}:</Text>
        <BitcoinAddressInput
          style={tw`mt-4`}
          {...{
            onChange,
            isValid,
            value: address,
            errorMessage: addressErrors,
          }}
        />
        <TouchableOpacity style={tw`flex-row justify-center items-center`} onPress={openWalletApp}>
          <Text style={tw`body-s underline text-black-2 uppercase`}>{i18n('wallet.openWalletApp')}</Text>
          <Icon id="externalLink" style={tw`w-4 h-4 ml-1 -mt-1`} color={tw`text-primary-main`.color} />
        </TouchableOpacity>
      </View>
      <SlideToUnlock style={tw`mb-6`} label1={i18n('wallet.withdrawAll')} onUnlock={() => alert('ok')} />
    </View>
  )
}
