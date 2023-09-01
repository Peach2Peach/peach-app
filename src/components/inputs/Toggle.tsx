import { TouchableOpacity } from 'react-native-gesture-handler'
import { Icon, Text } from '..'
import tw from '../../styles/tailwind'

type Props = ComponentProps & {
  enabled: boolean
  onPress: () => void
}
export const Toggle = ({ enabled, onPress, children, style }: Props) => (
  <TouchableOpacity style={[tw`flex-row items-center gap-4`, style]} onPress={onPress}>
    <Text style={tw`settings`}>{children}</Text>
    {enabled ? (
      <Icon id="toggleRight" size={32} color={tw`text-primary-main`.color} />
    ) : (
      <Icon id="toggleLeft" size={32} color={tw`text-black-3`.color} />
    )}
  </TouchableOpacity>
)
