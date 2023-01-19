import { Animated } from 'react-native'

export const getTranslateX = (pan: Animated.Value, trackWidth: number) => ({
  transform: [
    {
      translateX: pan.interpolate({
        inputRange: [0, trackWidth],
        outputRange: [0, trackWidth],
        extrapolate: 'clamp',
      }),
    },
  ],
})
