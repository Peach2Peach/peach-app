import React, { ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, View } from 'react-native'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { getTranslateY } from '../../../utils/layout'
import { interpolate, round } from '../../../utils/math'
import { BitcoinPrice } from '../../bitcoin'
import { SatsFormat } from '../../text'
import { ToolTip } from '../../ui/ToolTip'
import { createPanResponder } from './helpers/createPanResponder'
import { onStartShouldSetResponder } from './helpers/onStartShouldSetResponder'
import { panListener } from './helpers/panListener'
import { KNOBHEIGHT, SliderKnob } from './SliderKnob'
import { SliderTrack } from './SliderTrack'
import { TrackMarkers } from './TrackMarkers'

const trackHeight = KNOBHEIGHT * 10
const knobTrackHeight = trackHeight - KNOBHEIGHT

type RangeAmountProps = ComponentProps & {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
}

export const RangeAmount = ({ min, max, value, onChange, style }: RangeAmountProps): ReactElement => {
  const [maximum, setMaximum] = useState(value[1])
  const [minimum, setMinimum] = useState(value[0])
  const maxY = interpolate(maximum, [max, min], [0, knobTrackHeight])
  const minY = interpolate(minimum, [max, min], [0, knobTrackHeight])
  const trackRange: [number, number] = useMemo(() => [0, knobTrackHeight], [])
  const trackRangeMax: [number, number] = useMemo(() => [0, Math.max(0, minY - KNOBHEIGHT)], [minY])
  const trackRangeMin: [number, number] = useMemo(
    () => [Math.min(maxY + KNOBHEIGHT, knobTrackHeight), knobTrackHeight],
    [maxY],
  )
  const rangeHeight = minY - maxY
  const panMax = useRef(new Animated.Value(maxY)).current
  const panMin = useRef(new Animated.Value(minY)).current

  const panMaxResponder = useRef(createPanResponder(panMax)).current
  const panMinResponder = useRef(createPanResponder(panMin)).current

  useEffect(
    () => panListener(panMax, [max, min], trackRange, setMaximum, trackRangeMax),
    [max, min, panMax, trackRange, trackRangeMax],
  )
  useEffect(
    () => panListener(panMin, [max, min], trackRange, setMinimum, trackRangeMin),
    [max, min, panMin, trackRange, trackRangeMin],
  )

  useEffect(() => {
    onChange([minimum, maximum])
  }, [onChange, minimum, maximum])

  return (
    <View style={[tw`items-end`, style]} {...{ onStartShouldSetResponder }}>
      <SliderTrack style={{ height: trackHeight }}>
        <TrackMarkers {...{ trackHeight }} labels={{ 0: i18n('max'), 9: i18n('min') }} />
        <Animated.View
          style={[
            tw`absolute left-0 right-0 opacity-50 bg-primary-main`,
            { height: rangeHeight, top: KNOBHEIGHT / 2 },
            getTranslateY(panMax, trackRangeMax),
          ]}
        />
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
      </SliderTrack>
    </View>
  )
}
