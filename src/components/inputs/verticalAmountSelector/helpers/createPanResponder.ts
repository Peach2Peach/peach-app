import { Animated, PanResponder } from 'react-native'

export const createPanResponder = (pan: Animated.Value) =>
  PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      Animated.event([null, { dy: pan }], { useNativeDriver: false })(e, gestureState)
    },
    onPanResponderRelease: () => {
      pan.extractOffset()
    },
    onShouldBlockNativeResponder: () => true,
  })
