import { TouchableOpacity } from 'react-native'
import tw from '../../styles/tailwind'

export type Props = ComponentProps & {
  onPress?: () => void
}
export const Label = ({ children, onPress, style, testID }: Props) => (
  <TouchableOpacity
    testID={testID}
    onPress={onPress}
    style={[tw`h-6 justify-center items-center border border-black-1 rounded-lg px-2`, style]}
  >
    {children}
  </TouchableOpacity>
)
