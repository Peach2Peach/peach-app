import { Animated, View } from 'react-native'
import { IconType } from '../../../assets/icons'
import tw from '../../../styles/tailwind'
import Icon from '../../Icon'
import { ConfirmSliderLabel } from './components/ConfirmSliderLabel'
import { getBackgroundColor } from './helpers/getBackgroundColor'
import { getLabel1Opacity } from './helpers/getLabel1Opacity'
import { getTransform } from './helpers/getTransform'
import { useConfirmSliderSetup } from './hooks/useConfirmSliderSetup'
import { useIsMediumScreen } from '../../../hooks'

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
  const icon = {
    color: tw`text-primary-background`.color,
    size: [tw`w-4 h-4`, tw.md`w-[19px] h-[19px]`],
  }
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
          <Animated.View style={[tw`absolute right-full`, { width: widthToSlide, opacity: pan }]}>
            <ConfirmSliderLabel>{label2}</ConfirmSliderLabel>
          </Animated.View>
          <Animated.View
            style={[
              { width: knobWidth, backgroundColor: disabled ? tw`text-black-4`.color : getBackgroundColor(pan) },
              tw`flex flex-row justify-center items-center rounded-full gap-0.5 h-6`,
              tw.md`h-8 gap-1`,
            ]}
          >
            <Icon id={disabled ? 'slash' : iconId} style={icon.size} color={icon.color} />
            <Icon id="chevronsRight" style={icon.size} color={icon.color} />
          </Animated.View>
          <Animated.View style={{ width: widthToSlide, opacity: getLabel1Opacity(pan) }}>
            <ConfirmSliderLabel>{label1}</ConfirmSliderLabel>
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  )
}
