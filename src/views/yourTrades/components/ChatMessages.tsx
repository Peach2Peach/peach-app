import React, { ReactElement } from 'react'
import { View, ViewStyle } from 'react-native'
import { Icon, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import { colors } from './ContractItem'

type ChatMessagesProps = ComponentProps & {
  messages: number
  level: SummaryItemLevel
  textStyle?: ViewStyle | ViewStyle[]
}
export const ChatMessages = ({ messages, level, textStyle, style }: ChatMessagesProps): ReactElement => (
  <View style={[tw`items-center justify-center w-6 h-6`, style]}>
    <Icon
      id={messages > 0 ? 'messageFull' : 'messageCircle'}
      style={tw`w-full h-full`}
      color={tw`text-primary-background-light`.color}
    />
    {messages > 0 && (
      <Text
        numberOfLines={1}
        ellipsizeMode="clip"
        style={[tw`absolute w-full font-bold text-center body-m`, colors[level], textStyle]}
      >
        {messages}
      </Text>
    )}
  </View>
)
