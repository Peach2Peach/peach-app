import React, { ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, View } from 'react-native'
import tw from '../../../styles/tailwind'
import { getTranslateY } from '../../../utils/layout'
import { interpolate, round } from '../../../utils/math'
import { Text } from '../../text'
import { createPanResponder } from './helpers/createPanResponder'
import { onStartShouldSetResponder } from './helpers/onStartShouldSetResponder'
import { KNOBHEIGHT, SliderKnob } from './SliderKnob'
import { SliderTrack } from './SliderTrack'
import { TrackMarkers } from './TrackMarkers'

type RangeAmountProps = ComponentProps & {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
}

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
    <View style={[tw`items-end`, style]} {...{ onStartShouldSetResponder }}>
      <SliderTrack {...{ onLayout }}>
        <TrackMarkers {...{ trackHeight }} />
        <Animated.View
          style={[
            tw`absolute left-0 right-0 opacity-50 bg-primary-main`,
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
      </SliderTrack>
      <Text>{value.join('-')}</Text>
    </View>
  )
}
