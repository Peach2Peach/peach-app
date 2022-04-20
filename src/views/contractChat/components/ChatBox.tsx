import React, { ReactElement, useEffect, useRef } from 'react'
import { ScrollView, View } from 'react-native'
import { PeachScrollView, Shadow, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { innerShadow } from '../../../utils/layout'

type ChatBoxProps = ComponentProps & {
  messages: Message[],
}

export default ({ messages, style }: ChatBoxProps): ReactElement => {
  const scroll = useRef<ScrollView>(null)

  useEffect(() => {
    scroll.current?.scrollToEnd()
  }, [messages.length])

  return <View style={tw`overflow-hidden rounded`}>
    <Shadow {...innerShadow} viewStyle={[
      tw`w-full h-full flex-col border border-grey-4 rounded py-4`,
      style ? style : {},
    ]}>
      <PeachScrollView scrollRef={scroll} style={tw`w-full h-full px-7`}>
        {messages
          .filter((message: Message) => message.message && message.signature)
          .map((message: Message, i, self) => {
            const isYou = message.from === account.publicKey
            const previous = self[i - 1]
            const showName = !previous || previous.from !== message.from
            return <View key={message.date.getTime() + message.signature.substring(128, 128 + 32)} style={[
              tw`w-11/12`,
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
          })}
      </PeachScrollView>
    </Shadow>
  </View>
}