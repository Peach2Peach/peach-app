import React, { ReactElement, useContext } from 'react'
import { TextProps, TextStyle, View, ViewStyle } from 'react-native'

import { Text, Icon, Shadow } from '.'
import tw from '../styles/tailwind'
import { MessageContext } from '../contexts/message'
import i18n from '../utils/i18n'
import { IconType } from '../assets/icons'
import { dropShadowMild } from '../utils/layout'

type LevelColorMap = {
  bg: Record<MessageLevel, ViewStyle>
  text: Record<MessageLevel, TextStyle>
}
const levelColorMap: LevelColorMap = {
  bg: {
    OK: tw`bg-success-background`,
    WARN: tw`bg-warning-mild`,
    ERROR: tw`bg-error-main`,
    INFO: tw`bg-info-background`,
    DEBUG: tw`bg-black-6`,
  },
  text: {
    OK: tw`text-black-1`,
    WARN: tw`text-black-1`,
    ERROR: tw`text-primary-background-light`,
    INFO: tw`text-black-1`,
    DEBUG: tw`text-black-1`,
  },
}

type MessageProps = ComponentProps & MessageState

export const Message = ({ level, msgKey, action, onClose, style }: MessageProps): ReactElement => {
  const [, updateMessage] = useContext(MessageContext)
  let icon: IconType | null = msgKey ? (i18n(`${msgKey}.icon`) as IconType) : null
  let title = msgKey ? i18n(`${msgKey}.title`) : ''
  let message = msgKey ? i18n(`${msgKey}.text`) : ''

  // fallbacks
  if (icon === `${msgKey}.icon`) icon = null
  if (title === `${msgKey}.title`) title = ''
  if (msgKey && message === `${msgKey}.text`) {
    message = i18n(msgKey)
  }

  const closeMessage = () => {
    updateMessage({ msgKey: undefined, level: 'ERROR' })
    if (onClose) onClose()
  }

  return (
    <Shadow shadow={dropShadowMild}>
      <View
        style={[tw`m-6 flex items-center justify-center px-4 pt-4 pb-2 rounded-2xl`, levelColorMap.bg[level], style]}
      >
        <View style={tw`p-2`}>
          <View style={tw`flex-row justify-center items-center`}>
            {!!icon && <Icon id={icon} style={tw`w-5 h-5 mr-2 -mt-1`} color={levelColorMap.text[level].color} />}
            {!!title && <Text style={[tw`h6 text-center`, levelColorMap.text[level]]}>{title}</Text>}
          </View>
          {!!message && (
            <Text style={[tw`body-m text-center`, levelColorMap.text[level], title ? tw`mt-1` : {}]}>{message}</Text>
          )}
        </View>
        <View style={tw`w-full mt-1 flex flex-row justify-between items-center`}>
          {!!action ? (
            <Text onPress={action.callback as TextProps['onPress']} style={tw`flex flex-row items-center`}>
              {!!action.icon && <Icon id={action.icon} style={tw`w-4 h-4`} color={levelColorMap.text[level].color} />}
              <Text style={[tw`subtitle-2 leading-xs`, levelColorMap.text[level]]}> {action.label}</Text>
            </Text>
          ) : (
            <View>{/* placeholder for layout */}</View>
          )}
          <Text onPress={closeMessage} style={tw`text-right flex flex-row items-center`}>
            <Text style={[tw`subtitle-2 leading-xs`, levelColorMap.text[level]]}>{i18n('close')} </Text>
            <Icon id="xSquare" style={tw`w-4 h-4`} color={levelColorMap.text[level].color} />
          </Text>
        </View>
      </View>
    </Shadow>
  )
}

export default Message
