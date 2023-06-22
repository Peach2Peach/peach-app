import { Animated } from 'react-native'
import { padding } from '../constants'

export const getTransform = (pan: Animated.Value, widthToSlide: number) => [
  {
    translateX: pan.interpolate({
      inputRange: [0, 1],
      outputRange: [padding, widthToSlide],
      extrapolate: 'clamp',
    }),
  },
]
