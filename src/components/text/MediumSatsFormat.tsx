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

export const MediumSatsFormat = ({ sats, color, style }: SatsFormat) => {
  const parts = getNumberFormatParts(sats / SATSINBTC)
  return (
    <View style={tw`flex flex-row items-center`}>
      <PaymentLogo id="bitcoin" style={tw`w-5 h-5 mr-1`} />
      <Text style={[tw`subtitle-1`, parts[0] === '0' ? tw`text-black-5` : tw`text-black-1`, style]}>
        {parts[0]}.{parts[1]}
      </Text>
      <Text style={[tw`subtitle-1`, color || tw`text-black-1`, style]}>{parts[2]}</Text>
      <Text style={[tw`mt-1 ml-1 body-s`, color || tw`text-black-1`, style]}>{i18n('currency.SATS')}</Text>
    </View>
  )
}

export default SatsFormat
