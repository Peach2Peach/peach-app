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
    resendMessage,
    setAndSaveChat,
    tradingPartner,
    connected,
    page,
    fetchNextPage,
    isLoading,
    onChangeMessage,
    submit,
    disableSend,
    newMessage,
  } = useContractChatSetup()

  const showChatInput = () => {
    const thirtyDays = 30 * 24 * 60 * 60 * 1000
    const now = new Date().getTime()

    if (!contract) return false
    return (
      (!contract.paymentConfirmed || now - contract.paymentConfirmed.getTime() <= thirtyDays)
      && (!contract.paymentMade || now - contract.paymentMade.getTime() <= thirtyDays)
      && (!contract.creationDate || now - contract.creationDate.getTime() <= thirtyDays)
    )
  }

  return !contract ? (
    <View style={tw`items-center justify-center w-full h-full`}>
      <Loading />
    </View>
  ) : (
    <View style={[tw`flex-col h-full`]}>
      <View style={[tw`flex-shrink w-full h-full`, !contract.symmetricKey ? tw`opacity-50` : {}]}>
        <ChatBox
          tradingPartner={tradingPartner?.id || ''}
          online={connected}
          {...{ chat, setAndSaveChat, resendMessage, page, fetchNextPage, isLoading }}
        />
      </View>
      {showChatInput() || contract.disputeActive ? (
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
