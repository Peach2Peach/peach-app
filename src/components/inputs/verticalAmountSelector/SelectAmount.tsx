import React, { ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, View } from 'react-native'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { getTranslateY } from '../../../utils/layout'
import { interpolate, round } from '../../../utils/math'
import { BitcoinPrice } from '../../bitcoin'
import { SatsFormat, Text } from '../../text'
import { ToolTip } from '../../ui/ToolTip'
import Input from '../Input'
import { createPanResponder } from './helpers/createPanResponder'
import { onStartShouldSetResponder } from './helpers/onStartShouldSetResponder'
import { panListener } from './helpers/panListener'

import { KNOBHEIGHT, SliderKnob } from './SliderKnob'
import { SliderTrack } from './SliderTrack'
import { TrackMarkers } from './TrackMarkers'

const trackHeight = KNOBHEIGHT * 10
const labels = { 0: i18n('custom'), 1: i18n('max'), 9: i18n('min') }

type RangeAmountProps = ComponentProps & {
  min: number
  max: number
  value: number
  onChange: (value: number) => void
}

export const SelectAmount = ({ min, max, value, onChange, style }: RangeAmountProps): ReactElement => {
  const [custom, setCustom] = useState(false)
  const [amount, setAmount] = useState(value)
  const y = interpolate(amount, [min, max], [trackHeight, 0])
  const trackRange: [number, number] = useMemo(() => [KNOBHEIGHT, trackHeight - KNOBHEIGHT], [])

  const pan = useRef(new Animated.Value(y)).current
  const panResponder = useRef(createPanResponder(pan)).current

  const updateAmount = (val: number) => {
    if (val === max + 1) {
      setCustom(true)
      return
    }
    setCustom(false)

    setAmount(round(val, -4))
  }
  const updateCustomAmount = (val: string) => {
    const num = Number(val)
    if (isNaN(num)) {
      setAmount(min)
    } else {
      setAmount(Math.max(0, Math.min(max, num)))
    }
  }
  useEffect(() => panListener(pan, [max + 1, min], trackRange, updateAmount), [max, min, pan, trackRange])

  useEffect(() => {
    onChange(amount)
  }, [onChange, amount])

  return (
    <View style={[tw`items-end`, style]} {...{ onStartShouldSetResponder }}>
      <SliderTrack style={{ height: trackHeight }}>
        <TrackMarkers {...{ trackHeight, labels }} />
        <Animated.View
          {...panResponder.panHandlers}
          {...{ onStartShouldSetResponder }}
          style={[tw`absolute top-0 flex-row items-center`, !custom && getTranslateY(pan, trackRange)]}
        >
          <SliderKnob />
          {custom ? (
            <View style={tw`absolute w-[170px] right-10 top-8`}>
              <ToolTip style={tw`absolute px-3 py-2 w-[175px]`}>
                <View style={tw`absolute top-0 left-0 right-0 z-10`}>
                  <Input
                    style={tw`w-full h-10 opacity-0`}
                    keyboardType="number-pad"
                    {...{ value: value.toString(), onChange: updateCustomAmount }}
                  />
                </View>
                <View style={tw`p-1 border rounded-lg border-black-4`}>
                  <SatsFormat sats={amount} />
                </View>
                <BitcoinPrice sats={amount} style={tw`mt-1 ml-4 body-s text-black-3`} />
              </ToolTip>
            </View>
          ) : (
            <ToolTip style={tw`absolute px-3 py-2 right-10 w-[165px]`}>
              <SatsFormat sats={amount} />
              <BitcoinPrice sats={amount} style={tw`ml-4 body-s text-black-3`} />
            </ToolTip>
          )}
        </Animated.View>
      </SliderTrack>
    </View>
  )
}
