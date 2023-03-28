import { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { useKnobHeight } from './hooks/useKnobHeight'
import { SliderKnob } from './SliderKnob'
import { SliderTrack } from './SliderTrack'
import { TrackMarkers } from './TrackMarkers'

type RangeAmountProps = ComponentProps & {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
}

export const RangeAmount = ({ min, max, value, onChange, style }: RangeAmountProps): ReactElement => {
  const knobHeight = useKnobHeight()
  const trackHeight = knobHeight * 10
  const knobTrackHeight = trackHeight - knobHeight

  const [maximum, setMaximum] = useState(value[1])
  const [minimum, setMinimum] = useState(value[0])
  const maxY = useMemo(
    () => interpolate(maximum, [max, min], [0, knobTrackHeight]),
    [knobTrackHeight, max, maximum, min],
  )
  const minY = useMemo(
    () => interpolate(minimum, [max, min], [0, knobTrackHeight]),
    [knobTrackHeight, max, min, minimum],
  )
  const trackRange: [number, number] = useMemo(() => [0, knobTrackHeight], [knobTrackHeight])
  const trackRangeMax: [number, number] = useMemo(() => [0, knobTrackHeight - knobHeight], [knobHeight, knobTrackHeight])
  const trackRangeMin: [number, number] = useMemo(() => [knobHeight, knobTrackHeight], [knobHeight, knobTrackHeight])
  const rangeHeight = minY - maxY
  const minSatsDistance = useMemo(
    () => round(interpolate(knobHeight, [0, knobTrackHeight], [0, max - min]), -4),
    [knobHeight, knobTrackHeight, max, min],
  )
  const panMax = useRef(new Animated.Value(maxY)).current
  const panMin = useRef(new Animated.Value(minY)).current

  const panMaxResponder = useRef(createPanResponder(panMax)).current
  const panMinResponder = useRef(createPanResponder(panMin)).current

  const setMaximumRounded = useCallback(
    (val: number, abs: number) => {
      const roundedVal = round(val, -4)

      if (roundedVal - minimum < minSatsDistance) {
        panMin.setOffset(abs + knobHeight)
        setMinimum(roundedVal - minSatsDistance)
      }
      setMaximum(roundedVal)
    },
    [knobHeight, minSatsDistance, minimum, panMin],
  )

  const setMinimumRounded = useCallback(
    (val: number, abs: number) => {
      const roundedVal = round(val, -4)

      if (maximum - roundedVal < minSatsDistance) {
        panMax.setOffset(abs - knobHeight)
        setMaximum(roundedVal + minSatsDistance)
      }
      setMinimum(roundedVal)
    },
    [knobHeight, minSatsDistance, maximum, panMax],
  )

  useEffect(
    () => panListener(panMax, [max, min], trackRange, setMaximumRounded, trackRangeMax),
    [max, min, panMax, setMaximumRounded, trackRange, trackRangeMax],
  )
  useEffect(
    () => panListener(panMin, [max, min], trackRange, setMinimumRounded, trackRangeMin),
    [max, min, panMin, setMinimumRounded, trackRange, trackRangeMin],
  )

  useEffect(() => {
    onChange([minimum, maximum])
  }, [onChange, minimum, maximum])

  useEffect(() => {
    panMin.extractOffset()
    panMax.extractOffset()
  }, [panMin, panMax])

  return (
    <View style={[tw`items-end w-[210px] pr-5`, style]}>
      <SliderTrack style={{ height: trackHeight }}>
        <TrackMarkers {...{ trackHeight }} labels={{ 0: i18n('max'), 9: i18n('min') }} />
        <Animated.View
          style={[
            tw`absolute left-0 right-0 opacity-50 bg-primary-main`,
            { height: rangeHeight, top: knobHeight / 2 },
            getTranslateY(panMax, trackRangeMax),
          ]}
        />
        <Animated.View
          {...panMaxResponder.panHandlers}
          {...{ onStartShouldSetResponder }}
          style={[tw`absolute top-0 flex-row items-center`, getTranslateY(panMax, trackRangeMax)]}
        >
          <SliderKnob />
          <ToolTip style={tw`absolute right-8 w-[165px]`}>
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
          <ToolTip style={tw`absolute right-8 w-[165px]`}>
            <SatsFormat sats={minimum} />
            <BitcoinPrice sats={minimum} style={tw`ml-4 body-s text-black-3`} />
          </ToolTip>
        </Animated.View>
      </SliderTrack>
    </View>
  )
}
