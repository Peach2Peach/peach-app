
import React, { ReactElement, ReactNode, useContext } from 'react'
import { View } from 'react-native'

import { Text } from '.'
import tw from '../styles/tailwind'
import { Level, MessageContext } from '../contexts/message'
import i18n from '../utils/i18n'
import { textShadow } from '../utils/layout'

type MessageProps = ComponentProps & {
  template?: ReactNode,
  msg?: string,
  close: boolean|undefined,
  level: Level,
}

/**
 * @description Component to display the Message
 * @param props Component properties
 * @param props.msg the error message
 * @param [props.style] additional styles to apply to the component
 * @example
 * <Message msg="Oops something went wrong!" level="ERROR" />
 */
export const Message = ({ template, msg, level, close, style }: MessageProps): ReactElement => {
  const [, updateMessage] = useContext(MessageContext)

  const closeMessage = () => updateMessage({ template: undefined, msg: undefined, level: 'ERROR' })
  return <View style={[
    tw`w-full flex items-center justify-center px-3 py-2`,
    level === 'OK'
      ? tw`bg-green`
      : level === 'ERROR'
        ? tw`bg-red`
        : level === 'WARN'
          ? tw`bg-yellow-2`
          : tw`bg-blue`,
    style
  ]}>
    {template
      ? template
      : <Text style={tw`text-white-2`}>{msg}</Text>
    }
    {close
      ? <Text onPress={closeMessage} style={[tw`w-full font-baloo text-xs text-white-2 text-right`, textShadow]}>
        X {i18n('close')}
      </Text>
      : null
    }
  </View>
}

export default Message