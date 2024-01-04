import { Animated } from 'react-native'
import tw from '../../../../styles/tailwind'

export const getBackgroundColor = (pan: Animated.Value) =>
  pan.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [
      tw.color('primary-main') as string,
      tw.color('primary-main') as string,
      tw.color('success-main') as string,
    ],
  })
