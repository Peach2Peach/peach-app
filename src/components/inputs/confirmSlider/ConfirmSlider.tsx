import { Animated, View } from 'react-native'
import { IconType } from '../../../assets/icons'
import tw from '../../../styles/tailwind'
import { getLabel1Opacity } from './helpers/getLabel1Opacity'
import { getTransform } from './helpers/getTransform'
import { useConfirmSliderSetup } from './hooks/useConfirmSliderSetup'
import { SliderKnob, ConfirmSliderLabel } from './components'

type Props = ComponentProps & {
  label1: string
  label2?: string
  iconId?: IconType
  onConfirm: () => void
  enabled?: boolean
}

export const ConfirmSlider = ({
  label1,
  label2 = label1,
  iconId = 'checkCircle',
  onConfirm,
  enabled = true,
  style,
}: Props) => {
  const { panResponder, pan, widthToSlide, onLayout } = useConfirmSliderSetup({ onConfirm, enabled })

  return (
    <View
      style={[
        tw`w-full p-1 overflow-hidden border rounded-full bg-primary-background-dark border-primary-mild-1`,
        style,
      ]}
    >
      <View {...panResponder.panHandlers} testID="confirmSlider" onLayout={onLayout} style={tw`w-full`}>
        <Animated.View
          onStartShouldSetResponder={() => true}
          style={[tw`flex-row items-center`, { transform: getTransform(pan, widthToSlide) }]}
        >
          <ConfirmSliderLabel style={tw`absolute right-full`} width={widthToSlide} opacity={pan}>
            {label2}
          </ConfirmSliderLabel>
          <SliderKnob {...{ enabled, pan, iconId }} />
          <ConfirmSliderLabel width={widthToSlide} opacity={getLabel1Opacity(pan)}>
            {label1}
          </ConfirmSliderLabel>
        </Animated.View>
      </View>
    </View>
  )
}
