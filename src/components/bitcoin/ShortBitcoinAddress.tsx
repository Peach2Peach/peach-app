import 'react-native-url-polyfill/auto'

import { Text } from '..'
import tw from '../../styles/tailwind'
import { getBitcoinAddressParts } from '../../utils/bitcoin/getBitcoinAddressParts'

const getAddressParts = (address: string) => {
  const addressParts = getBitcoinAddressParts(address)
  addressParts.three = `${addressParts.three[0]} ... ${addressParts.three[addressParts.three.length - 1]}`
  return addressParts
}

type ShortBitcoinAddressProps = ComponentProps & {
  address: string
}

export const ShortBitcoinAddress = ({ address, style }: ShortBitcoinAddressProps) => {
  const addressParts = getAddressParts(address)

  return (
    <Text style={[tw`text-black-5`, style]}>
      {addressParts.one}
      <Text style={[tw`text-black-1`, style]}>{addressParts.two}</Text>
      {addressParts.three}
      <Text style={[tw`text-black-1`, style]}>{addressParts.four}</Text>
    </Text>
  )
}
