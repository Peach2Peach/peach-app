import React, { ReactElement } from 'react'
import { ViewStyle } from 'react-native'
import { Shadow } from 'react-native-shadow-2'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import { innerShadow } from '../../../utils/layout'

type ChatBoxProps = {
  messages: Message[],
  style?: ViewStyle|ViewStyle[]
}

export default ({ messages, style }: ChatBoxProps): ReactElement =>
  <Shadow {...innerShadow} viewStyle={[
    tw`w-full flex flex-row items-center h-10 border border-grey-4 rounded pl-7 pr-3`,
    style ? style : {},
  ]}>
    {messages.map((message: Message) => <Text>{message.message}</Text>)}
  </Shadow>