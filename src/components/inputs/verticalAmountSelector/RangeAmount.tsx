import { Animated, View } from 'react-native'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { getTranslateY } from '../../../utils/layout'
import { ParsedPeachText, Text } from '../../text'
import { CustomAmount } from './CustomAmount'
import { SliderKnob } from './SliderKnob'
import { SliderTrack } from './SliderTrack'
import { TrackMarkers } from './TrackMarkers'
import { knobLayout } from './helpers/knobLayout'
import { onStartShouldSetResponder } from './helpers/onStartShouldSetResponder'
import { useRangeAmountSetup } from './hooks/useRangeAmountSetup'

type Props = ComponentProps & {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
}

export const RangeAmount = ({ min, max, value, onChange, style }: Props) => {
  const {
    minimum,
    maximum,
    updateCustomAmountMaximum,
    updateCustomAmountMinimum,
    minY,
    maxY,
    panMin,
    panMax,
    panMinResponder,
    panMaxResponder,
    trackRangeMin,
    trackRangeMax,
    onTrackLayout,
    knobHeight,
  } = useRangeAmountSetup({ min, max, value, onChange })

  return (
    <View style={[tw`flex-row items-center justify-between`, style]}>
      <View style={[tw`items-start gap-2 shrink`, tw.md`gap-4`]}>
        <ParsedPeachText
          style={[tw`h7`, tw.md`h5`]}
          parse={[{ pattern: new RegExp(i18n('buy.subtitle.highlight'), 'u'), style: tw`text-success-main` }]}
        >
          {i18n('buy.subtitle')}
        </ParsedPeachText>
        <CustomAmount amount={maximum} onChange={updateCustomAmountMaximum} style={tw`items-start flex-shrink`} />
        <Text style={[tw`h7`, tw.md`h5`]}>{i18n('and')}</Text>
        <CustomAmount amount={minimum} onChange={updateCustomAmountMinimum} style={tw`items-start flex-shrink`} />
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
          style={[knobLayout, getTranslateY(panMax, trackRangeMax)]}
        >
          <SliderKnob />
        </Animated.View>
        <Animated.View
          {...panMinResponder.panHandlers}
          {...{ onStartShouldSetResponder }}
          style={[knobLayout, getTranslateY(panMin, trackRangeMin)]}
        >
          <SliderKnob />
        </Animated.View>
      </SliderTrack>
    </View>
  )
}
