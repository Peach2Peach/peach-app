import { Keyboard, Pressable, StyleProp, ViewStyle } from 'react-native'
import tw from '../../styles/tailwind'

type Props = {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}

export const PopupContent = ({ children, style }: Props) => (
  <Pressable style={[tw`items-stretch gap-3 p-6 pt-4 bg-primary-background-dark`, style]} onPress={Keyboard.dismiss}>
    {children}
  </Pressable>
)
