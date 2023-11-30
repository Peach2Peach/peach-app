import { Animated, View } from 'react-native'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { getTranslateY } from '../../../utils/layout'
import { ParsedPeachText } from '../../text'
import { CustomAmount } from './CustomAmount'
import { SliderKnob } from './SliderKnob'
import { SliderTrack } from './SliderTrack'
import { TrackMarkers } from './TrackMarkers'
import { knobLayout } from './helpers/knobLayout'
import { onStartShouldSetResponder } from './helpers/onStartShouldSetResponder'
import { useSelectAmountSetup } from './hooks/useSelectAmountSetup'

type Props = ComponentProps & {
  min: number
  max: number
  value: number
  onChange: (value: number) => void
}

export const SelectAmount = ({ min, max, value, onChange, children, style }: Props) => {
  const { amount, updateCustomAmount, pan, panResponder, trackRange, onTrackLayout } = useSelectAmountSetup({
    min,
    max,
    value,
    onChange,
  })
  return (
    <View style={[tw`flex-row items-center justify-between`, style]}>
      <View style={[tw`items-start gap-2 shrink`, tw`md:gap-4`]}>
        <ParsedPeachText
          style={[tw`h7`, tw`md:h5`]}
          parse={[{ pattern: new RegExp(i18n('sell.subtitle.highlight'), 'u'), style: tw`text-primary-main` }]}
        >
          {i18n('sell.subtitle')}
        </ParsedPeachText>
        <CustomAmount amount={amount} onChange={updateCustomAmount} style={tw`items-start flex-shrink`} />
        {children}
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
