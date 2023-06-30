import { Animated } from 'react-native'
import tw from '../../../../styles/tailwind'
import { Text } from '../../../text'

type Props = ComponentProps & {
  width: number
  opacity: Animated.Value | Animated.AnimatedInterpolation<string | number>
}

export const ConfirmSliderLabel = ({ children, width, opacity, style }: Props) => (
  <Animated.View style={[style, { width, opacity }]}>
    <Text style={[tw`text-center button-medium`, tw.md`button-large`]} numberOfLines={1}>
      {children}
    </Text>
  </Animated.View>
)
