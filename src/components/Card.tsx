import { View } from 'react-native'
import tw from '../styles/tailwind'

export const Card = ({ children, style }: ComponentProps) => (
  <View style={[tw`w-full border rounded-2xl bg-primary-background-light border-black-5`, style]}>{children}</View>
)
