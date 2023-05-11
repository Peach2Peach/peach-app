import { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, View } from 'react-native'
import { useBitcoinPrices } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { getTranslateY } from '../../../utils/layout'
import { interpolate, round } from '../../../utils/math'
import { ParsedPeachText, Text } from '../../text'
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
  value: [number, number]
  onChange: (value: [number, number]) => void
}

// eslint-disable-next-line max-statements
export const RangeAmount = ({ min, max, value, onChange, style }: RangeAmountProps): ReactElement => {
  const knobHeight = useKnobHeight()
  const [trackHeight, setTrackHeight] = useState(260)
  const knobTrackHeight = trackHeight - knobHeight

  const [maximum, setMaximum] = useState(value[1])
  const [minimum, setMinimum] = useState(value[0])
  const maxY = useMemo(
    () => getOffset({ amount: maximum, min, max, trackHeight: knobTrackHeight }),
    [knobTrackHeight, max, maximum, min],
  )
  const minY = useMemo(
    () => getOffset({ amount: minimum, min, max, trackHeight: knobTrackHeight }),
    [knobTrackHeight, max, min, minimum],
  )

  const { displayPrice: displayPriceMinimum, displayCurrency, fullDisplayPrice } = useBitcoinPrices({ sats: minimum })
  const { displayPrice: displayPriceMaximum } = useBitcoinPrices({ sats: maximum })

  const trackRange: [number, number] = useMemo(() => [0, knobTrackHeight], [knobTrackHeight])
  const trackRangeMax: [number, number] = useMemo(() => [0, knobTrackHeight - knobHeight], [knobHeight, knobTrackHeight])
  const trackRangeMin: [number, number] = useMemo(() => [knobHeight, knobTrackHeight], [knobHeight, knobTrackHeight])

  const minSatsDistance = useMemo(
    () => round(interpolate(knobHeight, [0, knobTrackHeight], [0, max - min]), -4),
    [knobHeight, knobTrackHeight, max, min],
  )
  const panMax = useRef(new Animated.Value(maxY)).current
  const panMin = useRef(new Animated.Value(minY)).current

  const panMaxResponder = useRef(createPanResponder(panMax)).current
  const panMinResponder = useRef(createPanResponder(panMin)).current

  const onTrackLayout = (event: LayoutChangeEvent) => {
    const height = Math.round(event.nativeEvent.layout.height)
    setTrackHeight(height)
    const newKnowTrackHeight = height - knobHeight
    panMax.setOffset(getOffset({ amount: maximum, min, max, trackHeight: newKnowTrackHeight }))
    panMin.setOffset(getOffset({ amount: minimum, min, max, trackHeight: newKnowTrackHeight }))
  }

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
    <View style={[tw`flex-row items-center justify-between pl-5 pr-4`, style]}>
      <View style={tw`flex-shrink items-start gap-2 md:gap-4`}>
        <ParsedPeachText
          style={tw`h7 md:h5`}
          parse={[{ pattern: new RegExp(i18n('buy.subtitle.highlight'), 'u'), style: tw`text-success-main` }]}
        >
          {i18n('buy.subtitle')}
        </ParsedPeachText>
        <CustomAmount
          {...{
            amount: maximum,
            setAmount: () => {},
            fiatPrice: displayPriceMaximum,
            setCustomFiatPrice: () => {},
            bitcoinPrice: fullDisplayPrice,
            displayCurrency,
            disable: true,
          }}
          style={tw`flex-shrink items-start`}
        />
        <Text style={tw`h7 md:h5`}>{i18n('and')}</Text>
        <CustomAmount
          {...{
            amount: minimum,
            setAmount: () => {},
            fiatPrice: displayPriceMinimum,
            setCustomFiatPrice: () => {},
            bitcoinPrice: fullDisplayPrice,
            displayCurrency,
            disable: true,
          }}
          style={tw`flex-shrink items-start`}
        />
      </View>

      <SliderTrack style={tw`h-full`} onLayout={onTrackLayout}>
        <TrackMarkers />
        <Animated.View
          style={[
            tw`absolute left-0 right-0 opacity-50 bg-primary-main`,
            { height: minY - maxY, top: knobHeight / 2 },
            getTranslateY(panMax, trackRangeMax),
          ]}
        />
        <Animated.View
          {...panMaxResponder.panHandlers}
          {...{ onStartShouldSetResponder }}
          style={[tw`absolute top-0 flex-row items-center`, getTranslateY(panMax, trackRangeMax)]}
        >
          <SliderKnob />
        </Animated.View>
        <Animated.View
          {...panMinResponder.panHandlers}
          {...{ onStartShouldSetResponder }}
          style={[tw`absolute top-0 flex-row items-center`, getTranslateY(panMin, trackRangeMin)]}
        >
          <SliderKnob />
        </Animated.View>
      </SliderTrack>
    </View>
  )
}
