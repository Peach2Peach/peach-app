import { TextStyle, TouchableOpacity } from 'react-native'
import tw from '../../styles/tailwind'
import { Icon } from '../Icon'
import Text from '../text/Text'

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
    {!!children && <Text style={[tw`settings`, textStyle]}>{children}</Text>}
    {enabled ? (
      <Icon id="toggleRight" size={32} color={tw.color('primary-main')} />
    ) : (
      <Icon id="toggleLeft" size={32} color={tw.color('black-3')} />
    )}
  </TouchableOpacity>
)
