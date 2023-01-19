import React, { Dispatch, ReactElement, SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, PanResponder, View } from 'react-native'
import tw from '../../styles/tailwind'
import { getTranslateY, innerShadow } from '../../utils/layout'
import { interpolate, round } from '../../utils/math'
import Icon from '../Icon'
import { Text } from '../text'
import { Shadow } from '../ui'

type RangeAmountProps = ComponentProps & {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
}
const KNOBHEIGHT = tw`h-8`.height as number

const SliderKnob = ({ style }: ComponentProps) => (
  <View style={[{ height: KNOBHEIGHT }, tw`items-center justify-center w-5 rounded-full bg-primary-main`, style]}>
    <Icon id="chevronsRight" style={tw`w-4 h-4`} color={tw`text-primary-background-light`.color} />
  </View>
)

const createPanResponder = (pan: Animated.Value, setIsSliding: Dispatch<SetStateAction<boolean>>) =>
  PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      setIsSliding(true)
      Animated.event([null, { dy: pan }], { useNativeDriver: false })(e, gestureState)
    },
    onPanResponderRelease: () => {
      setIsSliding(false)
      pan.extractOffset()
    },
    onShouldBlockNativeResponder: () => true,
  })

const onStartShouldSetResponder = () => true

/**
 * @description Component to display a range selection
 * @example
 * <RangeAmount
    min={100000}
    max={2500000}
    value={selectedRange}
    onChange={setSelectedRange}
 */
export const RangeAmount = ({ min, max, value, onChange, style }: RangeAmountProps): ReactElement => {
  const delta = max - min
  const [trackHeight, setTrackHeight] = useState(260)
  const [isMinSliding, setIsMinSliding] = useState(false)
  const [isMaxSliding, setIsMaxSliding] = useState(false)
  const [minimum, setMinimum] = useState(value[0])
  const [maximum, setMaximum] = useState(value[1])
  const minY = interpolate(minimum, [min, max], [0, trackHeight])
  const maxY = interpolate(maximum, [min, max], [0, trackHeight])
  const trackRangeMin: [number, number] = useMemo(() => [0, Math.max(0, maxY - KNOBHEIGHT)], [maxY])
  const trackRangeMax: [number, number] = useMemo(
    () => [Math.min(minY + KNOBHEIGHT, trackHeight), trackHeight],
    [minY, trackHeight],
  )
  const rangeHeight = maxY - minY
  const panMin = useRef(new Animated.Value(minY)).current
  const panMax = useRef(new Animated.Value(maxY)).current
  const panMinResponder = useRef(createPanResponder(panMin, setIsMinSliding)).current
  const panMaxResponder = useRef(createPanResponder(panMax, setIsMaxSliding)).current

  useEffect(() => {
    panMin.extractOffset()
    panMin.addListener((props) => {
      let v = props.value
      if (v < trackRangeMin[0]) {
        v = trackRangeMin[0]
      } else if (v > trackRangeMin[1]) {
        v = trackRangeMin[1]
      }
      if (v !== props.value) panMin.setOffset(v)

      const val = interpolate(v, [0, trackHeight], [min, max])
      setMinimum(round(val, -4))
    })

    return () => panMin.removeAllListeners()
  }, [delta, max, maxY, min, panMin, trackHeight, trackRangeMin])

  useEffect(() => {
    panMax.extractOffset()
    panMax.addListener((props) => {
      let v = props.value
      if (v < trackRangeMax[0]) {
        v = trackRangeMax[0]
      } else if (v > trackRangeMax[1]) {
        v = trackRangeMax[1]
      }
      if (v !== props.value) panMax.setOffset(v)

      const val = interpolate(v, [0, trackHeight], [min, max])
      setMaximum(round(val, -4))
    })

    return () => panMax.removeAllListeners()
  }, [delta, minY, min, max, panMax, trackHeight, trackRangeMax])

  useEffect(() => {
    onChange([minimum, maximum])
  }, [onChange, minimum, maximum])

  const onLayout = (event: LayoutChangeEvent) => setTrackHeight(event.nativeEvent.layout.height - KNOBHEIGHT)

  return (
    <View style={style} {...{ onStartShouldSetResponder }}>
      <View style={tw`w-6 h-full overflow-hidden rounded-full bg-primary-background-dark`}>
        <Shadow shadow={innerShadow} style={tw`w-full p-0.5 h-full rounded-full`}>
          <View style={tw`h-full`} {...{ onLayout }}>
            <Animated.View
              style={[
                tw`absolute left-0 right-0 bg-primary-mild-2`,
                { height: rangeHeight, top: KNOBHEIGHT / 2 },
                getTranslateY(panMin, trackRangeMin),
              ]}
            />
            <Animated.View
              {...panMinResponder.panHandlers}
              {...{ onStartShouldSetResponder }}
              style={[tw`absolute top-0`, getTranslateY(panMin, trackRangeMin)]}
            >
              <SliderKnob />
            </Animated.View>

            <Animated.View
              {...panMaxResponder.panHandlers}
              {...{ onStartShouldSetResponder }}
              style={[tw`absolute top-0`, getTranslateY(panMax, trackRangeMax)]}
            >
              <SliderKnob />
            </Animated.View>
          </View>
        </Shadow>
      </View>
      <Text>{value.join('-')}</Text>
    </View>
  )
}
