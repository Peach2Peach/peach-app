import { Keyboard } from 'react-native'

export default (setKeyboardOpen: (isOpen: boolean) => void) => () => {
  const sub1 = Keyboard.addListener('keyboardWillShow', () => setKeyboardOpen(true))
  const sub2 = Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true))
  const sub3 = Keyboard.addListener('keyboardWillHide', () => setKeyboardOpen(false))
  const sub4 = Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false))

  return () => {
    sub1.remove()
    sub2.remove()
    sub3.remove()
    sub4.remove()
  }
}