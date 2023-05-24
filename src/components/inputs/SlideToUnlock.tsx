import { ReactElement, useMemo, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, PanResponder, View } from 'react-native'
import { Text } from '..'
import tw from '../../styles/tailwind'
import { getNormalized } from '../../utils/math'
import Icon from '../Icon'
import { IconType } from '../../assets/icons'

type SlideToUnlockProps = ComponentProps & {
  label1: string
  label2?: string
  iconId?: IconType
  disabled?: boolean
  onUnlock: () => void
}

const onStartShouldSetResponder = () => true
const trackWidth = 260
const knobWidth = tw`w-18`.width as number
const padding = tw`w-1`.width as number

const getTransform = (pan: Animated.Value, widthToSlide: number) => [
  {
    translateX: pan.interpolate({
      inputRange: [0, 1],
      outputRange: [padding, widthToSlide],
      extrapolate: 'clamp',
    }),
  },
]
const getBackgroundColor = (pan: Animated.Value) =>
  pan.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [
      tw`text-primary-main`.color as string,
      tw`text-primary-main`.color as string,
      tw`text-success-main`.color as string,
    ],
  })
const getLabel1Opacity = (pan: Animated.Value) =>
  pan.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  })

export const SlideToUnlock = ({
  label1,
  label2 = label1,
  iconId = 'checkCircle',
  disabled,
  onUnlock,
  style,
}: SlideToUnlockProps): ReactElement => {
  const [widthToSlide, setWidthToSlide] = useState(trackWidth - knobWidth - padding)

  const onLayout = (event: LayoutChangeEvent) => {
    const width = Math.round(event.nativeEvent.layout.width)
    setWidthToSlide(width - knobWidth - padding)
  }

  const pan = useRef(new Animated.Value(0)).current
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (e, gestureState) => {
          if (disabled) return
          const x = gestureState.dx
          pan.setValue(getNormalized(x, widthToSlide))
        },
        onPanResponderRelease: (e, gestureState) => {
          const x = gestureState.dx
          const normalizedVal = getNormalized(x, widthToSlide)
          if (normalizedVal === 1 && !disabled) onUnlock()
          Animated.timing(pan, {
            toValue: 0,
            duration: 100,
            delay: 10,
            useNativeDriver: false,
          }).start()
        },
        onShouldBlockNativeResponder: () => true,
      }),
    [disabled, onUnlock, pan, widthToSlide],
  )

  return (
    <View
      {...panResponder.panHandlers}
      onLayout={onLayout}
      style={[
        tw`w-full max-w-full overflow-hidden rounded-full bg-primary-background-dark`,
        tw`border border-primary-mild-1`,
        !!disabled && tw`opacity-50`,
        style,
      ]}
    >
      <Animated.View
        {...{ onStartShouldSetResponder }}
        style={[tw`flex flex-row items-center`, { transform: getTransform(pan, widthToSlide) }]}
      >
        <Animated.View style={[tw`absolute right-full`, { width: widthToSlide, opacity: pan }]}>
          <Text style={tw`text-center button-large`} numberOfLines={1}>
            {label2}
          </Text>
        </Animated.View>
        <Animated.View
          style={[
            { width: knobWidth, backgroundColor: getBackgroundColor(pan) },
            tw`flex flex-row justify-center py-2 my-1 rounded-full `,
          ]}
        >
          <Icon id={iconId} style={tw`w-6 h-6`} color={tw`text-primary-background`.color} />
          <Icon id="chevronsRight" style={tw`w-6 h-6 ml-1`} color={tw`text-primary-background`.color} />
        </Animated.View>
        <Animated.View style={{ width: widthToSlide, opacity: getLabel1Opacity(pan) }}>
          <Text style={tw`text-center button-large`} numberOfLines={1}>
            {label1}
          </Text>
        </Animated.View>
      </Animated.View>
    </View>
  )
}
