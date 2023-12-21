import { useRef, useState } from 'react'
import { GestureResponderEvent, NativeSyntheticEvent, TextInput, TextInputEndEditingEventData, View } from 'react-native'
import { PeachText } from '../../../components/text/PeachText'
import { useMarketPrices } from '../../../hooks/query/useMarketPrices'
import { useBitcoinPrices } from '../../../hooks/useBitcoinPrices'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { getTradingAmountLimits } from '../../../utils/market/getTradingAmountLimits'
import { trackMin } from '../utils/constants'
import { enforceDigitFormat } from '../utils/enforceDigitFormat'
import { useAmountInBounds } from '../utils/useAmountInBounds'
import { useRestrictSatsAmount } from '../utils/useRestrictSatsAmount'
import { useTrackWidth } from '../utils/useTrackWidth'
import { useTradingAmountLimits } from '../utils/useTradingAmountLimits'
import { SatsInputComponent } from './SatsInputComponent'
import { Section, sectionContainerGap } from './Section'
import { Slider, sliderWidth } from './Slider'
import { SliderTrack } from './SliderTrack'

type Props = {
  setIsSliding: (isSliding: boolean) => void
  range: [number, number]
  setRange: (newRange: [number, number]) => void
}

export function AmountSelectorComponent ({ setIsSliding, range: [min, max], setRange }: Props) {
  const trackWidth = useTrackWidth()
  const minSliderDeltaAsAmount = useMinSliderDeltaAsAmount(trackWidth)

  return (
    <Section.Container style={tw`bg-success-mild-1`}>
      <Section.Title>{i18n('offerPreferences.amountToBuy')}</Section.Title>
      <View style={tw`flex-row items-center gap-10px`}>
        <BuyAmountInput type="min" minAmountDelta={minSliderDeltaAsAmount} range={[min, max]} setRange={setRange} />
        <PeachText style={tw`subtitle-1`}>-</PeachText>
        <BuyAmountInput type="max" minAmountDelta={minSliderDeltaAsAmount} range={[min, max]} setRange={setRange} />
      </View>
      <SliderTrack
        slider={
          <AmountSliders setIsSliding={setIsSliding} trackWidth={trackWidth} range={[min, max]} setRange={setRange} />
        }
        trackWidth={trackWidth}
        type="buy"
      />
    </Section.Container>
  )
}
type SliderProps = {
  setIsSliding: (isSliding: boolean) => void
  trackWidth: number
  range: [number, number]
  setRange: (newRange: [number, number]) => void
}
function AmountSliders ({ setIsSliding, trackWidth, range: [min, max], setRange }: SliderProps) {
  const { data } = useMarketPrices()
  const [, maxLimit] = getTradingAmountLimits(data?.CHF || 0, 'buy')

  const trackMax = trackWidth - sliderWidth
  const trackDelta = trackMax - trackMin

  const getAmountInBounds = useAmountInBounds(trackWidth, 'buy')

  const maxTranslateX = (max / maxLimit) * trackDelta
  const minTranslateX = (min / maxLimit) * trackDelta

  const sliderDelta = maxTranslateX - minTranslateX
  const minSliderDeltaAsAmount = useMinSliderDeltaAsAmount(trackWidth)
  const onDrag
    = (type: 'min' | 'max') =>
      ({ nativeEvent: { pageX } }: GestureResponderEvent) => {
        const bounds
        = type === 'min' ? ([trackMin, trackMax - sliderWidth] as const) : ([trackMin + sliderWidth, trackMax] as const)
        const newAmount = getAmountInBounds(pageX, bounds)

        if (type === 'min') {
          const newMaxAmount = Math.max(newAmount + minSliderDeltaAsAmount, max)
          setRange([newAmount, newMaxAmount])
        } else {
          const newMinAmount = Math.min(newAmount - minSliderDeltaAsAmount, min)
          setRange([newMinAmount, newAmount])
        }
      }

  return (
    <>
      <Slider
        trackWidth={trackWidth}
        setIsSliding={setIsSliding}
        onDrag={onDrag('min')}
        hitSlop={{ bottom: sectionContainerGap, left: trackWidth, right: sliderDelta / 2 + sliderWidth }}
        type="buy"
        transform={[{ translateX: minTranslateX }]}
      />
      <Slider
        trackWidth={trackWidth}
        setIsSliding={setIsSliding}
        onDrag={onDrag('max')}
        hitSlop={{ bottom: sectionContainerGap, left: sliderDelta / 2 - sliderWidth, right: trackWidth }}
        type="buy"
        transform={[{ translateX: maxTranslateX }]}
      />
    </>
  )
}
type AmountInputProps = {
  minAmountDelta: number
  type: 'min' | 'max'
  range: [number, number]
  setRange: (newRange: [number, number]) => void
}
function BuyAmountInput ({ minAmountDelta, type, range: [min, max], setRange }: AmountInputProps) {
  const inputRef = useRef<TextInput>(null)
  const amount = type === 'min' ? min : max

  const [inputValue, setInputValue] = useState(String(amount))
  const restrictAmount = useRestrictSatsAmount('buy')

  const onFocus = () => setInputValue(String(amount))

  const onChangeText = (value: string) => setInputValue(enforceDigitFormat(value))

  const getNewRange = (newAmount: number): [number, number] => {
    if (type === 'min') {
      const newMax = restrictAmount(Math.max(max, newAmount + minAmountDelta))
      const newMin = Math.min(newAmount, newMax - minAmountDelta)
      return [newMin, newMax]
    }
    const newMin = restrictAmount(Math.min(min, newAmount - minAmountDelta))
    const newMax = Math.max(newAmount, newMin + minAmountDelta)
    return [newMin, newMax]
  }
  const onEndEditing = ({ nativeEvent: { text } }: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
    const newAmount = restrictAmount(Number(enforceDigitFormat(text)))
    const newRange = getNewRange(newAmount)
    setRange(newRange)
    setInputValue(String(newAmount))
  }

  const displayValue = inputRef.current?.isFocused() ? inputValue : String(amount)

  const { fiatPrice, displayCurrency } = useBitcoinPrices(amount)

  return (
    <View style={tw`justify-center grow`}>
      <SatsInputComponent
        ref={inputRef}
        value={displayValue}
        onFocus={onFocus}
        onEndEditing={onEndEditing}
        onChangeText={onChangeText}
      />
      <PeachText style={tw`self-center text-black-3 body-s`}>
        {fiatPrice} {displayCurrency}
      </PeachText>
    </View>
  )
}

function useMinSliderDeltaAsAmount (trackWidth: number) {
  const [minLimit, maxLimit] = useTradingAmountLimits('buy')

  const trackDelta = trackWidth - sliderWidth - trackMin
  const minSliderDeltaAsAmount = (sliderWidth / trackDelta) * (maxLimit - minLimit)
  return minSliderDeltaAsAmount
}
