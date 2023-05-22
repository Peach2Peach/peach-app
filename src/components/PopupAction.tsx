import { ImageStyle, Pressable, TextStyle, ViewStyle } from 'react-native'
import { Text } from '.'
import { IconType } from '../assets/icons'
import tw from '../styles/tailwind'
import Icon from './Icon'

type Props = {
  onPress: (() => void) | null
  label: string | undefined
  iconId: IconType
  color: ViewStyle & TextStyle & ImageStyle
  isDisabled?: boolean
  reverseOrder?: boolean
} & ComponentProps

export const PopupAction = ({ onPress, label, iconId, color, isDisabled, reverseOrder, style }: Props) => (
  <Pressable
    style={[
      style,
      tw`flex-row items-center flex-shrink gap-1`,
      isDisabled && tw`opacity-50`,
      reverseOrder && tw`flex-row-reverse`,
    ]}
    hitSlop={20}
    onPress={onPress}
  >
    <Text style={[tw`text-base leading-relaxed subtitle-1`, color]}>{label}</Text>
    <Icon id={iconId} color={color.color} style={tw`w-4 h-4`} />
  </Pressable>
)
