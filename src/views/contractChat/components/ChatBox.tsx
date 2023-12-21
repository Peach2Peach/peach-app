import { useCallback, useEffect, useRef } from 'react'
import { FlatList, Keyboard, View, ViewToken } from 'react-native'
import { PAGE_SIZE } from '../../../hooks/query/useChatMessages'
import tw from '../../../styles/tailwind'
import { getChat } from '../../../utils/chat/getChat'
import { ChatMessage } from './ChatMessage'

type Props = {
  chat: Chat
  setAndSaveChat: (id: string, c: Partial<Chat>, save?: boolean) => void
  resendMessage: (message: Message) => void
  tradingPartner: User['id']
  page: number
  fetchNextPage: () => void
  isLoading: boolean
  online: boolean
}

export const ChatBox = ({ chat, setAndSaveChat, page, fetchNextPage, isLoading, ...chatMessageProps }: Props) => {
  const scroll = useRef<FlatList<Message>>(null)
  const visibleChatMessages = chat.messages.slice(-(page + 1) * PAGE_SIZE)

  useEffect(() => {
    console.log(page)
    if (visibleChatMessages.length === 0 || page > 0) return
    setTimeout(() => scroll.current?.scrollToEnd({ animated: false }), 300)
  }, [chat.messages.length, page, visibleChatMessages.length])

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => () => scroll.current?.scrollToEnd({ animated: false }))
  }, [])

  const onContentSizeChange = () =>
    page === 0 && visibleChatMessages.length > 0
      ? setTimeout(() => scroll.current?.scrollToEnd({ animated: false }), 50)
      : () => {}

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
    const lastItem = viewableItems.pop()?.item as Message
    const savedChat = getChat(chat.id)
    if (!lastItem || lastItem.date.getTime() <= savedChat.lastSeen.getTime()) return

    setAndSaveChat(chat.id, { lastSeen: lastItem.date })
  }, [])

  return (
    <FlatList
      ref={scroll}
      data={visibleChatMessages}
      {...{ onContentSizeChange, onViewableItemsChanged }}
      onScrollToIndexFailed={() => scroll.current?.scrollToEnd()}
      keyExtractor={(item) =>
        item.date.getTime() + item.signature.substring(0, 16) + item.signature.substring(128, 128 + 32)
      }
      renderItem={({ item, index }) => (
        <ChatMessage chatMessages={visibleChatMessages} {...{ item, index, ...chatMessageProps }} />
      )}
      initialNumToRender={PAGE_SIZE}
      ListFooterComponent={<View style={tw`h-2`}></View>}
      removeClippedSubviews={false}
      onRefresh={fetchNextPage}
      refreshing={isLoading}
    />
  )
}
