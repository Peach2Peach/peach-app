import { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, View } from 'react-native'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { getTranslateY } from '../../../utils/layout'
import { round } from '../../../utils/math'
import { ParsedPeachText } from '../../text'
import { CustomAmount } from './CustomAmount'
import { SliderKnob } from './SliderKnob'
import { SliderTrack } from './SliderTrack'
import { TrackMarkers } from './TrackMarkers'
import { createPanResponder } from './helpers/createPanResponder'
import { getOffset } from './helpers/getOffset'
import { knobLayout } from './helpers/knobLayout'
import { onStartShouldSetResponder } from './helpers/onStartShouldSetResponder'
import { panListener } from './helpers/panListener'
import { useKnobHeight } from './hooks/useKnobHeight'

type RangeAmountProps = ComponentProps & {
  min: number
  max: number
  value: number
  onChange: (value: number) => void
}

export const SelectAmount = ({ min, max, value, onChange, style }: RangeAmountProps): ReactElement => {
  const knobHeight = useKnobHeight()
  const [trackHeight, setTrackHeight] = useState(260)
  const knobTrackHeight = trackHeight - knobHeight

  const [amount, setAmount] = useState(value)
  const trackRange: [number, number] = useMemo(() => [0, knobTrackHeight], [knobTrackHeight])

  const pan = useRef(new Animated.Value(getOffset({ amount, min, max, trackHeight: knobTrackHeight }))).current
  const panResponder = useRef(createPanResponder(pan)).current

  const setKnobOffset = useCallback(
    (newAmount: number) => {
      pan.setOffset(getOffset({ amount: newAmount, min, max, trackHeight: knobTrackHeight }))
    },
    [knobTrackHeight, max, min, pan],
  )
  const onTrackLayout = (event: LayoutChangeEvent) => {
    const height = Math.round(event.nativeEvent.layout.height)
    if (!height) return

    setTrackHeight(height)
    pan.setOffset(getOffset({ amount: value, min, max, trackHeight: height - knobHeight }))
  }
  const updateAmount = useCallback((val: number) => {
    setAmount(round(val, -4))
  }, [])

  const updateCustomAmount = (customAmount: number) => {
    const newAmount = Math.max(0, Math.min(max, customAmount))
    setAmount(newAmount)
    setKnobOffset(newAmount)
  }
  useEffect(() => panListener(pan, [max, min], trackRange, updateAmount), [max, min, pan, trackRange, updateAmount])

  useEffect(() => {
    onChange(amount)
  }, [onChange, amount, setKnobOffset])

  useEffect(() => {
    pan.extractOffset()
  }, [pan])

  return (
    <View style={[tw`flex-row items-center justify-between pl-5 pr-4`, style]}>
      <View style={[tw`flex-shrink items-start gap-2`, tw.md`gap-4`]}>
        <ParsedPeachText
          style={[tw`h7`, tw.md`h5`]}
          parse={[{ pattern: new RegExp(i18n('sell.subtitle.highlight'), 'u'), style: tw`text-primary-main` }]}
        >
          {i18n('sell.subtitle')}
        </ParsedPeachText>
        <CustomAmount
          {...{
            amount,
            onChange: updateCustomAmount,
          }}
          style={tw`flex-shrink items-start`}
        />
      </View>
      <SliderTrack style={tw`h-full`} onLayout={onTrackLayout}>
        <TrackMarkers />
        <Animated.View
          {...panResponder.panHandlers}
          {...{ onStartShouldSetResponder }}
          style={[knobLayout, getTranslateY(pan, trackRange)]}
        >
          <SliderKnob />
        </Animated.View>
      </SliderTrack>
    </View>
  )
}
