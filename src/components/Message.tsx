import React, { ReactElement, useContext } from 'react'
import { TextProps, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'

import { Icon, Text } from '.'
import { IconType } from '../assets/icons'
import { MessageContext } from '../contexts/message'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'

type LevelColorMap = {
  bg: Record<Level, ViewStyle>
  text: Record<Level, TextStyle>
}
const levelColorMap: LevelColorMap = {
  bg: {
    APP: tw`bg-primary-main`,
    SUCCESS: tw`bg-success-background`,
    WARN: tw`bg-warning-background`,
    ERROR: tw`bg-error-main`,
    INFO: tw`bg-info-background`,
    DEFAULT: tw`bg-black-6`,
  },
  text: {
    APP: tw`text-primary-background`,
    SUCCESS: tw`text-black-1`,
    WARN: tw`text-black-1`,
    ERROR: tw`text-primary-background-light`,
    INFO: tw`text-black-1`,
    DEFAULT: tw`text-black-1`,
  },
}

type MessageProps = ComponentProps & MessageState

export const Message = ({ level, msgKey, bodyArgs = [], action, onClose, style }: MessageProps): ReactElement => {
  const [, updateMessage] = useContext(MessageContext)
  let icon: IconType | null = msgKey ? (i18n(`${msgKey}.icon`) as IconType) : null
  let title = msgKey ? i18n(`${msgKey}.title`) : ''
  let message = msgKey ? i18n(`${msgKey}.text`, ...bodyArgs) : ''

  // fallbacks
  if (icon === `${msgKey}.icon`) icon = null
  if (title === `${msgKey}.title`) title = ''
  if (msgKey && message === `${msgKey}.text`) {
    message = i18n(msgKey, ...bodyArgs)
  }

  const closeMessage = () => {
    updateMessage({ msgKey: undefined, level: 'ERROR' })
    if (onClose) onClose()
  }

  return (
    <View style={[tw`flex items-center justify-center px-4 pt-4 pb-2 m-6 rounded-2xl`, levelColorMap.bg[level], style]}>
      <View style={tw`p-2`}>
        <View style={tw`flex-row items-center justify-center`}>
          {!!icon && <Icon id={icon} style={tw`w-5 h-5 mr-2`} color={levelColorMap.text[level].color} />}
          {!!title && <Text style={[tw`text-center h6`, levelColorMap.text[level]]}>{title}</Text>}
        </View>
        {!!message && (
          <Text style={[tw`text-center body-m`, levelColorMap.text[level], title ? tw`mt-1` : {}]}>{message}</Text>
        )}
      </View>
      <View style={tw`flex flex-row items-center justify-between w-full mt-1`}>
        {!!action ? (
          <TouchableOpacity onPress={action.callback as TextProps['onPress']} style={tw`flex flex-row items-center`}>
            {!!action.icon && <Icon id={action.icon} style={tw`w-4 h-4`} color={levelColorMap.text[level].color} />}
            <Text style={[tw`leading-relaxed subtitle-2`, levelColorMap.text[level]]}> {action.label}</Text>
          </TouchableOpacity>
        ) : (
          <View>{/* placeholder for layout */}</View>
        )}
        <TouchableOpacity onPress={closeMessage} style={tw`flex flex-row items-center text-right`}>
          <Text style={[tw`leading-relaxed subtitle-2`, levelColorMap.text[level]]}>{i18n('close')} </Text>
          <Icon id="xSquare" style={tw`w-4 h-4`} color={levelColorMap.text[level].color} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Message
