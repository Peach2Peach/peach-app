import { Pressable, Keyboard } from 'react-native'
import tw from '../../styles/tailwind'

export const PopupContent = ({ children }: ComponentProps) => (
  <Pressable
    style={[tw`items-center self-stretch gap-4 p-6 pt-4`, tw`bg-primary-background-dark`]}
    onPress={Keyboard.dismiss}
  >
    {children}
  </Pressable>
)
