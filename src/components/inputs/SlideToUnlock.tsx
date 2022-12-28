import React, { ReactElement, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, PanResponder, View } from 'react-native'
import { Shadow, Text } from '..'
import tw from '../../styles/tailwind'
import { innerShadow } from '../../utils/layout'
import { getNormalized } from '../../utils/math'
import Icon from '../Icon'

type SlideToUnlockProps = ComponentProps & {
  label1: string
  label2?: string
  onUnlock: () => void
}

const onStartShouldSetResponder = () => true
const knobWidth = tw`w-18`.width as number
const padding = tw`w-1`.width as number

const getTranslateX = (pan: Animated.Value, widthToSlide: number) =>
  pan.interpolate({
    inputRange: [0, 1],
    outputRange: [padding, widthToSlide],
    extrapolate: 'clamp',
  })
const getBackgroundColor = (pan: Animated.Value) =>
  pan.interpolate({
    inputRange: [0, 1],
    outputRange: [tw`text-primary-main`.color as string, tw`text-success-main`.color as string],
  })
const getLabel1Opacity = (pan: Animated.Value) =>
  pan.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  })

export const SlideToUnlock = ({ label1, label2 = label1, onUnlock, style }: SlideToUnlockProps): ReactElement => {
  const [trackWidth, setTrackWidth] = useState(260)
  const [widthToSlide, setWidthToSlide] = useState(trackWidth - knobWidth - padding)

  const onLayout = (event: LayoutChangeEvent) => {
    const width = Math.round(event.nativeEvent.layout.width)
    setTrackWidth(width)
    setWidthToSlide(width - knobWidth - padding)
  }

  const pan = useRef(new Animated.Value(0)).current
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        const x = gestureState.dx as number
        pan.setValue(getNormalized(x, trackWidth))
      },
      onPanResponderRelease: (e, gestureState) => {
        const x = gestureState.dx as number
        const val = getNormalized(x, trackWidth)
        if (val === 1) onUnlock()
        if (val !== 1) {
          Animated.timing(pan, {
            toValue: 0,
            duration: 100,
            delay: 10,
            useNativeDriver: false,
          }).start()
        }
      },
      onShouldBlockNativeResponder: () => true,
    }),
  )

  return (
    <View
      {...panResponder.current.panHandlers}
      onLayout={onLayout}
      style={[tw`max-w-full w-full bg-primary-background-dark rounded-full overflow-hidden`, style]}
    >
      <Shadow shadow={innerShadow}>
        <Animated.View
          {...{ onStartShouldSetResponder }}
          style={[
            tw`flex flex-row items-center`,
            {
              transform: [
                {
                  translateX: getTranslateX(pan, widthToSlide),
                },
              ],
            },
          ]}
        >
          <Animated.View style={[tw`absolute right-full`, { width: widthToSlide, opacity: pan }]}>
            <Text style={tw`button-large text-center`}>{label2}</Text>
          </Animated.View>
          <Animated.View
            style={[
              { width: knobWidth, backgroundColor: getBackgroundColor(pan) },
              tw`my-1 py-2 rounded-full flex flex-row justify-center `,
            ]}
          >
            <Icon id="checkCircle" style={tw`w-6 h-6`} color={tw`text-primary-background`.color} />
            <Icon id="chevronsRight" style={tw`w-6 h-6 ml-1`} color={tw`text-primary-background`.color} />
          </Animated.View>
          <Animated.View style={{ width: widthToSlide, opacity: getLabel1Opacity(pan) }}>
            <Text style={tw`button-large text-center`}>{label1}</Text>
          </Animated.View>
        </Animated.View>
      </Shadow>
    </View>
  )
}
