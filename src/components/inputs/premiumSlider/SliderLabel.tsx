import { View } from 'react-native'
import { Text } from '../..'
import tw from '../../../styles/tailwind'

type SliderLabelProps = ComponentProps & { position: number }

export const SliderLabel = ({ position, style, children }: SliderLabelProps) => (
  <View style={[tw`absolute items-center w-full`, { left: position }, style]}>
    <Text style={tw`mt-1 leading-tight text-center subtitle-2 text-black-2 max-w-20`}>{children}</Text>
  </View>
)
