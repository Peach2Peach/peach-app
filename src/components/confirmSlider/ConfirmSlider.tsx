import { Animated, View } from 'react-native'
import { IconType } from '../../assets/icons'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { ConfirmSliderLabel } from './components/ConfirmSliderLabel'
import { getBackgroundColor } from './helpers/getBackgroundColor'
import { getLabel1Opacity } from './helpers/getLabel1Opacity'
import { getTransform } from './helpers/getTransform'
import { useConfirmSliderSetup } from './hooks/useConfirmSliderSetup'
import { knobWidth } from './constants'

export type Props = ComponentProps & {
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
  const { panResponder, pan, widthToSlide, onLayout } = useConfirmSliderSetup({ onConfirm, disabled })

  return (
    <View
      {...panResponder.panHandlers}
      onLayout={onLayout}
      style={[
        tw`w-full max-w-full overflow-hidden rounded-full bg-primary-background-dark`,
        tw`border border-primary-mild-1`,
        !!disabled && tw`opacity-50`,
        style,
      ]}
    >
      <Animated.View
        {...{ onStartShouldSetResponder }}
        style={[tw`flex flex-row items-center`, { transform: getTransform(pan, widthToSlide) }]}
      >
        <Animated.View style={[tw`absolute right-full`, { width: widthToSlide, opacity: pan }]}>
          <ConfirmSliderLabel>{label2}</ConfirmSliderLabel>
        </Animated.View>
        <Animated.View
          style={[
            { width: knobWidth, backgroundColor: getBackgroundColor(pan) },
            tw`flex flex-row justify-center py-2 my-1 rounded-full `,
          ]}
        >
          <Icon id={iconId} style={tw`w-6 h-6`} color={tw`text-primary-background`.color} />
          <Icon id="chevronsRight" style={tw`w-6 h-6 ml-1`} color={tw`text-primary-background`.color} />
        </Animated.View>
        <Animated.View style={{ width: widthToSlide, opacity: getLabel1Opacity(pan) }}>
          <ConfirmSliderLabel>{label1}</ConfirmSliderLabel>
        </Animated.View>
      </Animated.View>
    </View>
  )
}
