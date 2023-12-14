import Clipboard from '@react-native-clipboard/clipboard'
import { useCallback, useImperativeHandle, useState } from 'react'
import { Pressable, TextStyle } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { Icon } from '../Icon'
import { Fade } from '../animation/Fade'
import { Text } from '../text'

export type CopyRef = {
  copy: () => void
}

const textPositions = {
  left: tw`absolute mr-3 right-full`,
  top: tw`absolute mb-1 bottom-full`,
  right: tw`absolute ml-3 left-full`,
  bottom: tw`absolute mt-1 top-full`,
}
type Props = ComponentProps & {
  value?: string
  color?: TextStyle
  disabled?: boolean
  textPosition?: keyof typeof textPositions
}

export const CopyAble = ({ forwardRef, value, color, disabled, style, textPosition = 'top' }: Props) => {
  const [showCopied, setShowCopied] = useState(false)

  const copy = useCallback(() => {
    if (!value) return
    Clipboard.setString(value)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 500)
  }, [value])

  useImperativeHandle(forwardRef, () => ({
    copy,
  }))

  return (
    <Pressable
      onPress={copy}
      disabled={!value || disabled}
      style={[tw`flex-row items-center justify-center shrink w-4 h-4`, style]}
    >
      <Icon id="copy" style={tw`w-full h-full`} color={color?.color || tw.color('primary-main')} />
      <Fade show={showCopied} duration={300} delay={0} style={textPositions[textPosition]}>
        <Text style={[tw`tooltip`, color || tw`text-primary-main`]}>{i18n('copied')}</Text>
      </Fade>
    </Pressable>
  )
}
