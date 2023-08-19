import { Text, TextProps } from 'react-native'
import tw from '../../styles/tailwind'
import { shouldNormalCase } from './helpers/shouldNormalCase'

export const PeachText = ({ style, ...props }: TextProps) => (
  <Text
    style={[tw`body-m text-black-1`, style, shouldNormalCase(style) && tw`normal-case`]}
    allowFontScaling={false}
    {...props}
  />
)

export default PeachText
