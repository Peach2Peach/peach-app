import { View } from 'react-native'
import tw from '../styles/tailwind'

export const Screen = ({ children, style }: ComponentProps & { children: React.ReactNode }) => (
  <View style={[tw`h-full px-4`, tw.md`px-8`, style]}>{children}</View>
)
