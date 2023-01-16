import React, { ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, PanResponder, View } from 'react-native'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { innerShadow } from '../../utils/layout'
import { Input, Shadow, Text } from '..'
import { debounce } from '../../utils/performance'
import i18n from '../../utils/i18n'
import { round } from '../../utils/math'

type SliderLabelProps = ComponentProps & { position: number }
const SliderLabel = ({ position, style, children }: SliderLabelProps): ReactElement => (
  <View style={[tw`absolute items-center w-full`, { left: position }, style]}>
    <View style={tw`w-[2px] h-[10px] bg-black-1`} />
    <Text style={tw`mt-0.5 font-semibold text-center`}>{children}</Text>
  </View>
)

type PremiumSliderProps = ComponentProps & {
  value: number
  onChange: (value: number) => void
  displayUpdate?: (value: number) => void
}

const MIN = -21
const MAX = 21
const DELTA = MAX - MIN
const KNOBWIDTH = tw`w-8`.width as number

const onStartShouldSetResponder = () => true
const getTransform = (pan: Animated.Value, trackWidth: number, knobWidth: number) => ({
  transform: [
    {
      translateX: pan.interpolate({
        inputRange: [0, trackWidth],
        outputRange: [0, trackWidth - knobWidth],
        extrapolate: 'clamp',
      }),
    },
  ],
})

export const PremiumSlider = ({ value, onChange, displayUpdate, style }: PremiumSliderProps): ReactElement => {
  const [premium, setPremium] = useState(value)
  const [trackWidth, setTrackWidth] = useState(260)
  const labelPosition = useMemo(
    () => ({
      minus21: KNOBWIDTH / 2 - trackWidth / 2,
      minus10: round((11 / DELTA) * trackWidth) - trackWidth / 2 + KNOBWIDTH / 3,
      zero: 0,
      plus10: round((32 / DELTA) * trackWidth) - trackWidth / 2 - KNOBWIDTH / 2,
      plus21: trackWidth - KNOBWIDTH / 2 - trackWidth / 2,
    }),
    [trackWidth],
  )
  const pan = useRef(new Animated.Value(((value - MIN) / DELTA) * trackWidth)).current
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        Animated.event([null, { dx: pan }], { useNativeDriver: false })(e, gestureState)
      },
      onPanResponderRelease: () => {
        pan.extractOffset()
      },
      onShouldBlockNativeResponder: () => true,
    }),
  ).current

  useEffect(() => {
    pan.extractOffset()
    pan.addListener((props) => {
      if (props.value < 0) pan.setOffset(0)
      if (props.value > trackWidth) pan.setOffset(trackWidth)

      const boundedX = props.value < 0 ? 0 : Math.min(props.value, trackWidth)
      const val = round((boundedX / trackWidth) * DELTA + MIN)
      setPremium(val)
    })

    return () => pan.removeAllListeners()
  }, [pan, trackWidth])

  useEffect(() => {
    if (isNaN(value)) return
    pan.setOffset(((value - MIN) / DELTA) * trackWidth)
  }, [pan, trackWidth, value])

  const debounced = useRef(
    debounce((deps: { premium: number }) => {
      onChange(deps.premium)
    }, 300),
  )

  const deps: AnyObject = { premium }
  useEffect(
    () => debounced.current(deps),
    Object.keys(deps).map((dep) => deps[dep]),
  )

  useEffect(() => {
    if (displayUpdate) displayUpdate(premium)
  }, [displayUpdate, premium])

  const onLayout = (event: LayoutChangeEvent) => setTrackWidth(event.nativeEvent.layout.width)

  return (
    <View>
      <View
        {...panResponder.panHandlers}
        style={[tw`w-full max-w-full overflow-hidden rounded-full bg-primary-background-dark`, style]}
      >
        <Shadow shadow={innerShadow} style={tw`w-full p-0.5 rounded`}>
          <View {...{ onLayout }}>
            <Animated.View
              {...{ onStartShouldSetResponder }}
              style={[
                { width: KNOBWIDTH },
                tw`z-10 flex items-center rounded-full bg-primary-main`,
                getTransform(pan, trackWidth, KNOBWIDTH),
              ]}
            >
              <Icon id="chevronsDown" style={tw`w-4 h-4`} color={tw`text-primary-background-light`.color} />
            </Animated.View>
          </View>
        </Shadow>
      </View>
      <View style={tw`w-full mt-1`}>
        <SliderLabel position={labelPosition.minus21}>{MIN}%</SliderLabel>
        <SliderLabel position={labelPosition.minus10}>{round(MIN / 2, -1)}%</SliderLabel>
        <SliderLabel position={labelPosition.zero}>{i18n('sell.premium.marketPrice')}</SliderLabel>
        <SliderLabel position={labelPosition.plus10}>{round(MAX / 2, -1)}%</SliderLabel>
        <SliderLabel position={labelPosition.plus21}>+{MAX}%</SliderLabel>
      </View>
    </View>
  )
}

export default PremiumSlider
