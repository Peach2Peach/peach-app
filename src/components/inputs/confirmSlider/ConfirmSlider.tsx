import { Animated, View, ViewStyle } from 'react-native'
import { IconType } from '../../../assets/icons'
import { useIsMediumScreen } from '../../../hooks/useIsMediumScreen'
import tw from '../../../styles/tailwind'
import { Icon } from '../../Icon'
import { ConfirmSliderLabel } from './components/ConfirmSliderLabel'
import { SliderKnob } from './components/SliderKnob'
import { getLabel1Opacity } from './helpers/getLabel1Opacity'
import { getTransform } from './helpers/getTransform'
import { useConfirmSliderSetup } from './hooks/useConfirmSliderSetup'

type Props = ComponentProps & {
  label1: string
  label2?: string
  iconId?: IconType
  onConfirm: () => void
  enabled?: boolean
  confirmed?: boolean
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
      style={[tw`w-full p-1 overflow-hidden border rounded-5 bg-primary-background-dark border-primary-mild-1`, style]}
      {...panResponder.panHandlers}
      testID="confirmSlider"
    >
      <Animated.View
        onStartShouldSetResponder={() => true}
        onLayout={onLayout}
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
  )
}

/**
 * This is a disgusting hack intended to be thrown out as soon as possible.
 * (it also uses duplicate code from SliderKnob)
 */
const MEDIUM_ICON_SIZE = 18
const SMALL_ICON_SIZE = 16
export function UnlockedSlider ({
  label,
  iconId = 'checkCircle',
  style,
}: {
  label: string
  iconId?: IconType
  style?: ViewStyle
}) {
  const { widthToSlide, onLayout } = useConfirmSliderSetup({ onConfirm: () => {}, enabled: false })
  const pan = new Animated.Value(1)
  const isMediumScreen = useIsMediumScreen()
  const icon = {
    color: tw.color('primary-background-light'),
    size: isMediumScreen ? MEDIUM_ICON_SIZE : SMALL_ICON_SIZE,
  }
  return (
    <View
      style={[tw`w-full p-1 overflow-hidden border rounded-5 bg-primary-background-dark border-primary-mild-1`, style]}
    >
      <View style={[tw`flex-row items-center justify-end`]} onLayout={onLayout}>
        <ConfirmSliderLabel style={tw`self-center`} width={widthToSlide} opacity={pan}>
          {label}
        </ConfirmSliderLabel>
        <View
          style={[
            tw`flex-row items-center justify-center py-1 bg-success-main rounded-2xl gap-2px px-6px`,
            tw`md:px-8px md:py-6px md:gap-1`,
          ]}
        >
          <Icon id={iconId} {...icon} />
          <Icon id="chevronsRight" {...icon} />
        </View>
      </View>
    </View>
  )
}
