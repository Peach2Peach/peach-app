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
  <View style={[tw`items-center justify-center w-20px h-20px`, style]}>
    <Icon
      id={messages > 0 ? 'messageFull' : 'messageCircle'}
      style={tw`w-full h-full`}
      color={iconColor ?? tw`text-primary-background-light`.color}
    />
    {messages > 0 && (
      <Text
        numberOfLines={1}
        ellipsizeMode="clip"
        style={[tw`absolute font-bold text-center body-s text-14px text-primary-main pb-2px pl-2px`, textStyle]}
      >
        {messages}
      </Text>
    )}
  </View>
)
