import React from 'react'
import { Image, View } from 'react-native'
import bitcoinAnimation from '../../assets/animated/bitcoin.gif'
import { Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const WalletLoading = () => (
  <View style={tw`items-center justify-center flex-1`}>
    <Image source={bitcoinAnimation} style={tw`w-25 h-25`} resizeMode="contain" />
    <Text style={tw`mt-8 text-center subtitle-1`}>{i18n('wallet.loading')}</Text>
  </View>
)
