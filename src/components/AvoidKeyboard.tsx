
import React, { ReactElement } from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native'

type AvoidKeyboardProps = ComponentProps

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
  <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {children}
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>

export default AvoidKeyboard