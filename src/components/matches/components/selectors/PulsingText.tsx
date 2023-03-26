import { useEffect, useRef } from 'react';
import * as React from 'react';
import { Animated, StyleProp, TextStyle } from 'react-native'
import tw from '../../../../styles/tailwind'

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
  children: React.ReactNode
  style?: StyleProp<TextStyle>
  showPulse: boolean
}

export const PulsingText = ({ children, style, showPulse }: Props) => {
  const fontSize = useRef(new Animated.Value(16)).current
  const color = useRef(new Animated.Value(0)).current

  const fontWeight = color.interpolate({
    inputRange: [0, 2],
    outputRange: ['400', '600'],
    easing: (x) => Math.round(x * 2),
  })

  const textColor = color.interpolate({
    inputRange: [0, 1],
    outputRange: [String(tw`text-black-2`.color), String(tw`text-error-main`.color)],
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
