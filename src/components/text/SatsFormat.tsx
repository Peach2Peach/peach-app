import { ReactElement } from 'react'
import { TextStyle, View, ViewStyle } from 'react-native'
import { Text } from '.'
import { SATSINBTC } from '../../constants'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { getNumberFormatParts } from '../../utils/string'
import PaymentLogo from '../payment/PaymentLogo'

type SatsFormatProps = ComponentProps & {
  sats: number
  color?: TextStyle
  containerStyle?: ViewStyle
  bitcoinLogoStyle?: ViewStyle
  satsContainerStyle?: ViewStyle
  satsStyle?: TextStyle
}

export const SatsFormat = ({
  sats,
  color,
  style,
  containerStyle,
  satsContainerStyle,
  bitcoinLogoStyle,
  satsStyle,
}: SatsFormatProps): ReactElement => {
  const parts = getNumberFormatParts(sats / SATSINBTC)
  return (
    <View style={[tw`flex flex-row items-center`, containerStyle]}>
      <PaymentLogo id="bitcoin" style={[bitcoinLogoStyle || tw`w-3 h-3 mr-1 -mt-1`]} />
      <View style={[tw`flex-row items-center`, satsContainerStyle]}>
        <Text
          style={[tw`font-courier-prime font-medium`, parts[0] === '0' ? tw`text-black-5` : tw`text-black-1`, style]}
        >
          {parts[0]}.{parts[1]}
        </Text>
        <Text style={[tw`font-courier-prime font-medium`, style, color || tw`text-black-1`]}>{parts[2]}</Text>
        <Text style={[tw`body-s font-medium mt-0.5`, satsStyle || style, color || tw`text-black-1`]}>
          {' '}
          {i18n('currency.SATS')}
        </Text>
      </View>
    </View>
  )
}

export default SatsFormat
