import { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, View } from 'react-native'
import { SATSINBTC } from '../../../constants'
import { useBitcoinPrices } from '../../../hooks'
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
    if (!height) return

    setTrackHeight(height)
    pan.setOffset(getOffset({ amount: value, min, max, trackHeight: height }))
  }
  const updateAmount = useCallback((val: number) => {
    setAmount(round(val, -4))
  }, [])

  const updateCustomAmount = (customAmount: number) => {
    setAmount(Math.max(0, Math.min(max, customAmount)))
    setKnobOffset(customAmount)
  }
  const updateCustomFiatAmount = (fiatAmount: number) => {
    let newAmount = amount
    newAmount = round((fiatAmount / fullDisplayPrice) * SATSINBTC)
    setAmount(Math.max(0, Math.min(max, newAmount)))
    setCustomFiatPrice(fiatAmount)
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
            setAmount: updateCustomAmount,
            fiatPrice: customFiatPrice || displayPrice,
            setCustomFiatPrice: updateCustomFiatAmount,
            bitcoinPrice: fullDisplayPrice,
            displayCurrency,
          }}
          style={tw`flex-shrink items-start`}
        />
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
