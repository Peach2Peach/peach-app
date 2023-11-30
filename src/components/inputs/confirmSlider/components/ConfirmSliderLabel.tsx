import { Animated } from 'react-native'
import { useIsMediumScreen } from '../../../../hooks'
import tw from '../../../../styles/tailwind'
import { FixedHeightText } from '../../../text'

type Props = ComponentProps & {
  width: number
  opacity: Animated.Value | Animated.AnimatedInterpolation<string | number>
}

export const ConfirmSliderLabel = ({ children, width, opacity, style }: Props) => {
  const isMediumScreen = useIsMediumScreen()
  return (
    <Animated.View style={[style, tw`pt-1px`, { width, opacity }]}>
      <FixedHeightText
        height={isMediumScreen ? 9 : 8}
        style={[tw`text-center button-medium`, tw`md:button-large`]}
        numberOfLines={1}
      >
        {children}
      </FixedHeightText>
    </Animated.View>
  )
}
