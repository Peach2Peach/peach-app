import { TouchableOpacity } from 'react-native-gesture-handler'
import { Icon, Text } from '../../../components'
import tw from '../../../styles/tailwind'

type Props = ComponentProps & {
  onPress: () => void
}
export const MenuItem = ({ children, onPress, style }: Props) => (
  <TouchableOpacity onPress={onPress} style={[tw`flex-row justify-between items-center w-60`, style]}>
    <Text style={tw`settings text-primary-background-light`}>{children}</Text>
    <Icon id="chevronRight" style={tw`w-6 h-6`} color={tw.color('primary-background-light')} />
  </TouchableOpacity>
)
