import React, { ReactElement, useCallback, useContext, useEffect, useRef } from 'react'
import { FlatList, Keyboard, ViewToken } from 'react-native'
import AppContext from '../../../contexts/app'
import tw from '../../../styles/tailwind'
import { getChat, getChatNotifications } from '../../../utils/chat'
import { getRequiredActionCount } from '../../../utils/offer'
import { ChatMessage } from './ChatMessage'

const PAGE_SIZE = 21

type ChatBoxProps = ComponentProps & {
  chat: Chat
  setAndSaveChat: (id: string, c: Partial<Chat>, save?: boolean) => void
  tradingPartner: User['id']
  page: number
  loadMore: () => void
  loading: boolean
  online: boolean
}

export default ({
  chat,
  setAndSaveChat,
  tradingPartner,
  page,
  loadMore,
  loading,
  online,
}: ChatBoxProps): ReactElement => {
  const [, updateAppContext] = useContext(AppContext)
  const scroll = useRef<FlatList<Message>>(null)
  const visibleChatMessages = chat.messages.slice(-(page + 1) * PAGE_SIZE)

  useEffect(() => {
    setTimeout(() => scroll.current?.scrollToEnd({ animated: false }), 300)
  }, [])

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => () => scroll.current?.scrollToEnd({ animated: false }))
  }, [])

  const onContentSizeChange = () =>
    page === 0 ? setTimeout(() => scroll.current?.scrollToEnd({ animated: false }), 50) : () => {}

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
    const lastItem = viewableItems.pop()?.item as Message
    const savedChat = getChat(chat.id)
    if (!lastItem || lastItem.date.getTime() <= savedChat.lastSeen.getTime()) return

    setAndSaveChat(chat.id, { lastSeen: lastItem.date })
    updateAppContext({
      notifications: getChatNotifications() + getRequiredActionCount(),
    })
  }, [])

  return (
    <FlatList
      ref={scroll}
      data={visibleChatMessages}
      onContentSizeChange={onContentSizeChange}
      onScrollToIndexFailed={() => scroll.current?.scrollToEnd()}
      onViewableItemsChanged={onViewableItemsChanged}
      keyExtractor={(item) =>
        item.date.getTime() + item.signature.substring(0, 16) + item.signature.substring(128, 128 + 32)
      }
      renderItem={({ item, index }) => (
        <ChatMessage
          item={item}
          index={index}
          chatMessages={visibleChatMessages}
          tradingPartner={tradingPartner}
          online={online}
        />
      )}
      initialNumToRender={PAGE_SIZE}
      onRefresh={loadMore}
      refreshing={loading}
      contentContainerStyle={tw`pb-10`}
    />
  )
}
