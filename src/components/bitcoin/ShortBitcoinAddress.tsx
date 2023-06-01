import 'react-native-url-polyfill/auto'

import { Text } from '..'
import tw from '../../styles/tailwind'

const getAddressParts = (address: string) => {
  const addressParts = {
    one: address.slice(0, 4),
    two: address.slice(4, 9),
    three: address.slice(9, -5),
    four: address.slice(-5),
  }
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

export default ShortBitcoinAddress
