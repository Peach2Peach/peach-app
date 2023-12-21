import { Animated, View } from 'react-native'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { getTranslateX } from '../../../utils/layout/getTranslateX'
import { round } from '../../../utils/math/round'
import { Icon } from '../../Icon'
import { SliderLabel } from './SliderLabel'
import { SliderMarkers } from './SliderMarkers'
import { usePremiumSliderSetup } from './usePremiumSliderSetup'

const onStartShouldSetResponder = () => true

type Props = {
  premium: number
  setPremium: (newPremium: number, isValid?: boolean | undefined) => void
} & ComponentProps

export const PremiumSlider = ({ style, premium, setPremium }: Props) => {
  const { pan, panResponder, onLayout, trackWidth, knobWidth, labelPosition, min, max } = usePremiumSliderSetup(
    premium,
    setPremium,
  )

  return (
    <View style={style} {...panResponder.panHandlers} {...{ onStartShouldSetResponder }}>
      <View
        style={[
          tw`w-full h-8`,
          tw`border p-0.5 rounded-full bg-primary-background-dark border-primary-mild-1`,
          tw`justify-center`,
        ]}
      >
        <SliderMarkers positions={labelPosition} />
        <View {...{ onLayout }}>
          <Animated.View
            style={[
              { width: knobWidth },
              tw`z-10 flex items-center justify-center h-full rounded-full bg-primary-main`,
              getTranslateX(pan, [0, trackWidth]),
            ]}
          >
            <Icon id="chevronsDown" style={tw`w-4`} color={tw.color('primary-background-light')} />
          </Animated.View>
        </View>
      </View>
      <View style={tw`w-full h-10 mt-1`}>
        <SliderLabel position={labelPosition[0]}>{min}%</SliderLabel>
        <SliderLabel position={labelPosition[1]}>{round(min / 2, -1)}%</SliderLabel>
        <SliderLabel position={labelPosition[2]}>{i18n('sell.premium.marketPrice')}</SliderLabel>
        <SliderLabel position={labelPosition[3]}>+{round(max / 2, -1)}%</SliderLabel>
        <SliderLabel position={labelPosition[4]}>+{max}%</SliderLabel>
      </View>
    </View>
  )
}
