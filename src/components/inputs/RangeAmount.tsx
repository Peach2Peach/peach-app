import React, { Dispatch, ReactElement, SetStateAction, useEffect, useRef, useState } from 'react'
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
  const rangeHeight = maxY - minY
  const panMin = useRef(new Animated.Value(minY)).current
  const panMax = useRef(new Animated.Value(maxY)).current
  const panMinResponder = useRef(createPanResponder(panMin, setIsMinSliding)).current
  const panMaxResponder = useRef(createPanResponder(panMax, setIsMaxSliding)).current

  useEffect(() => {
    panMin.extractOffset()
    panMin.addListener((props) => {
      if (props.value < 0) {
        panMin.setOffset(0)
      } else if (props.value > maxY) {
        panMin.setOffset(maxY)
      } else if (props.value > trackHeight) {
        panMin.setOffset(trackHeight)
      }

      const boundedY = props.value < 0 ? 0 : Math.min(props.value, trackHeight)
      const val = round((boundedY / trackHeight) * delta + min, -4)
      setMinimum(val)
    })

    return () => panMin.removeAllListeners()
  }, [delta, maxY, min, panMin, trackHeight])

  useEffect(() => {
    panMax.extractOffset()
    panMax.addListener((props) => {
      if (props.value < 0) {
        panMax.setOffset(0)
      } else if (props.value < minY) {
        panMax.setOffset(minY)
      } else if (props.value > trackHeight) {
        panMax.setOffset(trackHeight)
      }

      const boundedY = props.value < 0 ? 0 : Math.min(props.value, trackHeight)
      const val = round((boundedY / trackHeight) * delta + min, -4)
      setMaximum(val)
    })

    return () => panMax.removeAllListeners()
  }, [delta, minY, min, panMax, trackHeight])

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
                getTranslateY(panMin, trackHeight),
              ]}
            />
            <Animated.View
              {...panMinResponder.panHandlers}
              {...{ onStartShouldSetResponder }}
              style={[tw`absolute top-0`, getTranslateY(panMin, trackHeight)]}
            >
              <SliderKnob />
            </Animated.View>

            <Animated.View
              {...panMaxResponder.panHandlers}
              {...{ onStartShouldSetResponder }}
              style={[tw`absolute top-0`, getTranslateY(panMax, trackHeight)]}
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
