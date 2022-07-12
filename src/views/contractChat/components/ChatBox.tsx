import React, { ReactElement, useCallback, useContext, useEffect, useRef } from 'react'
import { FlatList, Keyboard, View, ViewToken } from 'react-native'
import { Shadow, Text } from '../../../components'
import AppContext from '../../../contexts/app'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import { getChatNotifications, saveChat } from '../../../utils/chat'
import i18n from '../../../utils/i18n'
import { innerShadow } from '../../../utils/layout'
import { getRequiredActionCount } from '../../../utils/offer'

const PAGE_SIZE = 21

type ChatMessageProps = {
  chat: Chat,
  tradingPartner: string,
  item: Message,
  index: number,
}

const ChatMessage = ({ chat, tradingPartner, item, index }: ChatMessageProps): ReactElement => {
  const message = item
  const isYou = message.from === account.publicKey
  const isTradingPartner = message.from === tradingPartner
  const isMediator = !isYou && !isTradingPartner

  const previous = chat.messages[index - 1]
  const showName = !previous || previous.from !== message.from
  const text = isMediator
    ? tw`text-chat-mediator text-center`
    : isYou ? tw`text-chat-you text-right` : tw`text-chat-partner`
  const bgColor = !message.message
    ? tw`bg-chat-error-translucent`
    : isMediator
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
      ]}>{i18n(isMediator ? 'chat.mediator' : isYou ? 'chat.you' : 'chat.tradePartner')}</Text>
      : null
    }
    <Text style={[
      tw`p-3 mt-1 rounded`,
      bgColor
    ]}
    >
      {message.message || i18n('chat.decyptionFailed')}
    </Text>
  </View>
}

type ChatBoxProps = ComponentProps & {
  chat: Chat,
  tradingPartner: User['id'],
  page: number,
  loadMore: () => void,
  loading: boolean
  disclaimer?: ReactElement
}

export default ({ chat, tradingPartner, page, loadMore, loading, disclaimer, style }: ChatBoxProps): ReactElement => {
  const [, updateAppContext] = useContext(AppContext)
  const scroll = useRef<FlatList<Message>>(null)

  useEffect(() => {
    setTimeout(() => scroll.current?.scrollToEnd(), 300)
  }, [])

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => scroll.current?.scrollToEnd)
  }, [])

  const onContentSizeChange = () => page === 0 ? scroll.current?.scrollToEnd({ animated: false }) : () => {}
  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: Array<ViewToken>}) => {
    const lastItem = viewableItems.pop()?.item as Message

    if (!lastItem || lastItem.date.getTime() <= chat.lastSeen.getTime()) return

    saveChat(chat.id, { lastSeen: lastItem.date })
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
        data={chat.messages.slice(-(page + 1) * PAGE_SIZE)}
        onContentSizeChange={onContentSizeChange}
        onScrollToIndexFailed={() => scroll.current?.scrollToEnd()}
        onViewableItemsChanged={onViewableItemsChanged}
        keyExtractor={item => item.date.toString()}
        renderItem={({ item, index }) =>
          <ChatMessage chat={chat} tradingPartner={tradingPartner} item={item} index={index} />
        }
        initialNumToRender={10}
        onRefresh={loadMore}
        refreshing={loading}
      />
    </Shadow>
  </View>
}