/* eslint-disable max-lines */
import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { Loading } from '../../components'
import MessageInput from '../../components/inputs/MessageInput'
import i18n from '../../utils/i18n'
import ChatBox from './components/ChatBox'
import { useContractChatSetup } from './hooks/useContractChatSetup'

// eslint-disable-next-line max-statements, max-lines-per-function
export default (): ReactElement => {
  const {
    contract,
    chat,
    setAndSaveChat,
    tradingPartner,
    ws,
    fetchNextPage,
    isLoading,
    onChangeMessage,
    submit,
    disableSend,
    newMessage,
  } = useContractChatSetup()
  return !contract ? (
    <View style={tw`items-center justify-center w-full h-full`}>
      <Loading />
    </View>
  ) : (
    <View style={[tw`flex-col h-full`]}>
      <View style={[tw`flex-shrink w-full h-full`, !contract.symmetricKey ? tw`opacity-50` : {}]}>
        <ChatBox
          chat={chat}
          setAndSaveChat={setAndSaveChat}
          tradingPartner={tradingPartner?.id || ''}
          online={ws.connected}
          onRefresh={fetchNextPage}
          loading={isLoading}
        />
      </View>
      {!contract.canceled || contract.disputeActive ? (
        <View style={tw`w-full bg-white-1`}>
          <MessageInput
            onChange={onChangeMessage}
            onSubmit={submit}
            disabled={!contract.symmetricKey}
            disableSubmit={disableSend}
            value={newMessage}
            placeholder={i18n('chat.yourMessage')}
          />
        </View>
      ) : null}
    </View>
  )
}
