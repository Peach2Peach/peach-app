import { TextProps, View } from 'react-native'
import tw from '../../styles/tailwind'
import { PeachText } from './Text'

export const FixedHeightText = ({ height, style, ...textProps }: { height: number } & TextProps) => (
  <View style={{ height, justifyContent: 'center' }}>
    <PeachText style={[style, tw`-my-10`]} {...textProps} />
  </View>
)
