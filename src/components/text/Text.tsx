import { Text, TextProps } from 'react-native'
import tw from '../../styles/tailwind'

export const PeachText = ({ style, ...props }: TextProps) => (
  <Text style={[tw`body-m text-black-1`, style]} allowFontScaling={false} {...props} />
)

export default PeachText
