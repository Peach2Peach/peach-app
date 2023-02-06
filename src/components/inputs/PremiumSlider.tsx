import React, { ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, PanResponder, View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { getTranslateX } from '../../utils/layout'
import { round } from '../../utils/math'
import Icon from '../Icon'
import { SliderLabel } from './SliderLabel'

type PremiumSliderProps = ComponentProps & {
  value: number
  onChange: (value: number) => void
}

const MIN = -21
const MAX = 21
const DELTA = MAX - MIN
const KNOBWIDTH = tw`w-8`.width as number

const onStartShouldSetResponder = () => true

export const PremiumSlider = ({ value, onChange, style }: PremiumSliderProps): ReactElement => {
  const [isSliding, setIsSliding] = useState(false)
  const [premium, setPremium] = useState(value)
  const [trackWidth, setTrackWidth] = useState(260)
  const labelPosition = useMemo(
    () => ({
      minus21: -trackWidth / 2,
      minus10: round((11 / DELTA) * trackWidth) - trackWidth / 2,
      zero: 0,
      plus10: round((32 / DELTA) * trackWidth) - trackWidth / 2,
      plus21: trackWidth - trackWidth / 2,
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
      onPanResponderRelease: () => {
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
    if (isSliding || isNaN(value)) return
    pan.setOffset(((value - MIN) / DELTA) * trackWidth)
  }, [isSliding, pan, trackWidth, value])

  useEffect(() => {
    if (!isSliding) return
    onChange(premium)
  }, [isSliding, onChange, premium])

  const onLayout = (event: LayoutChangeEvent) => {
    const newTrackWidth = event.nativeEvent.layout.width - KNOBWIDTH
    pan.setOffset(((value - MIN) / DELTA) * newTrackWidth)
    setTrackWidth(newTrackWidth)
  }

  return (
    <View style={style} {...panResponder.panHandlers} {...{ onStartShouldSetResponder }}>
      <View style={[tw`w-full max-w-full border rounded-full bg-primary-background-dark border-primary-mild-1`]}>
        <View {...{ onLayout }} style={tw`w-full p-0.5 rounded overflow-hidden`}>
          <Animated.View
            style={[
              { width: KNOBWIDTH },
              tw`z-10 flex items-center rounded-full bg-primary-main`,
              getTranslateX(pan, [0, trackWidth]),
            ]}
          >
            <Icon id="chevronsDown" style={tw`w-4 h-4`} color={tw`text-primary-background-light`.color} />
          </Animated.View>
        </View>
      </View>
      <View style={tw`w-full h-10 mt-1`}>
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
