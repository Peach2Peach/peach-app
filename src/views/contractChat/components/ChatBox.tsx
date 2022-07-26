import React, { ReactElement, useCallback, useContext, useEffect, useRef } from 'react'
import { FlatList, Keyboard, View, ViewToken } from 'react-native'
import { Shadow, Text } from '../../../components'
import AppContext from '../../../contexts/app'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import { getChat, getChatNotifications, saveChat } from '../../../utils/chat'
import i18n from '../../../utils/i18n'
import { innerShadow } from '../../../utils/layout'
import { getRequiredActionCount } from '../../../utils/offer'
import { toTimeFormat } from '../../../utils/string/toShortDateFormat'

const PAGE_SIZE = 21

type ChatMessageProps = {
  chatMessages: Message[],
  tradingPartner: string,
  item: Message,
  index: number,
}

const ChatMessage = ({ chatMessages, tradingPartner, item, index }: ChatMessageProps): ReactElement => {
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
      tw`w-11/12 px-7 bg-transparent`,
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

type ChatBoxProps = ComponentProps & {
  chat: Chat,
  setAndSaveChat: (id: string, c: Partial<Chat>, save?: boolean) => void,
  tradingPartner: User['id'],
  page: number,
  loadMore: () => void,
  loading: boolean
  disclaimer?: ReactElement
}

export default ({
  chat,
  setAndSaveChat,
  tradingPartner,
  page,
  loadMore,
  loading,
  disclaimer,
  style
}: ChatBoxProps): ReactElement => {
  const [, updateAppContext] = useContext(AppContext)
  const scroll = useRef<FlatList<Message>>(null)
  const visibleChatMessages = chat.messages.slice(-(page + 1) * PAGE_SIZE)

  useEffect(() => {
    setTimeout(() => scroll.current?.scrollToEnd(), 300)
  }, [])

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => scroll.current?.scrollToEnd)
  }, [])

  const onContentSizeChange = () => page === 0
    ? setTimeout(() => scroll.current?.scrollToEnd({ animated: false }), 50)
    : () => {}

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: Array<ViewToken>}) => {
    const lastItem = viewableItems.pop()?.item as Message
    const savedChat = getChat(chat.id)
    if (!lastItem || lastItem.date.getTime() <= savedChat.lastSeen.getTime()) return

    setAndSaveChat(chat.id, { lastSeen: lastItem.date })
    updateAppContext({
      notifications: getChatNotifications() + getRequiredActionCount()
    })
  }, [])

  return <View style={tw`overflow-hidden rounded`}>
    <Shadow shadow={innerShadow} style={[
      tw`w-full h-full border border-grey-4 rounded`,
      style ? style : {},
    ]}>
      {disclaimer ? <View style={tw`my-4 px-6`}>{disclaimer}</View> : null}
      <FlatList ref={scroll} contentContainerStyle={tw`py-4 pb-10`}
        data={visibleChatMessages}
        onContentSizeChange={onContentSizeChange}
        onScrollToIndexFailed={() => scroll.current?.scrollToEnd()}
        onViewableItemsChanged={onViewableItemsChanged}
        keyExtractor={item =>
          item.date.getTime().toString() + (item.message || '')
        }
        renderItem={({ item, index }) =>
          <ChatMessage chatMessages={visibleChatMessages} tradingPartner={tradingPartner} item={item} index={index} />
        }
        initialNumToRender={10}
        onRefresh={loadMore}
        refreshing={loading}
      />
    </Shadow>
  </View>
}