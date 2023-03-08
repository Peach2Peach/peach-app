import React, { ReactElement, useEffect, useState } from 'react'
import { AccessibilityInfo, Keyboard, KeyboardAvoidingView, Pressable } from 'react-native'
import { isIOS } from '../utils/system'

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
export const AvoidKeyboard = ({ children }: AvoidKeyboardProps): ReactElement => {
  const [enabled, setEnabled] = useState(true)
  useEffect(() => {
    ;(async () => {

      /**
       * workaround for react native <=69 which has a bug that view collapses to 0
       * when closing keyboard
       * can be removed with react native 70+
       */
      setEnabled(!(await AccessibilityInfo.isReduceMotionEnabled()))
    })()
  }, [])

  return (
    <KeyboardAvoidingView
      {...{
        enabled,
        behavior: isIOS() ? 'padding' : undefined,
      }}
    >
      <Pressable onPress={Keyboard.dismiss}>{children}</Pressable>
    </KeyboardAvoidingView>
  )
}

export default AvoidKeyboard
