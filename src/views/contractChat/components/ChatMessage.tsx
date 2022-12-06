import React, { ReactElement } from 'react'
import { ColorValue, View, ViewStyle } from 'react-native'
import { Icon, Text } from '../../../components'
import { IconType } from '../../../components/icons'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { toTimeFormat } from '../../../utils/string/toShortDateFormat'

type GetMessageMetaProps = {
  message: Message
  previous: Message
  tradingPartner: string
  online: boolean
}
type MessageMeta = {
  online: boolean
  showName: boolean
  name: string
  isYou: boolean
  isTradingPartner: boolean
  isMediator: boolean
  isSystemMessage: boolean
  readByCounterParty: boolean
}

const getMessageMeta = ({ message, previous, tradingPartner, online }: GetMessageMetaProps): MessageMeta => {
  const isYou = message.from === account.publicKey
  const isTradingPartner = message.from === tradingPartner
  const isMediator = !isYou && !isTradingPartner
  const isSystemMessage = message.from === 'system'
  const readByCounterParty = message.readBy?.includes(tradingPartner)
  const showName = !previous || previous.from !== message.from
  const name = i18n(
    isSystemMessage ? 'chat.systemMessage' : isMediator ? 'chat.mediator' : isYou ? 'chat.you' : 'chat.tradePartner',
  )
  return {
    online,
    showName,
    name,
    isYou,
    isTradingPartner,
    isMediator,
    isSystemMessage,
    readByCounterParty,
  }
}

type MessageStyling = {
  text: ViewStyle
  bgColor: ViewStyle
  statusIcon: IconType
  statusIconColor: ColorValue
}
const getMessageStyling = (message: Message, meta: MessageMeta): MessageStyling => {
  const text
    = meta.isMediator || meta.isSystemMessage
      ? tw`text-chat-mediator text-center`
      : meta.isYou
        ? tw`text-chat-you text-right`
        : tw`text-chat-partner`
  const bgColor = !message.message
    ? tw`bg-chat-error-translucent`
    : meta.isMediator || meta.isSystemMessage
      ? tw`bg-chat-mediator-translucent`
      : meta.isYou
        ? tw`bg-chat-you-translucent`
        : tw`bg-chat-partner-translucent`
  const statusIcon
    = message.readBy?.length === 0
      ? !meta.online
        ? 'offline'
        : 'clock'
      : meta.readByCounterParty
        ? 'chatDoubleCheck'
        : 'check'
  const statusIconColor = statusIcon === 'chatDoubleCheck' ? tw`text-blue-1`.color : tw`text-grey-3`.color
  return {
    text,
    bgColor,
    statusIcon,
    statusIconColor: statusIconColor!,
  }
}
type ChatMessageProps = {
  chatMessages: Message[]
  tradingPartner: string
  item: Message
  index: number
  online: boolean
}

export const ChatMessage = ({ chatMessages, tradingPartner, item, index, online }: ChatMessageProps): ReactElement => {
  const message = item
  const meta = getMessageMeta({
    message,
    previous: chatMessages[index - 1],
    tradingPartner,
    online,
  })
  const { statusIcon, statusIconColor, text, bgColor } = getMessageStyling(message, meta)
  return (
    <View
      onStartShouldSetResponder={() => true}
      style={[tw`w-11/12 px-3 bg-transparent`, meta.isMediator ? tw`w-full` : meta.isYou ? tw`self-end` : {}]}
    >
      {meta.showName ? <Text style={[tw`px-1 mt-4 -mb-1 font-baloo text-xs`, text]}>{meta.name}</Text> : null}
      <View style={[tw`flex-row flex-wrap justify-between p-3 mt-1 rounded`, bgColor]}>
        <Text style={tw`flex-shrink-0`}>{message.message || i18n('chat.decyptionFailed')}</Text>
        <Text style={tw`ml-auto text-right leading-5 pt-1`}>
          <Text style={tw`text-xs text-grey-3`}>{toTimeFormat(message.date)}</Text>
          {meta.isYou && (
            <View style={tw`pl-1`}>
              <Icon id={statusIcon} style={tw`relative -bottom-1 w-4 h-4`} color={statusIconColor} />
            </View>
          )}
        </Text>
      </View>
    </View>
  )
}
