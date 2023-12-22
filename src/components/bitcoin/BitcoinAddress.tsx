import Clipboard from '@react-native-clipboard/clipboard'
import { useRef } from 'react'
import { Animated, Pressable, TouchableOpacity, View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import 'react-native-url-polyfill/auto'
import { IconType } from '../../assets/icons'
import { useIsMediumScreen } from '../../hooks/useIsMediumScreen'
import tw from '../../styles/tailwind'
import { getBitcoinAddressParts } from '../../utils/bitcoin/getBitcoinAddressParts'
import { openInWallet } from '../../utils/bitcoin/openInWallet'
import i18n from '../../utils/i18n'
import { Icon } from '../Icon'
import { PeachText } from '../text/PeachText'
import { BitcoinAddressProps } from './hooks/useBitcoinAddressSetup'

export const BitcoinAddress = ({ address, amount, label }: BitcoinAddressProps) => {
  const isMediumScreen = useIsMediumScreen()
  const width = isMediumScreen ? 327 : 242

  const requestTextOpacity = useRef(new Animated.Value(0)).current
  const addressTextOpacity = useRef(new Animated.Value(0)).current

  const urn = new URL(`bitcoin:${address}`)

  if (amount) urn.searchParams.set('amount', String(amount))
  if (label) urn.searchParams.set('message', label)

  const addressParts = getBitcoinAddressParts(address)

  const copyAddress = () => {
    Clipboard.setString(address)
    textAnimation(addressTextOpacity, 200)
  }

  const copyPaymentRequest = () => {
    Clipboard.setString(urn.toString())
    textAnimation(requestTextOpacity, 300)
  }

  const openInWalletOrCopyPaymentRequest = async () => {
    if (!(await openInWallet(urn.toString()))) copyPaymentRequest()
  }

  return (
    <>
      <Pressable onPress={openInWalletOrCopyPaymentRequest} onLongPress={copyPaymentRequest}>
        <Animated.View style={{ opacity: requestTextOpacity }}>
          <PeachText style={[tw`text-center subtitle-2`, tw`absolute w-20 -ml-10 bottom-full left-1/2`]}>
            {i18n('copied')}
          </PeachText>
        </Animated.View>
        <QRCode size={width} value={urn.toString()} backgroundColor={String(tw`text-primary-background`.color)} />
      </Pressable>

      <View style={tw`flex-row items-stretch w-full gap-2`}>
        <View style={tw`items-center justify-center px-3 py-2 border shrink border-black-25 rounded-xl`}>
          <PeachText style={tw`text-black-50`}>
            {addressParts.one}
            <PeachText style={tw`text-black-100`}>{addressParts.two}</PeachText>
            {addressParts.three}
            <PeachText style={tw`text-black-100`}>{addressParts.four}</PeachText>
          </PeachText>
          <Animated.View
            style={[
              tw`absolute items-center justify-center w-full h-full bg-primary-background-light`,
              { opacity: addressTextOpacity },
            ]}
          >
            <PeachText style={tw`text-center subtitle-1`}>{i18n('copied')}</PeachText>
          </Animated.View>
        </View>

        <View style={tw`justify-center gap-2`}>
          <IconButton onPress={copyAddress} iconId="copy" />
          <IconButton iconId="externalLink" onPress={openInWalletOrCopyPaymentRequest} />
        </View>
      </View>
    </>
  )
}

function IconButton ({ onPress, iconId }: { onPress: () => void; iconId: IconType }) {
  return (
    <TouchableOpacity onPress={onPress} style={tw`items-center px-4 py-1 bg-primary-main rounded-xl`}>
      <Icon id={iconId} size={24} color={tw.color('primary-background-light')} />
    </TouchableOpacity>
  )
}

function textAnimation (opacity: Animated.Value, duration: number) {
  Animated.sequence([
    Animated.timing(opacity, { toValue: 1, duration, useNativeDriver: true }),
    Animated.delay(1500),
    Animated.timing(opacity, { toValue: 0, duration, useNativeDriver: true }),
  ]).start()
}
