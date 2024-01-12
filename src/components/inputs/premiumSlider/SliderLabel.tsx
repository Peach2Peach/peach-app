import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { PeachText } from '../../text/PeachText'

type SliderLabelProps = ComponentProps & { position: number }

export const SliderLabel = ({ position, style, children }: SliderLabelProps) => (
  <View style={[tw`absolute items-center w-full`, { left: position }, style]}>
    <PeachText style={tw`mt-1 leading-tight text-center subtitle-2 text-black-65 max-w-20`}>{children}</PeachText>
  </View>
)
