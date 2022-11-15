import React, { ReactElement, ReactNode, useContext } from 'react'
import { View } from 'react-native'

import { Text, Icon } from '.'
import tw from '../styles/tailwind'
import { Level, MessageContext } from '../contexts/message'
import i18n from '../utils/i18n'
import { textShadow } from '../utils/layout'
import { IconType } from './icons'

type MessageProps = ComponentProps & {
  template?: ReactNode
  msgKey?: string
  msg?: string
  close: boolean | undefined
  level: Level
}

/**
 * @description Component to display the Message
 * @param props Component properties
 * @param props.msg the error message
 * @param [props.style] additional styles to apply to the component
 * @example
 * <Message msg="Oops something went wrong!" level="ERROR" />
 */
export const Message = ({ template, msgKey, msg, level, close, style }: MessageProps): ReactElement => {
  const [, updateMessage] = useContext(MessageContext)
  let icon = msgKey ? i18n(`${msgKey}.icon`) : ''
  let title = msgKey ? i18n(`${msgKey}.title`) : ''
  let message = msg ? msg : msgKey ? i18n(`${msgKey}.text`) : ''

  // fallbacks
  if (icon === `${msgKey}.icon`) icon = ''
  if (title === `${msgKey}.title`) title = ''
  if (msgKey && message === `${msgKey}.text`) {
    message = i18n(msgKey)
  }

  const closeMessage = () => updateMessage({ template: undefined, msg: undefined, msgKey: undefined, level: 'ERROR' })
  return (
    <View
      style={[
        tw`w-full flex items-center justify-center px-3 py-2`,
        level === 'OK'
          ? tw`bg-green`
          : level === 'ERROR'
            ? tw`bg-red`
            : level === 'WARN'
              ? tw`bg-yellow-2`
              : tw`bg-blue-1`,
        style,
      ]}
    >
      {template ? (
        template
      ) : (
        <View style={tw`p-2`}>
          <View style={tw`flex-row justify-center items-center`}>
            {!!icon && (
              <Icon id={icon as IconType} style={tw`w-5 h-5 mr-2 -mt-3`} color={tw`text-white-1`.color as string} />
            )}
            {!!title && <Text style={tw`font-baloo text-xl leading-xl text-white-2 text-center mb-1`}>{title}</Text>}
          </View>
          {!!message && <Text style={tw`text-white-2 text-center`}>{message}</Text>}
        </View>
      )}
      {close ? (
        <Text onPress={closeMessage} style={[tw`w-full font-baloo text-xs text-white-2 text-right`, textShadow]}>
          X {i18n('close')}
        </Text>
      ) : null}
    </View>
  )
}

export default Message
