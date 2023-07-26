import { Pressable, Keyboard, ViewStyle } from 'react-native'
import tw from '../../styles/tailwind'

type Props = {
  children: React.ReactNode
  style?: ViewStyle
}

export const PopupContent = ({ children, style }: Props) => (
  <Pressable style={[tw`items-center gap-3 p-6 pt-4 bg-primary-background-dark`, style]} onPress={Keyboard.dismiss}>
    {children}
  </Pressable>
)
