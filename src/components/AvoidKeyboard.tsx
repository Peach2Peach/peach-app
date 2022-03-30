
import React, { ReactElement, ReactNode } from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native'

interface AvoidKeyboardProps {
  children?: ReactNode
}

/**
 * @description Component to avoid keyboard overlapping
 * @param props Component properties
 * @param props.children child elements
 * @example
 * <AvoidKeyboard>
 *    <Text>Your content</Text>
 * </AvoidKeyboard>
 */
export const AvoidKeyboard = ({ children }: AvoidKeyboardProps): ReactElement =>
  <KeyboardAvoidingView behavior="height">
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {children}
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>

export default AvoidKeyboard