import React, { ReactElement, useState } from 'react'
import 'react-native-url-polyfill/auto'

import { LayoutChangeEvent, Pressable, View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { PrimaryButton, Text } from '..'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { Fade } from '../animation'
import { BitcoinAddressProps, useBitcoinAddressSetup } from './hooks/useBitcoinAddressSetup'

export const BitcoinAddress = ({
  address,
  amount,
  label,
  style,
}: ComponentProps & BitcoinAddressProps): ReactElement => {
  const [width, setWidth] = useState(300)
  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)

  const {
    addressParts,
    openInWalletOrCopyPaymentRequest,
    copyPaymentRequest,
    copyAddress,
    showAddressCopied,
    showPaymentRequestCopied,
    urn,
  } = useBitcoinAddressSetup({ address, amount, label })
  return (
    <View style={[tw`flex-col items-center w-full`, style]} {...{ onLayout }}>
      <Pressable onPress={openInWalletOrCopyPaymentRequest} onLongPress={copyPaymentRequest}>
        <Fade show={showPaymentRequestCopied} duration={300} delay={0}>
          <Text style={[tw`text-center subtitle-2`, tw`absolute w-20 -ml-10 bottom-full left-1/2`]}>
            {i18n('copied')}
          </Text>
        </Fade>
        <QRCode size={width} value={urn.toString()} />
      </Pressable>
      <View style={tw`w-full flex-row items-stretch mt-4`}>
        <View style={tw`w-full flex-shrink px-3 py-2 border border-black-4 rounded-xl mr-2 justify-center items-center`}>
          <Fade style={tw`absolute`} show={!showAddressCopied} duration={200} delay={0}>
            <Text style={tw`text-black-3`}>
              {addressParts.one}
              <Text style={tw`text-black-1`}>{addressParts.two}</Text>
              {addressParts.three}
              <Text style={tw`text-black-1`}>{addressParts.four}</Text>
            </Text>
          </Fade>
          <Fade style={tw`absolute`} show={showAddressCopied} duration={200} delay={0}>
            <Text style={tw`subtitle-1 text-center`}>{i18n('copied')}</Text>
          </Fade>
        </View>
        <View>
          <PrimaryButton iconId="copy" onPress={copyAddress} />
          <PrimaryButton style={tw`mt-2`} iconId="externalLink" onPress={openInWalletOrCopyPaymentRequest} />
        </View>
      </View>
    </View>
  )
}

export default BitcoinAddress
