import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { Loading } from '../../components'
import { MessageInput } from '../../components/inputs/MessageInput'
import i18n from '../../utils/i18n'
import { ChatBox } from './components/ChatBox'
import { useContractChatSetup } from './hooks/useContractChatSetup'

export const ContractChat = () => {
  const { contract, tradingPartner, connected, onChangeMessage, submit, disableSend, newMessage, ...chatboxProps }
    = useContractChatSetup()

  return !contract ? (
    <View style={tw`items-center justify-center w-full h-full`}>
      <Loading />
    </View>
  ) : (
    <View style={tw`flex-col h-full`}>
      <View style={[tw`flex-shrink w-full h-full`, !contract.symmetricKey && tw`opacity-50`]}>
        <ChatBox tradingPartner={tradingPartner?.id || ''} online={connected} {...chatboxProps} />
      </View>
      {contract.isChatActive && (
        <View style={tw`w-full`}>
          <MessageInput
            onChange={onChangeMessage}
            onSubmit={submit}
            disabled={!contract.symmetricKey}
            disableSubmit={disableSend}
            value={newMessage}
            placeholder={i18n('chat.yourMessage')}
          />
        </View>
      )}
    </View>
  )
}
