import { Dispatch, SetStateAction } from 'react'
import { PanResponder, Animated } from 'react-native'

export const createPanResponder = (pan: Animated.Value, setIsSliding: Dispatch<SetStateAction<boolean>>) =>
  PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      setIsSliding(true)
      Animated.event([null, { dy: pan }], { useNativeDriver: false })(e, gestureState)
    },
    onPanResponderRelease: () => {
      setIsSliding(false)
      pan.extractOffset()
    },
    onShouldBlockNativeResponder: () => true,
  })
