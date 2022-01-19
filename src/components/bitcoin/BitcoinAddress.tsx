
import React, { ReactElement } from 'react'
import { View, ViewStyle } from 'react-native'
import tw from '../../styles/tailwind'
import QRCode from 'react-native-qrcode-svg'
import peachLogo from '../../../assets/favico/peach-icon-192.png'
import { Card, Text } from '..'

interface BitcoinAddressProps {
  address: string,
  showQR: boolean,
  style?: ViewStyle|ViewStyle[]
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
export const BitcoinAddress = ({ address, showQR, style }: BitcoinAddressProps): ReactElement =>
  <View style={[tw`flex-col items-center`, style]}>
    {showQR
      ? <Card style={tw`p-4`}>
        <QRCode
          size={241}
          value={address}
          logo={peachLogo}
        />
      </Card>
      : null
    }
    <Text style={showQR ? tw`mt-4` : {}}>
      {address.slice(0, 8)}
      <Text style={tw`text-grey-2`}>
        {address.slice(8, -5)}
      </Text>
      {address.slice(-5)}
    </Text>
  </View>

export default BitcoinAddress