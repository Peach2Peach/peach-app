import { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, PanResponder, View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { useOfferPreferences } from '../../../store/offerPreferenes/useOfferPreferences'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { getTranslateX } from '../../../utils/layout'
import { round } from '../../../utils/math'
import Icon from '../../Icon'
import { SliderLabel } from './SliderLabel'
import { SliderMarkers } from './SliderMarkers'

const MIN = -21
const MAX = 21
const DELTA = MAX - MIN
const KNOBWIDTH = tw`w-8`.width as number

const onStartShouldSetResponder = () => true

export const PremiumSlider = ({ style }: ComponentProps) => {
  const [isSliding, setIsSliding] = useState(false)
  const [premium, setPremium] = useOfferPreferences((state) => [state.premium, state.setPremium], shallow)

  const [trackWidth, setTrackWidth] = useState(260)
  const labelPosition = useMemo(
    () => [
      -trackWidth / 2,
      round((11 / DELTA) * trackWidth) - trackWidth / 2,
      0,
      round((31 / DELTA) * trackWidth) - trackWidth / 2,
      trackWidth - trackWidth / 2,
    ],
    [trackWidth],
  )

  const pan = useRef(new Animated.Value(((premium - MIN) / DELTA) * trackWidth)).current

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
  }, [pan, setPremium, trackWidth])

  useEffect(() => {
    if (isSliding || isNaN(premium)) return
    pan.setOffset(((premium - MIN) / DELTA) * trackWidth)
  }, [isSliding, pan, trackWidth, premium])

  const onLayout = (event: LayoutChangeEvent) => {
    const newTrackWidth = event.nativeEvent.layout.width - KNOBWIDTH
    pan.setOffset(((premium - MIN) / DELTA) * newTrackWidth)
    setTrackWidth(newTrackWidth)
  }

  return (
    <View style={style} {...panResponder.panHandlers} {...{ onStartShouldSetResponder }}>
      <View
        style={[
          tw`w-full h-8`,
          tw`border p-0.5 rounded-full bg-primary-background-dark border-primary-mild-1`,
          tw`justify-center`,
        ]}
      >
        <SliderMarkers positions={labelPosition} />
        <View {...{ onLayout }}>
          <Animated.View
            style={[
              { width: KNOBWIDTH },
              tw`z-10 flex items-center justify-center h-full rounded-full bg-primary-main`,
              getTranslateX(pan, [0, trackWidth]),
            ]}
          >
            <Icon id="chevronsDown" style={tw`w-4`} color={tw`text-primary-background-light`.color} />
          </Animated.View>
        </View>
      </View>
      <View style={tw`w-full h-10 mt-1`}>
        <SliderLabel position={labelPosition[0]}>{MIN}%</SliderLabel>
        <SliderLabel position={labelPosition[1]}>{round(MIN / 2, -1)}%</SliderLabel>
        <SliderLabel position={labelPosition[2]}>{i18n('sell.premium.marketPrice')}</SliderLabel>
        <SliderLabel position={labelPosition[3]}>+{round(MAX / 2, -1)}%</SliderLabel>
        <SliderLabel position={labelPosition[4]}>+{MAX}%</SliderLabel>
      </View>
    </View>
  )
}

export default PremiumSlider
