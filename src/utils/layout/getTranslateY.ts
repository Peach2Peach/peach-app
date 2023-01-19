import { Animated } from 'react-native'

export const getTranslateY = (pan: Animated.Value, trackHeight: number) => ({
  transform: [
    {
      translateY: pan.interpolate({
        inputRange: [0, trackHeight],
        outputRange: [0, trackHeight],
        extrapolate: 'clamp',
      }),
    },
  ],
})
