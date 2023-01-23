import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Icon, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import { colors } from './ContractItem'

type ChatMessagesProps = {
  messages: number
  level: SummaryItemLevel
}
export const ChatMessages = ({ messages, level }: ChatMessagesProps): ReactElement => (
  <View>
    <Icon id="messageFull" style={tw`w-6 h-6`} color={tw`text-primary-background-light`.color} />
    <Text style={[tw`absolute bottom-0 right-0 w-6 font-bold text-center`, colors[level]]}>{messages}</Text>
  </View>
)
