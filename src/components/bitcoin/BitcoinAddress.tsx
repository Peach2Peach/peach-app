
import React, { ReactElement, useState } from 'react'
import Clipboard from '@react-native-clipboard/clipboard'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'
import QRCode from 'react-native-qrcode-svg'
import peachLogo from '../../../assets/favico/peach-icon-192.png'
import { Card, Text } from '..'
import Icon from '../Icon'
import { splitAt } from '../../utils/string'
import i18n from '../../utils/i18n'
import { Fade } from '../animation'

type BitcoinAddressProps = ComponentProps & {
  address: string,
  showQR: boolean,
}

/**
 * @description Component to display a bitcoin address
 * @param props Component properties
 * @param props.address bitcoin address
 * @param [props.showQR] if true show QR code as well
 * @param [props.style] css style object
 * @example
 * <BitcoinAddress address={'1BitcoinEaterAddressDontSendf59kuE'} />
 */
export const BitcoinAddress = ({ address, showQR, style }: BitcoinAddressProps): ReactElement => {
  const [showCopied, setShowCopied] = useState(false)

  const addressParts = {
    one: address.slice(0, 8),
    two: address.slice(8, -5),
    three: address.slice(-5),
  }
  addressParts.two = splitAt(addressParts.two, Math.floor(addressParts.two.length / 2) - 2).join('\n')

  const copy = () => {
    Clipboard.setString(address)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 500)
  }

  return <View style={[tw`flex-col items-center`, style]}>
    {showQR && address
      ? <Card style={tw`p-4`}>
        <QRCode
          size={241}
          value={address}
          logo={peachLogo}
        />
      </Card>
      : null
    }
    <View style={[
      tw`flex-row items-center`,
      showQR ? tw`mt-4` : {}
    ]}>
      <Text style={tw`text-base`}>
        {addressParts.one}
        <Text style={tw`text-base text-grey-2 leading-6`}>
          {addressParts.two}
        </Text>
        {addressParts.three}
      </Text>
      <Pressable onPress={copy}>
        <Fade show={showCopied} duration={300} delay={0}>
          <Text style={tw`font-baloo text-grey-1 text-sm uppercase absolute -top-6 w-20 left-1/2 -ml-10 text-center`}>
            {i18n('copied')}
          </Text>
        </Fade>
        <Icon id="copy" style={tw`w-7 h-7 ml-2`} color={tw`text-peach-1`.color as string}/>
      </Pressable>
    </View>
  </View>
}

export default BitcoinAddress