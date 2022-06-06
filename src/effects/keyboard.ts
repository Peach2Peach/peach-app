import { Keyboard } from 'react-native'

export default (setKeyboardOpen: (isOpen: boolean) => void) => () => {
  Keyboard.addListener('keyboardWillShow', () => setKeyboardOpen(true))
  Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true))
  Keyboard.addListener('keyboardWillHide', () => setKeyboardOpen(false))
  Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false))
}