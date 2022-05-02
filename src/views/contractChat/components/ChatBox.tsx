import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { FlatList, Keyboard, View, ViewToken } from 'react-native'
import { Shadow, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import { saveChat } from '../../../utils/chat'
import i18n from '../../../utils/i18n'
import { innerShadow } from '../../../utils/layout'

type RenderItemProps = {
  item: Message,
  index: number,
}

type ChatBoxProps = ComponentProps & {
  chat: Chat,
}

export default ({ chat, style }: ChatBoxProps): ReactElement => {
  const scroll = useRef<FlatList<Message>>(null)
  const renderItem = ({ item, index }: RenderItemProps) => {
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

  useEffect(() => scroll.current?.scrollToEnd(), [chat.messages])

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => scroll.current?.scrollToEnd)
    Keyboard.addListener('keyboardDidHide', () => scroll.current?.scrollToEnd)
  }, [])

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: Array<ViewToken>}) => {
    const lastItem = viewableItems.pop()
    if (!(lastItem?.index && lastItem?.index >= 0)) return

    const lastSeen = chat.messages[lastItem.index]
    if (!lastSeen) return

    saveChat(chat.id, { lastSeen: lastSeen.date })
  }, [])

  return <View style={tw`overflow-hidden rounded`}>
    <Shadow {...innerShadow} viewStyle={[
      tw`w-full border border-grey-4 rounded`,
      style ? style : {},
    ]}>
      <FlatList ref={scroll} contentContainerStyle={tw`py-4 pb-10`}
        data={chat.messages}
        onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: false })}
        onScrollToIndexFailed={() => scroll.current?.scrollToEnd()}
        onViewableItemsChanged={onViewableItemsChanged}
        keyExtractor={item => item.date.toString()}
        renderItem={renderItem}
      />
    </Shadow>
  </View>
}