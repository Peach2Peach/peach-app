import { TextProps, View } from 'react-native'
import tw from '../../styles/tailwind'
import { Text } from '../text'

export const FixedHeightText = ({ height, style, ...textProps }: { height: number } & TextProps) => (
  <View style={{ height, justifyContent: 'center' }}>
    <Text style={[style, tw`-my-10`]} {...textProps} />
  </View>
)
