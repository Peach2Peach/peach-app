import { Animated } from 'react-native'
import { IconType } from '../../../../assets/icons'
import tw from '../../../../styles/tailwind'
import Icon from '../../../Icon'
import { getBackgroundColor } from '../helpers/getBackgroundColor'

type Props = {
  disabled?: boolean
  pan: Animated.Value
  iconId: IconType
  knobWidth: number
}

export const ConfirmSliderKnob = ({ disabled, pan, iconId, knobWidth }: Props) => {
  const icon = {
    color: tw`text-primary-background`.color,
    size: [tw`w-4 h-4`, tw.md`w-[19px] h-[19px]`],
  }
  return (
    <Animated.View
      style={[
        {
          width: knobWidth,
          backgroundColor: disabled ? tw`text-black-4`.color : getBackgroundColor(pan),
        },
        tw`flex flex-row justify-center items-center rounded-full gap-0.5 h-6`,
        tw.md`h-8 gap-1`,
      ]}
    >
      <Icon id={disabled ? 'slash' : iconId} style={icon.size} color={icon.color} />
      <Icon id="chevronsRight" style={icon.size} color={icon.color} />
    </Animated.View>
  )
}
