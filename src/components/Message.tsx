
import React, { ReactElement, ReactNode } from 'react'
import { View } from 'react-native'

import { Text } from '.'
import tw from '../styles/tailwind'
import { Level } from '../contexts/message'

type MessageProps = ComponentProps & {
  template?: ReactNode,
  msg?: string,
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
export const Message = ({ template, msg, level, style }: MessageProps): ReactElement =>
  <View style={[
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
  </View>

export default Message