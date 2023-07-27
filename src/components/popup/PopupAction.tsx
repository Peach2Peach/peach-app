import { TextStyle, TouchableOpacity } from 'react-native'
import { Icon, Text } from '..'
import tw from '../../styles/tailwind'
import { IconType } from '../../assets/icons'

type Props = ComponentProps & {
  onPress: (() => void) | undefined
  label: string | undefined
  iconId: IconType
  reverseOrder?: boolean
  textStyle?: TextStyle
}
export const PopupAction = ({ onPress, label, iconId, reverseOrder, style, textStyle }: Props) => (
  <TouchableOpacity
    style={[tw`flex-row items-center flex-grow gap-1 px-6 py-2`, reverseOrder && tw`flex-row-reverse`, style]}
    onPress={onPress}
  >
    <Icon id={iconId} color={textStyle?.color ?? tw`text-primary-background-light`.color} size={16} />
    <Text style={[tw`subtitle-1 text-primary-background-light`, textStyle]}>{label}</Text>
  </TouchableOpacity>
)
