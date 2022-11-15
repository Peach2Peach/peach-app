import React, { useEffect, useRef } from 'react'
import { StyleSheet, View, ColorValue, Animated, Easing } from 'react-native'
import { Style } from 'twrnc/dist/esm/types'
import tw from '../../styles/tailwind'
import Spinner from '../icons/spinner.svg'

type Props = ComponentProps & {
  color?: string
}

const startRotationAnimation = (durationMs: number, rotationDegree: Animated.Value): void => {
  Animated.loop(
    Animated.timing(rotationDegree, {
      toValue: 360,
      duration: durationMs,
      easing: Easing.linear,
      useNativeDriver: false,
    }),
  ).start()
}

export const Loading = ({ color }: Props): JSX.Element => {
  const rotationDegree = useRef(new Animated.Value(0)).current

  useEffect(() => {
    startRotationAnimation(2000, rotationDegree)
  }, [2000, rotationDegree])

  return (
    <Animated.View
      style={[
        tw`w-8 h-8 items-center justify-center
        `,
        {
          transform: [
            {
              rotateZ: rotationDegree.interpolate({
                inputRange: [0, 360],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        },
      ]}
    >
      <Spinner style={tw`w-8 h-8 `} fill={color ? color : (tw`text-peach-1`.color as string)} />
    </Animated.View>
  )
}
