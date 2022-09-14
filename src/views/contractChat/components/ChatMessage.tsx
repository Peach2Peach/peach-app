import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { toTimeFormat } from '../../../utils/string/toShortDateFormat'

type ChatMessageProps = {
  chatMessages: Message[],
  tradingPartner: string,
  item: Message,
  index: number,
}

export const ChatMessage = ({ chatMessages, tradingPartner, item, index }: ChatMessageProps): ReactElement => {
  const message = item
  const isYou = message.from === account.publicKey
  const isTradingPartner = message.from === tradingPartner
  const isMediator = !isYou && !isTradingPartner
  const isSystemMessage = message.from === 'system'

  const previous = chatMessages[index - 1]
  const showName = !previous || previous.from !== message.from
  const name = i18n(isSystemMessage
    ? 'chat.systemMessage'
    : isMediator
      ? 'chat.mediator'
      : isYou ? 'chat.you' : 'chat.tradePartner'
  )
  const text = isMediator || isSystemMessage
    ? tw`text-chat-mediator text-center`
    : isYou ? tw`text-chat-you text-right` : tw`text-chat-partner`
  const bgColor = !message.message
    ? tw`bg-chat-error-translucent`
    : isMediator || isSystemMessage
      ? tw`bg-chat-mediator-translucent`
      : isYou ? tw`bg-chat-you-translucent` : tw`bg-chat-partner-translucent`

  return <View onStartShouldSetResponder={() => true}
    key={message.date.getTime() + message.signature.substring(128, 128 + 32)} style={[
      tw`w-11/12 px-3 bg-transparent`,
      isMediator ? tw`w-full` : isYou ? tw`self-end` : {}
    ]}>
    {showName
      ? <Text style={[
        tw`px-1 mt-4 -mb-1 font-baloo text-xs`,
        text,
      ]}>{name}</Text>
      : null
    }
    <View style={[
      tw`flex-row flex-wrap justify-between p-3 mt-1 rounded`,
      bgColor
    ]}>
      <Text style={'flex-shrink-0'}>{message.message || i18n('chat.decyptionFailed')}</Text>
      <Text style={tw`ml-auto text-right text-xs text-grey-3`}>{toTimeFormat(message.date)}</Text>
    </View>
  </View>
}