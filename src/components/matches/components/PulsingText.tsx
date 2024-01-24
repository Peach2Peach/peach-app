import { ReactNode, useEffect, useRef } from 'react'
import { Animated, StyleProp, TextStyle } from 'react-native'
import tw from '../../../styles/tailwind'

const pulseAnimation = (color: Animated.Value, fontSize: Animated.Value) =>
  Animated.parallel([
    Animated.timing(color, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }),
    Animated.loop(
      Animated.sequence([
        Animated.timing(fontSize, {
          toValue: 18,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(fontSize, {
          toValue: 16,
          duration: 500,
          useNativeDriver: false,
        }),
      ]),
    ),
  ]).start()

const resetAnimation = (color: Animated.Value, fontSize: Animated.Value) => {
  color.stopAnimation()
  fontSize.stopAnimation()
  Animated.parallel([
    Animated.timing(color, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }),
    Animated.timing(fontSize, {
      toValue: 16,
      duration: 500,
      useNativeDriver: false,
    }),
  ]).start()
}
type Props = {
  children: ReactNode
  style?: StyleProp<TextStyle>
  showPulse: boolean
}
const DEFAULT_FONT_SIZE = 16
export const PulsingText = ({ children, style, showPulse }: Props) => {
  const fontSize = useRef(new Animated.Value(DEFAULT_FONT_SIZE)).current
  const color = useRef(new Animated.Value(0)).current

  const fontWeight = color.interpolate({
    inputRange: [0, 2],
    outputRange: ['400', '600'],
    easing: (x) => Math.round(x * 2),
  })

  const textColor = color.interpolate({
    inputRange: [0, 1],
    outputRange: [String(tw.color('black-65')), String(tw.color('error-main'))],
  })

  useEffect(() => {
    if (showPulse) {
      pulseAnimation(color, fontSize)
    } else {
      resetAnimation(color, fontSize)
    }
  }, [color, fontSize, showPulse])

  return (
    <Animated.Text style={[tw`body-m`, style, { fontSize, color: textColor, fontWeight }]}>{children}</Animated.Text>
  )
}
