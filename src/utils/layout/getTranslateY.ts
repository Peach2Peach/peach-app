import { Animated } from 'react-native'

export const getTranslateY = (pan: Animated.Value, range: [number, number]) => ({
  transform: [
    {
      translateY: pan.interpolate({
        inputRange: range,
        outputRange: range,
        extrapolate: 'clamp',
      }),
    },
  ],
})
