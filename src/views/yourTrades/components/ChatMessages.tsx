import React, { ReactElement } from 'react'
import { ColorValue, View, ViewStyle } from 'react-native'
import { Icon, Text } from '../../../components'
import tw from '../../../styles/tailwind'

type ChatMessagesProps = ComponentProps & {
  messages: number
  iconColor?: ColorValue
  iconStyle?: ViewStyle
  textStyle?: ViewStyle | ViewStyle[]
}
export const ChatMessages = ({ messages, iconColor, textStyle, style }: ChatMessagesProps): ReactElement => (
  <View style={[tw`items-center justify-center w-5 h-5`, style]}>
    <Icon
      id={messages > 0 ? 'messageFull' : 'messageCircle'}
      style={tw`w-full h-full`}
      color={iconColor ?? tw`text-primary-background-light`.color}
    />
    {messages > 0 && (
      <Text
        numberOfLines={1}
        ellipsizeMode="clip"
        style={[tw`absolute font-bold text-center body-s text-primary-main pb-0.5`, textStyle]}
      >
        {messages}
      </Text>
    )}
  </View>
)
