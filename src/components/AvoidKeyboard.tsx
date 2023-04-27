import { Keyboard, KeyboardAvoidingView, Pressable } from 'react-native'
import { isIOS } from '../utils/system'

type Props = ComponentProps & {
  iOSBehavior?: 'padding' | 'height' | 'position'
  androidBehavior?: 'padding' | 'height' | 'position'
}

export const AvoidKeyboard = ({ children, iOSBehavior, androidBehavior }: Props) => (
  <KeyboardAvoidingView behavior={isIOS() ? iOSBehavior ?? 'padding' : androidBehavior ?? undefined}>
    <Pressable onPress={Keyboard.dismiss}>{children}</Pressable>
  </KeyboardAvoidingView>
)
