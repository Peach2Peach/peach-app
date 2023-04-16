import { ReactElement, useEffect, useState } from 'react'
import { AccessibilityInfo, Keyboard, KeyboardAvoidingView, Pressable } from 'react-native'
import { isIOS } from '../utils/system'

type AvoidKeyboardProps = ComponentProps & {
  iOSBehavior?: 'padding' | 'height' | 'position'
  androidBehavior?: 'padding' | 'height' | 'position'
}

export const AvoidKeyboard = ({ children, iOSBehavior, androidBehavior }: AvoidKeyboardProps): ReactElement => {
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
        behavior: isIOS() ? iOSBehavior ?? 'padding' : androidBehavior ?? undefined,
      }}
    >
      <Pressable onPress={Keyboard.dismiss}>{children}</Pressable>
    </KeyboardAvoidingView>
  )
}
