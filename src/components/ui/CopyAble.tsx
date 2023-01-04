import React, { ReactElement, useState } from 'react'
import Clipboard from '@react-native-clipboard/clipboard'
import { Pressable } from 'react-native'
import { Fade } from '../animation'
import { Text } from '../text'
import i18n from '../../utils/i18n'
import tw from '../../styles/tailwind'
import Icon from '../Icon'

type CopyAbleProps = ComponentProps & {
  value: string
  color?: string
}
export const CopyAble = ({ value, color, style }: CopyAbleProps): ReactElement => {
  const [showCopied, setShowCopied] = useState(false)

  const copy = () => {
    Clipboard.setString(value)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 500)
  }
  return (
    <Pressable onPress={copy} style={[tw`flex-row flex-shrink`, style]}>
      <Icon id="copy" style={tw`w-7 h-7`} color={color || tw`text-primary-main`.color} />
      <Fade show={showCopied} duration={300} delay={0} style={tw`absolute ml-9`}>
        <Text style={[tw`tooltip text-primary-main`]}>{i18n('copied')}</Text>
      </Fade>
    </Pressable>
  )
}
