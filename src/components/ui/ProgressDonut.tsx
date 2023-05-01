import { useEffect, useRef } from 'react'
import { Animated, View } from 'react-native'
import tw from '../../styles/tailwind'
import { Circle, G, Svg } from 'react-native-svg'
import { Text } from '../text'
import { isIOS } from '../../utils/system'

type Props = ComponentProps & {
  title: string
  max: number
  value: number
}
export const ProgressDonut = ({ title, max, value, style }: Props) => {
  const percent = value / max

  const strokeWidth = 7
  const radius = (32 - strokeWidth) / 2
  const circleCircumference = 2 * Math.PI * radius
  const strokeDashOffsetAnim = useRef(new Animated.Value(circleCircumference - circleCircumference * percent)).current
  const AnimatedCircle = Animated.createAnimatedComponent(Circle)

  useEffect(() => {
    Animated.timing(strokeDashOffsetAnim, {
      toValue: circleCircumference - circleCircumference * percent,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [circleCircumference, percent, strokeDashOffsetAnim])

  return (
    <View style={[tw`items-center`, style]}>
      <Text style={tw`text-primary-main font-bold text-xs text-center`}>{title}</Text>
      <View style={[tw`w-8 h-8`, tw.md`w-10 h-10`]}>
        <Svg style={tw`w-full h-full`} viewBox="0 0 32 32">
          <G rotation={-90} originX="16" originY="16">
            <Circle
              cx="50%"
              cy="50%"
              r={radius}
              fill="transparent"
              stroke={tw`text-primary-background-dark`.color}
              strokeWidth={strokeWidth}
            />
            <AnimatedCircle
              cx="50%"
              cy="50%"
              r={radius}
              fill="transparent"
              stroke={tw`text-primary-main`.color}
              strokeWidth={strokeWidth}
              strokeDasharray={circleCircumference}
              strokeDashoffset={strokeDashOffsetAnim}
            />
          </G>
        </Svg>
        <View style={tw`absolute w-full h-full justify-center items-center`}>
          <Text style={[tw`font-bold`, isIOS() && tw`mt-0.5`]}>{value}</Text>
        </View>
      </View>
    </View>
  )
}
