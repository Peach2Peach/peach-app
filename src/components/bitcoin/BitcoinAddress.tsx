import 'react-native-url-polyfill/auto'

import { Pressable, View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { PrimaryButton, Text } from '..'
import { useIsMediumScreen } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { Fade } from '../animation'
import { BitcoinAddressProps, useBitcoinAddressSetup } from './hooks/useBitcoinAddressSetup'

export const BitcoinAddress = ({ address, amount, label }: BitcoinAddressProps) => {
  const isMediumScreen = useIsMediumScreen()
  const width = isMediumScreen ? 327 : 242
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
    <>
      <Pressable onPress={openInWalletOrCopyPaymentRequest} onLongPress={copyPaymentRequest}>
        <Fade show={showPaymentRequestCopied} duration={300} delay={0}>
          <Text style={[tw`text-center subtitle-2`, tw`absolute w-20 -ml-10 bottom-full left-1/2`]}>
            {i18n('copied')}
          </Text>
        </Fade>
        <QRCode size={width} value={urn.toString()} backgroundColor={String(tw`text-primary-background`.color)} />
      </Pressable>

      <View style={tw`flex-row items-stretch w-full gap-2`}>
        <View style={tw`items-center justify-center px-3 py-2 border shrink border-black-4 rounded-xl`}>
          <Text style={tw`text-black-3`}>
            {addressParts.one}
            <Text style={tw`text-black-1`}>{addressParts.two}</Text>
            {addressParts.three}
            <Text style={tw`text-black-1`}>{addressParts.four}</Text>
          </Text>
          <Fade
            style={tw`absolute items-center justify-center w-full h-full bg-primary-background-light`}
            show={showAddressCopied}
            duration={200}
            delay={0}
          >
            <Text style={tw`text-center subtitle-1`}>{i18n('copied')}</Text>
          </Fade>
        </View>

        <View style={tw`justify-center gap-2`}>
          <PrimaryButton iconId="copy" onPress={copyAddress} />
          <PrimaryButton iconId="externalLink" onPress={openInWalletOrCopyPaymentRequest} />
        </View>
      </View>
    </>
  )
}
