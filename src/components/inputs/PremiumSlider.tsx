import React, { ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, PanResponder, View } from 'react-native'
import { Shadow, Text } from '..'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { innerShadow, mildShadow } from '../../utils/layout'
import { round } from '../../utils/math'
import Icon from '../Icon'

const SliderToolTip = ({ children }: ComponentProps): ReactElement => (
  <Shadow shadow={mildShadow} style={tw`absolute py-2 rounded-lg bottom-10 bg-primary-background-light`}>
    <Text style={tw`w-16 font-semibold text-center`}>{children}</Text>
  </Shadow>
)
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

export const PremiumSlider = ({ value, onChange, style }: PremiumSliderProps): ReactElement => {
  const [isSliding, setIsSliding] = useState(false)
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
        setIsSliding(true)
        Animated.event([null, { dx: pan }], { useNativeDriver: false })(e, gestureState)
      },
      onPanResponderRelease: (e, gestureState) => {
        setIsSliding(false)
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

  useEffect(() => {
    if (!isSliding) onChange(premium)
  }, [isSliding, onChange, premium])

  const onLayout = (event: LayoutChangeEvent) => setTrackWidth(event.nativeEvent.layout.width)

  return (
    <View>
      <View {...panResponder.panHandlers} style={[tw`w-full max-w-full rounded-full bg-primary-background-dark`, style]}>
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
              {isSliding && <SliderToolTip>{premium}%</SliderToolTip>}
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
