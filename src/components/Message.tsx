import React, { ReactElement, useContext } from 'react'
import { TextProps, TextStyle, View, ViewStyle } from 'react-native'

import { Text, Icon, Shadow } from '.'
import tw from '../styles/tailwind'
import { MessageContext } from '../contexts/message'
import i18n from '../utils/i18n'
import { IconType } from './icons'
import { dropShadowMild } from '../utils/layout'

type LevelColorMap = {
  bg: Record<MessageLevel, ViewStyle>
  text: Record<MessageLevel, TextStyle>
}
const levelColorMap: LevelColorMap = {
  bg: {
    OK: tw`bg-success-background`,
    WARN: tw`bg-warning-background`,
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

/**
 * @description Component to display the Message
 * @param props Component properties
 * @param props.level level of message
 * @param [props.msgKey] key for error message
 * @param [props.action] custom action to appear on bottom right corner
 * @param [props.actionLabel] label for action
 * @param [props.actionIcon] optional icon for action
 * @param [props.onClose] callback when closing the message
 * @param [props.style] additional styles to apply to the component
 * @example
 * <Message msg="Oops something went wrong!" level="ERROR" />
 */
export const Message = ({
  level,
  msgKey,
  action,
  actionLabel,
  actionIcon,
  onClose,
  style,
}: MessageProps): ReactElement => {
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
            <Text onPress={action as TextProps['onPress']} style={tw`flex flex-row items-center`}>
              {!!actionIcon && <Icon id={actionIcon} style={tw`w-4 h-4`} color={levelColorMap.text[level].color} />}
              <Text style={[tw`subtitle-2 leading-xs`, levelColorMap.text[level]]}> {actionLabel}</Text>
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
