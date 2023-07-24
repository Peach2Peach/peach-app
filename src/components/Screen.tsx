import { View, ViewStyle } from 'react-native'
import tw from '../styles/tailwind'

type Props = {
  style?: ViewStyle | ViewStyle[]
  children: React.ReactNode
}

export const Screen = ({ children, style }: Props) => (
  <View style={[tw`h-full px-sm`, tw.md`px-md`, style]}>{children}</View>
)
