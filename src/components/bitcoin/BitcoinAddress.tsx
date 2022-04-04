
import React, { ReactElement } from 'react'
import Clipboard from '@react-native-clipboard/clipboard'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'
import QRCode from 'react-native-qrcode-svg'
import peachLogo from '../../../assets/favico/peach-icon-192.png'
import { Card, Text } from '..'
import Icon from '../Icon'
import { splitAt } from '../../utils/string'

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
  const addressParts = {
    one: address.slice(0, 8),
    two: address.slice(8, -5),
    three: address.slice(-5),
  }
  addressParts.two = splitAt(addressParts.two, Math.floor(addressParts.two.length / 2) - 2).join('\n')

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
      <Pressable onPress={() => Clipboard.setString(address)}>
        <Icon id="copy" style={tw`w-7 h-7 ml-2`} color={tw`text-peach-1`.color as string}/>
      </Pressable>
    </View>
  </View>
}

export default BitcoinAddress