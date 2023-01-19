import React, { ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, View } from 'react-native'
import tw from '../../../styles/tailwind'
import { getTranslateY } from '../../../utils/layout'
import { interpolate, round } from '../../../utils/math'
import { BitcoinPrice } from '../../bitcoin'
import { PriceFormat, SatsFormat, Text } from '../../text'
import { ToolTip } from '../../ui/ToolTip'
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
  const panMinResponder = useRef(createPanResponder(panMin)).current
  const panMaxResponder = useRef(createPanResponder(panMax)).current

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
          style={[tw`absolute top-0 flex-row items-center`, getTranslateY(panMin, trackRangeMin)]}
        >
          <SliderKnob />
          <ToolTip style={tw`absolute px-3 py-2 right-10 w-[165px]`}>
            <SatsFormat sats={minimum} />
            <BitcoinPrice sats={minimum} style={tw`ml-4 body-s text-black-3`} />
          </ToolTip>
        </Animated.View>

        <Animated.View
          {...panMaxResponder.panHandlers}
          {...{ onStartShouldSetResponder }}
          style={[tw`absolute top-0 flex-row items-center`, getTranslateY(panMax, trackRangeMax)]}
        >
          <SliderKnob />
          <ToolTip style={tw`absolute px-3 py-2 right-10 w-[165px]`}>
            <SatsFormat sats={maximum} />
            <BitcoinPrice sats={maximum} style={tw`ml-4 body-s text-black-3`} />
          </ToolTip>
        </Animated.View>
      </SliderTrack>
    </View>
  )
}
