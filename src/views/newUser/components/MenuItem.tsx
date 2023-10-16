import { TouchableOpacity } from 'react-native'
import { Icon, Text } from '../../../components'
import tw from '../../../styles/tailwind'

type Props = ComponentProps & {
  onPress: () => void
}
export const MenuItem = ({ children, onPress, style }: Props) => (
  <TouchableOpacity onPress={onPress} style={[tw`flex-row items-center justify-between w-60`, style]}>
    <Text style={tw`settings text-primary-background-light`}>{children}</Text>
    <Icon id="chevronRight" style={tw`w-6 h-6`} color={tw`text-primary-background-light`.color} />
  </TouchableOpacity>
)
