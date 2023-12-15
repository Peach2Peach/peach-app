import { ImageStyle, Pressable, TextStyle, ViewStyle } from 'react-native'
import { IconType } from '../../assets/icons'
import tw from '../../styles/tailwind'
import { Icon } from '../Icon'
import { PeachText } from '../text/PeachText'

type Props = {
  onPress: (() => void) | null
  label: string | undefined
  iconId: IconType
  color: ViewStyle & TextStyle & ImageStyle
  isDisabled?: boolean
  reverseOrder?: boolean
} & ComponentProps

/** @deprecated */
export const PopupAction = ({ onPress, label, iconId, color, isDisabled, reverseOrder, style }: Props) => (
  <Pressable
    style={[
      tw`flex-row items-center justify-end grow gap-1`,
      isDisabled && tw`opacity-50`,
      reverseOrder && tw`flex-row-reverse`,
      style,
    ]}
    hitSlop={20}
    onPress={onPress}
  >
    <PeachText style={[tw`text-base leading-relaxed subtitle-1`, color]}>{label}</PeachText>
    <Icon id={iconId} color={color.color} style={tw`w-4 h-4`} />
  </Pressable>
)
