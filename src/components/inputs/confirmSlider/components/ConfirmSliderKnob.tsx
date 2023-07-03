import { Animated } from 'react-native'
import { IconType } from '../../../../assets/icons'
import tw from '../../../../styles/tailwind'
import Icon from '../../../Icon'
import { getBackgroundColor } from '../helpers/getBackgroundColor'
import { useIsMediumScreen } from '../../../../hooks'

type Props = {
  enabled?: boolean
  pan: Animated.Value
  iconId: IconType
  knobWidth: number
}

export const ConfirmSliderKnob = ({ enabled = true, pan, iconId, knobWidth }: Props) => {
  const icon = {
    color: tw`text-primary-background`.color,
    size: useIsMediumScreen() ? 19 : 16,
  }

  return (
    <Animated.View
      style={[
        {
          width: knobWidth,
          backgroundColor: enabled ? getBackgroundColor(pan) : tw`text-black-4`.color,
        },
        tw`flex flex-row justify-center items-center rounded-full gap-0.5 px-2 py-[6px]`,
        tw.md`px-[6px] py-1 gap-1`,
      ]}
    >
      <Icon id={enabled ? iconId : 'slash'} size={icon.size} color={icon.color} />
      <Icon id="chevronsRight" size={icon.size} color={icon.color} />
    </Animated.View>
  )
}
