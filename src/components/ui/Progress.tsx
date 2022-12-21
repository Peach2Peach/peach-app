import React, { ReactElement, useEffect, useRef } from 'react'
import { Animated, View, ViewStyle } from 'react-native'
import tw from '../../styles/tailwind'
import { textShadow } from '../../utils/layout'
import { Text } from '../text'

type ProgressProps = ComponentProps & {
  percent: number
  text?: string
  color: ViewStyle
}
export const Progress = ({ percent, text, color, style }: ProgressProps): ReactElement => {
  const widthAnim = useRef(new Animated.Value(percent)).current

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: percent,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [percent, widthAnim])

  return (
    <View style={[tw`w-full h-4 overflow-hidden rounded-full`, style]}>
      <View style={[tw`absolute w-full h-full opacity-50 rounded-full`, color]} />
      <Animated.View
        style={[
          tw`w-full h-full rounded-full`,
          color,
          {
            width: widthAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
      {text ? (
        <View style={tw`absolute w-full`}>
          <Text style={[tw`text-sm font-baloo text-white-2 text-center uppercase -mt-px`, textShadow]}>{text}</Text>
        </View>
      ) : null}
    </View>
  )
}
export default Progress
