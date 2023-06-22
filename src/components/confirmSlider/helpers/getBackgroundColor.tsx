import { Animated } from 'react-native'
import tw from '../../../styles/tailwind'

export const getBackgroundColor = (pan: Animated.Value) =>
  pan.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [
      tw`text-primary-main`.color as string,
      tw`text-primary-main`.color as string,
      tw`text-success-main`.color as string,
    ],
  })
