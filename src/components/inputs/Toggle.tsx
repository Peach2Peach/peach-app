import { TextStyle, TouchableOpacity } from 'react-native'
import { Icon, Text } from '..'
import tw from '../../styles/tailwind'

type Props = ComponentProps & {
  enabled: boolean
  disabled?: boolean
  onPress: () => void
  textStyle?: TextStyle
}
export const Toggle = ({ enabled, disabled, onPress, children, style, textStyle }: Props) => (
  <TouchableOpacity
    style={[tw`flex-row items-center gap-4`, disabled && tw`opacity-33`, style]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={[tw`settings`, textStyle]}>{children}</Text>
    {enabled ? (
      <Icon id="toggleRight" size={32} color={tw`text-primary-main`.color} />
    ) : (
      <Icon id="toggleLeft" size={32} color={tw`text-black-3`.color} />
    )}
  </TouchableOpacity>
)
