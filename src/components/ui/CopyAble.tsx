import React, { ReactElement, useState } from 'react'
import Clipboard from '@react-native-clipboard/clipboard'
import { Pressable } from 'react-native'
import { Fade } from '../animation'
import { Text } from '../text'
import i18n from '../../utils/i18n'
import tw from '../../styles/tailwind'
import Icon from '../Icon'

type CopyAbleProps = ComponentProps & {
  value: string,
  color?: string,
}
export const CopyAble = ({ value, color, style }: CopyAbleProps): ReactElement => {
  const [showCopied, setShowCopied] = useState(false)

  const copy = () => {
    Clipboard.setString(value)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 500)
  }
  return <Pressable onPress={copy} style={style}>
    <Fade show={showCopied} duration={300} delay={0}>
      <Text style={tw`font-baloo text-grey-1 text-sm uppercase absolute -top-6 w-20 left-1/2 -ml-10 text-center`}>
        {i18n('copied')}
      </Text>
    </Fade>
    <Icon id="copy" style={tw`w-7 h-7`} color={color || tw`text-grey-3`.color as string}/>
  </Pressable>
}