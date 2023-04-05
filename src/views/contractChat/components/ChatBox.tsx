import { ReactElement, useCallback, useEffect, useRef } from 'react'
import { FlatList, Keyboard, View, ViewToken } from 'react-native'
import tw from '../../../styles/tailwind'
import { getChat } from '../../../utils/chat'
import { ChatMessage } from './ChatMessage'

const PAGE_SIZE = 21

type ChatBoxProps = ComponentProps & {
  chat: Chat
  setAndSaveChat: (id: string, c: Partial<Chat>, save?: boolean) => void
  resendMessage: (message: Message) => void
  tradingPartner: User['id']
  page: number
  fetchNextPage: () => void
  isLoading: boolean
  online: boolean
}

export default ({
  chat,
  setAndSaveChat,
  page,
  fetchNextPage,
  isLoading,
  ...chatMessageProps
}: ChatBoxProps): ReactElement => {
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
      onRefresh={fetchNextPage}
      refreshing={isLoading}
    />
  )
}
