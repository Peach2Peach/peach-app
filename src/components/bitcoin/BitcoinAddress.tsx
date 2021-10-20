
import React, { ReactElement, useState } from 'react'
import { ViewStyle } from 'react-native'
import tw from '../../styles/tailwind'
import Text from '../Text'

interface BitcoinAddressProps {
  address: string,
  style?: ViewStyle|ViewStyle[]
}

/**
 * @description Component to display a bitcoin address
 * @param props Component properties
 * @param props.address bitcoin address
 * @param [props.style] css style object
 * @example
 * <BitcoinAddress address={'1BitcoinEaterAddressDontSendf59kuE'} />
 */
export const BitcoinAddress = ({ address, style }: BitcoinAddressProps): ReactElement => <Text style={style}>
  {address.slice(0, 8)}
  <Text style={tw`text-grey-2`}>
    {address.slice(8, -5)}
  </Text>
  {address.slice(-5)}
</Text>

export default BitcoinAddress