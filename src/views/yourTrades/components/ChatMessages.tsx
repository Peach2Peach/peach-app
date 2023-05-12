import { ColorValue, View, ViewStyle } from 'react-native'
import { Icon, Text } from '../../../components'
import tw from '../../../styles/tailwind'

type ChatMessagesProps = ComponentProps & {
  messages: number
  iconColor?: ColorValue
  iconStyle?: ViewStyle
  textStyle?: ViewStyle | ViewStyle[]
}
export const ChatMessages = ({ messages, iconColor, textStyle, style }: ChatMessagesProps) => (
  <View style={[tw`items-center justify-center w-20px h-20px`, style]}>
    <Icon
      id={messages > 0 ? 'messageFull' : 'messageCircle'}
      style={tw`w-full h-full`}
      color={iconColor ?? tw.color('primary-background-light')}
    />
    {messages > 0 && (
      <Text
        numberOfLines={1}
        ellipsizeMode="clip"
        style={[tw`absolute font-bold text-center body-s text-14px text-primary-main pb-2px`, textStyle]}
      >
        {messages}
      </Text>
    )}
  </View>
)

export const NewChatMessages = ({ messages, style }: ChatMessagesProps) => (
  <View style={[tw`items-center justify-center`, style]}>
    <Icon
      id={messages > 0 ? 'messageFull' : 'messageCircle'}
      style={tw`w-3 h-3`}
      color={tw.color('primary-background-light')}
    />
    {messages > 0 && (
      <Text numberOfLines={1} ellipsizeMode="clip" style={[tw`absolute font-bold text-center pl-2px text-10px`]}>
        {messages}
      </Text>
    )}
  </View>
)
