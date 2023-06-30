import { Animated, View } from 'react-native'
import { IconType } from '../../../assets/icons'
import tw from '../../../styles/tailwind'
import { ConfirmSliderLabel } from './components/ConfirmSliderLabel'
import { getLabel1Opacity } from './helpers/getLabel1Opacity'
import { getTransform } from './helpers/getTransform'
import { useConfirmSliderSetup } from './hooks/useConfirmSliderSetup'
import { useIsMediumScreen } from '../../../hooks'
import { ConfirmSliderKnob } from './components/ConfirmSliderKnob'

type Props = ComponentProps & {
  label1: string
  label2?: string
  iconId?: IconType
  onConfirm: () => void
  disabled?: boolean
}

const onStartShouldSetResponder = () => true
export const ConfirmSlider = ({
  label1,
  label2 = label1,
  iconId = 'checkCircle',
  onConfirm,
  disabled,
  style,
}: Props) => {
  const isMediumScreen = useIsMediumScreen()
  const knobWidth = isMediumScreen ? 56 : 42
  const { panResponder, pan, widthToSlide, onLayout } = useConfirmSliderSetup({ onConfirm, disabled, knobWidth })

  return (
    <View
      style={[
        tw`w-full p-1 overflow-hidden border rounded-full bg-primary-background-dark border-primary-mild-1`,
        style,
      ]}
    >
      <View {...panResponder.panHandlers} testID="confirmSlider" onLayout={onLayout} style={tw`w-full`}>
        <Animated.View
          {...{ onStartShouldSetResponder }}
          style={[tw`flex-row items-center`, { transform: getTransform(pan, widthToSlide) }]}
        >
          <ConfirmSliderLabel style={tw`absolute right-full`} width={widthToSlide} opacity={pan}>
            {label2}
          </ConfirmSliderLabel>
          <ConfirmSliderKnob {...{ disabled, pan, iconId, knobWidth }} />
          <ConfirmSliderLabel width={widthToSlide} opacity={getLabel1Opacity(pan)}>
            {label1}
          </ConfirmSliderLabel>
        </Animated.View>
      </View>
    </View>
  )
}
