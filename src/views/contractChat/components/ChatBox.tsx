import React, { ReactElement, useCallback, useContext, useEffect, useRef } from 'react'
import { FlatList, Keyboard, View, ViewToken } from 'react-native'
import { Shadow, Text, TextLink } from '../../../components'
import AppContext from '../../../contexts/app'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import { getChatNotifications, saveChat } from '../../../utils/chat'
import i18n from '../../../utils/i18n'
import { innerShadow } from '../../../utils/layout'

const PAGE_SIZE = 21

type DisputeDisclaimerProps = ComponentProps & {}

const DisputeDisclaimer = ({ style }: DisputeDisclaimerProps): ReactElement => <View style={style}>
  <Text style={tw`text-center text-sm`}>
    {i18n('chat.disputeDisclaimer.1')}
    <Text style={tw`font-bold text-sm`}> {i18n('chat.disputeDisclaimer.2')} </Text>
    {i18n('chat.disputeDisclaimer.3')}
  </Text>
  <Text>
    <Text style={tw`text-center text-sm`}>{i18n('chat.disputeDisclaimer.4')} </Text>
    <TextLink style={tw`text-grey-1 text-sm`} onPress={() => alert('todo')}>
      {i18n('chat.disputeDisclaimer.5')}
    </TextLink>
  </Text>
</View>

type ChatMessageProps = {
  chat: Chat,
  item: Message,
  index: number,
}

const ChatMessage = ({ chat, item, index }: ChatMessageProps): ReactElement => {
  const message = item
  const isYou = message.from === account.publicKey
  const previous = chat.messages[index - 1]
  const showName = !previous || previous.from !== message.from
  return <View onStartShouldSetResponder={() => true}
    key={message.date.getTime() + message.signature.substring(128, 128 + 32)} style={[
      tw`w-11/12 px-7 bg-transparent`,
      isYou ? tw`self-end` : {}
    ]}>
    {showName
      ? <Text style={[
        tw`px-1 mt-4 -mb-1 font-baloo text-xs`,
        isYou ? tw`text-chat-you text-right` : tw`text-chat-partner`
      ]}>{i18n(isYou ? 'chat.you' : 'chat.tradePartner')}</Text>
      : null
    }
    <Text style={[
      tw`p-3 mt-1 rounded`,
      isYou ? tw`bg-chat-you-translucent` : tw`bg-chat-partner-translucent`,
      !message.message ? tw`bg-chat-error-translucent` : {}
    ]}
    >
      {message.message || i18n('chat.decyptionFailed')}
    </Text>
  </View>
}

type ChatBoxProps = ComponentProps & {
  chat: Chat,
  page: number,
  loadMore: () => void,
  loading: boolean
}

export default ({ chat, page, loadMore, loading, style }: ChatBoxProps): ReactElement => {
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

    updateAppContext({
      notifications: getChatNotifications()
    })
    saveChat(chat.id, { lastSeen: lastItem.date })
  }, [])

  return <View style={tw`overflow-hidden rounded`}>
    <Shadow shadow={innerShadow} style={[
      tw`w-full h-full border border-grey-4 rounded`,
      style ? style : {},
    ]}>
      <DisputeDisclaimer style={tw`my-4 px-6`} />
      <FlatList ref={scroll} contentContainerStyle={tw`py-4 pb-10`}
        data={chat.messages.slice(-(page + 1) * PAGE_SIZE)}
        onContentSizeChange={onContentSizeChange}
        onScrollToIndexFailed={() => scroll.current?.scrollToEnd()}
        // onViewableItemsChanged={onViewableItemsChanged}
        keyExtractor={item => item.date.toString()}
        renderItem={({ item, index }) =>
          <ChatMessage chat={chat} item={item} index={index} />
        }
        initialNumToRender={10}
        onRefresh={loadMore}
        refreshing={loading}
      />
    </Shadow>
  </View>
}