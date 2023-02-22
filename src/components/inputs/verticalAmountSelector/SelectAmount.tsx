import React, { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, View } from 'react-native'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { getTranslateY } from '../../../utils/layout'
import { interpolate, round } from '../../../utils/math'
import { BitcoinPrice } from '../../bitcoin'
import { SatsFormat } from '../../text'
import { ToolTip } from '../../ui/ToolTip'
import Input from '../Input'
import { createPanResponder } from './helpers/createPanResponder'
import { onStartShouldSetResponder } from './helpers/onStartShouldSetResponder'
import { panListener } from './helpers/panListener'
import { useKnobHeight } from './hooks/useKnobHeight'

import { SliderKnob } from './SliderKnob'
import { SliderTrack } from './SliderTrack'
import { TrackMarkers } from './TrackMarkers'

const labels = { 0: i18n('custom'), 1: i18n('max'), 9: i18n('min') }

type RangeAmountProps = ComponentProps & {
  min: number
  max: number
  value: number
  onChange: (value: number) => void
}

export const SelectAmount = ({ min, max, value, onChange, style }: RangeAmountProps): ReactElement => {
  const knobHeight = useKnobHeight()
  const trackHeight = knobHeight * 10

  const [custom, setCustom] = useState(false)
  const [amount, setAmount] = useState(value)
  const y = interpolate(amount, [min, max], [trackHeight, 0])
  const trackRange: [number, number] = useMemo(() => [knobHeight, trackHeight - knobHeight], [knobHeight, trackHeight])

  const pan = useRef(new Animated.Value(y)).current
  const panResponder = useRef(createPanResponder(pan)).current

  const updateAmount = useCallback(
    (val: number) => {
      if (val === max + 1) {
        setCustom(true)
        return
      }
      setCustom(false)

      setAmount(round(val, -4))
    },
    [max],
  )

  const clearCustomAmount = () => setAmount(0)
  const updateCustomAmount = (val: string) => {
    const num = Number(val)
    if (isNaN(num)) {
      setAmount(min)
    } else {
      setAmount(Math.max(0, Math.min(max, num)))
    }
  }
  useEffect(() => panListener(pan, [max + 1, min], trackRange, updateAmount), [max, min, pan, trackRange, updateAmount])

  useEffect(() => {
    onChange(amount)
  }, [onChange, amount])

  useEffect(() => {
    pan.extractOffset()
  }, [pan])

  return (
    <View style={[tw`items-end w-[210px] pr-5`, style]}>
      <SliderTrack style={{ height: trackHeight }}>
        <TrackMarkers {...{ trackHeight, labels }} />
        <Animated.View
          {...panResponder.panHandlers}
          {...{ onStartShouldSetResponder }}
          style={[tw`absolute top-0 flex-row items-center`, !custom && getTranslateY(pan, trackRange)]}
        >
          <SliderKnob />
          {custom ? (
            <ToolTip style={tw`absolute right-8 w-[175px]`}>
              <View style={tw`absolute top-0 left-0 right-0 z-10`}>
                <Input
                  style={[tw`w-full h-20 p-0 text-xl`, { opacity: 0.01 }]}
                  inputStyle={tw`h-20 p-0 text-3xl`}
                  keyboardType="number-pad"
                  value={value.toString()}
                  onChange={updateCustomAmount}
                  onFocus={clearCustomAmount}
                />
              </View>
              <View style={tw`p-1 border rounded-lg border-black-4`}>
                <SatsFormat sats={amount} />
              </View>
              <BitcoinPrice sats={amount} style={tw`mt-1 ml-4 body-s text-black-3`} />
            </ToolTip>
          ) : (
            <ToolTip style={tw`absolute right-8 w-[165px]`}>
              <SatsFormat sats={amount} />
              <BitcoinPrice sats={amount} style={tw`ml-4 body-s text-black-3`} />
            </ToolTip>
          )}
        </Animated.View>
      </SliderTrack>
    </View>
  )
}
