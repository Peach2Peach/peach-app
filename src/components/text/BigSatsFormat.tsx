import { ReactElement } from 'react'
import { TextStyle, View } from 'react-native'
import { Text } from '.'
import { SATSINBTC } from '../../constants'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { getNumberFormatParts } from '../../utils/string'
import PaymentLogo from '../payment/PaymentLogo'

type SatsFormat = ComponentProps & {
  sats: number
  color?: TextStyle
}

export const BigSatsFormat = ({ sats, color, style }: SatsFormat): ReactElement => {
  const parts = getNumberFormatParts(sats / SATSINBTC)
  return (
    <View style={tw`flex flex-row`}>
      <PaymentLogo id="bitcoin" style={tw`mr-1 w-7 h-7`} />
      <Text style={[tw`h4`, parts[0] === '0' ? tw`text-black-5` : tw`text-black-1`]}>
        {parts[0]}.{parts[1]}
      </Text>
      <Text style={[tw`h4`, color || tw`text-black-1`, style]}>{parts[2]}</Text>
      <Text style={[tw`h6 ml-1 mt-0.5`, color || tw`text-black-1`, style]}>{i18n('currency.SATS')}</Text>
    </View>
  )
}

export default SatsFormat
