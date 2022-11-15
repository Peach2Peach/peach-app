import React, { ReactElement, useContext } from 'react'
import { TextStyle, View, ViewStyle } from 'react-native'

import { Text, Icon, Shadow } from '.'
import tw from '../styles/tailwind'
import { MessageContext } from '../contexts/message'
import i18n from '../utils/i18n'
import { IconType } from './icons'
import { dropShadowMild, mildShadow } from '../utils/layout'

type LevelColorMap = {
  bg: Record<Level, ViewStyle>
  text: Record<Level, TextStyle>
}
const levelColorMap: LevelColorMap = {
  bg: {
    OK: tw`bg-success-background`,
    WARN: tw`bg-warning-background`,
    ERROR: tw`bg-error-main`,
    INFO: tw`bg-info-background`,
    DEBUG: tw`bg-black-7`,
  },
  text: {
    OK: tw`text-black-1`,
    WARN: tw`text-white-1`,
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
 * @param [props.template] custom template to use
 * @param [props.action] custom action to appear on bottom right corner
 * @param [props.actionLabel] label for action
 * @param [props.actionIcon] optional icon for action
 * @param [props.style] additional styles to apply to the component
 * @example
 * <Message msg="Oops something went wrong!" level="ERROR" />
 */
export const Message = ({
  level,
  msgKey,
  template,
  action,
  actionLabel,
  actionIcon,
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

  const closeMessage = () => updateMessage({ template: undefined, msgKey: undefined, level: 'ERROR' })

  return (
    <Shadow shadow={dropShadowMild}>
      <View
        style={[tw`m-6 flex items-center justify-center px-5 pt-4 pb-2 rounded-2xl`, levelColorMap.bg[level], style]}
      >
        {template ? (
          template
        ) : (
          <View style={tw`p-2`}>
            <View style={tw`flex-row justify-center items-center`}>
              {!!icon && <Icon id={icon} style={tw`w-5 h-5 mr-2 -mt-1`} color={levelColorMap.text[level].color} />}
              {!!title && <Text style={[tw`h6 text-center`, levelColorMap.text[level]]}>{title}</Text>}
            </View>
            {!!message && (
              <Text style={[tw`body-1 text-center`, levelColorMap.text[level], title ? tw`mt-1` : {}]}>{message}</Text>
            )}
          </View>
        )}
        <View style={tw`w-full flex flex-row justify-between`}>
          {!!action ? (
            <Text onPress={action} style={[tw`button-small text-right`, levelColorMap.text[level]]}>
              {!!actionIcon && (
                <Icon id={actionIcon} style={tw`w-4 h-4 ml-1 `} color={levelColorMap.text[level].color} />
              )}
              {actionLabel}
            </Text>
          ) : (
            <View>{/* placeholder for layout */}</View>
          )}
          <Text onPress={closeMessage} style={[tw`button-small text-right`, levelColorMap.text[level]]}>
            {i18n('close')} x
          </Text>
        </View>
      </View>
    </Shadow>
  )
}

export default Message
