import { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, View } from 'react-native'
import { SATSINBTC } from '../../../constants'
import { useBitcoinPrices } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { getTranslateY } from '../../../utils/layout'
import { round } from '../../../utils/math'
import { PriceFormat, SatsFormat } from '../../text'
import Input from '../Input'
import { SliderKnob } from './SliderKnob'
import { SliderTrack } from './SliderTrack'
import { TrackMarkers } from './TrackMarkers'
import { createPanResponder } from './helpers/createPanResponder'
import { getOffset } from './helpers/getOffset'
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
  const { displayPrice, displayCurrency, fullDisplayPrice } = useBitcoinPrices({ sats: value })

  const [amount, setAmount] = useState(value)
  const [customFiatPrice, setCustomFiatPrice] = useState<number>()
  const trackRange: [number, number] = useMemo(() => [0, trackHeight - knobHeight], [knobHeight, trackHeight])

  const pan = useRef(new Animated.Value(getOffset({ amount, min, max, trackHeight }))).current
  const panResponder = useRef(createPanResponder(pan)).current

  const setKnobOffset = useCallback(
    (newAmount: number) => pan.setOffset(getOffset({ amount: newAmount, min, max, trackHeight })),
    [max, min, pan, trackHeight],
  )
  const onTrackLayout = (event: LayoutChangeEvent) => {
    const height = Math.round(event.nativeEvent.layout.height)
    setTrackHeight(height)
  }
  const updateAmount = useCallback((val: number) => {
    setAmount(round(val, -4))
  }, [])

  const clearCustomAmount = () => {
    setAmount(0)
    setCustomFiatPrice(undefined)
  }
  const updateCustomAmount = (val: string) => {
    const num = Number(val)
    if (isNaN(num)) {
      setAmount(min)
    } else {
      setAmount(Math.max(0, Math.min(max, num)))
    }
    setKnobOffset(num)
  }
  const updateCustomFiatAmount = (val: string) => {
    const num = Number(val)
    let newAmount = amount
    if (isNaN(num)) {
      setCustomFiatPrice(undefined)
    } else {
      newAmount = round((num / fullDisplayPrice) * SATSINBTC)
      setAmount(Math.max(0, Math.min(max, newAmount)))
      setCustomFiatPrice(num)
    }
    onChange(newAmount)
    setKnobOffset(newAmount)
  }
  useEffect(() => panListener(pan, [max, min], trackRange, updateAmount), [max, min, pan, trackRange, updateAmount])

  useEffect(() => {
    setCustomFiatPrice(undefined)
    onChange(amount)
  }, [onChange, amount, setKnobOffset])

  useEffect(() => {
    pan.extractOffset()
  }, [pan])

  return (
    <View style={[tw`flex-row items-center justify-between pl-5 pr-4`, style]}>
      <View style={tw`flex-shrink items-start gap-2`}>
        <View style={tw`h-8`}>
          <View style={tw`px-3 h-8 justify-center border rounded-full border-black-4 absolute w-[210px]`}>
            <SatsFormat sats={amount} style={tw`text-lg`} satsStyle={tw`font-bold`} />
          </View>
          <Input
            style={[tw`w-full h-8 p-0 text-xl `, { opacity: 0 }]}
            keyboardType="number-pad"
            value={amount.toString()}
            onChange={updateCustomAmount}
            onFocus={clearCustomAmount}
          />
        </View>
        <View>
          <View style={tw`pl-3 pr-4 h-8 justify-center border rounded-full border-black-4 absolute `}>
            <PriceFormat
              amount={customFiatPrice || displayPrice}
              currency={displayCurrency}
              style={tw`font-courier-prime text-lg text-black-1`}
            />
          </View>
          <Input
            style={[tw`w-full h-8 p-0 text-xl `, { opacity: 0 }]}
            keyboardType="number-pad"
            value={(customFiatPrice || displayPrice).toString()}
            onChange={updateCustomFiatAmount}
            onFocus={clearCustomAmount}
          />
        </View>
      </View>

      <SliderTrack style={tw`h-full`} onLayout={onTrackLayout}>
        <TrackMarkers />
        <Animated.View
          {...panResponder.panHandlers}
          {...{ onStartShouldSetResponder }}
          style={[tw`absolute top-0 flex-row items-center`, getTranslateY(pan, trackRange)]}
        >
          <SliderKnob />
        </Animated.View>
      </SliderTrack>
    </View>
  )
}
