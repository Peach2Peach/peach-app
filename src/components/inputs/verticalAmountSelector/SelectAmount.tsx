import React, { Dispatch, ReactElement, SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, PanResponder, View } from 'react-native'
import tw from '../../../styles/tailwind'
import { getTranslateY, innerShadow } from '../../../utils/layout'
import { interpolate, round } from '../../../utils/math'
import { Text } from '../../text'
import { Shadow } from '../../ui'
import { createPanResponder } from './helpers/createPanResponder'
import { onStartShouldSetResponder } from './helpers/onStartShouldSetResponder'

import { KNOBHEIGHT, SliderKnob } from './SliderKnob'
import { SliderTrack } from './SliderTrack'

type RangeAmountProps = ComponentProps & {
  min: number
  max: number
  value: number
  onChange: (value: number) => void
}

export const SelectAmount = ({ min, max, value, onChange, style }: RangeAmountProps): ReactElement => {
  const delta = max - min
  const [trackHeight, setTrackHeight] = useState(260)
  const [isSliding, setIsSliding] = useState(false)
  const [amount, setAmount] = useState(value)
  const y = interpolate(amount, [min, max], [0, trackHeight])
  const trackRange: [number, number] = useMemo(() => [0, trackHeight], [trackHeight])

  const pan = useRef(new Animated.Value(y)).current
  const panResponder = useRef(createPanResponder(pan, setIsSliding)).current

  useEffect(() => {
    pan.extractOffset()
    pan.addListener((props) => {
      let v = props.value
      if (v < trackRange[0]) {
        v = trackRange[0]
      } else if (v > trackRange[1]) {
        v = trackRange[1]
      }
      if (v !== props.value) pan.setOffset(v)

      const val = interpolate(v, [0, trackHeight], [min, max])
      setAmount(round(val, -4))
    })

    return () => pan.removeAllListeners()
  }, [delta, max, min, pan, trackHeight, trackRange])

  useEffect(() => {
    onChange(amount)
  }, [onChange, amount])

  const onLayout = (event: LayoutChangeEvent) => setTrackHeight(event.nativeEvent.layout.height - KNOBHEIGHT)

  return (
    <View style={style} {...{ onStartShouldSetResponder }}>
      <SliderTrack {...{ onLayout }}>
        <Animated.View
          {...panResponder.panHandlers}
          {...{ onStartShouldSetResponder }}
          style={[tw`absolute top-0`, getTranslateY(pan, trackRange)]}
        >
          <SliderKnob />
        </Animated.View>
      </SliderTrack>
      <Text>{value}</Text>
    </View>
  )
}
