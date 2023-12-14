import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Contract } from '../../../peach-api/src/@types/contract'
import { Screen } from '../../components'
import { Header } from '../../components/Header'
import { MessageInput } from '../../components/inputs/MessageInput'
import { useRoute } from '../../hooks'
import { useChatMessages } from '../../hooks/query/useChatMessages'
import { useContractDetails } from '../../hooks/query/useContractDetails'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { useOpenDispute } from '../../popups/dispute/hooks/useOpenDispute'
import { useConfirmCancelTrade } from '../../popups/tradeCancelation'
import { useAccountStore } from '../../utils/account/account'
import { deleteMessage } from '../../utils/chat/deleteMessage'
import { getChat } from '../../utils/chat/getChat'
import { getUnsentMessages } from '../../utils/chat/getUnsentMessages'
import { saveChat } from '../../utils/chat/saveChat'
import { canCancelContract } from '../../utils/contract/canCancelContract'
import { contractIdToHex } from '../../utils/contract/contractIdToHex'
import { getContractViewer } from '../../utils/contract/getContractViewer'
import { getTradingPartner } from '../../utils/contract/getTradingPartner'
import { headerIcons } from '../../utils/layout/headerIcons'
import { error } from '../../utils/log'
import { isCashTrade } from '../../utils/paymentMethod/isCashTrade'
import { useWebsocketContext } from '../../utils/peachAPI/websocket'
import { decryptSymmetric } from '../../utils/pgp/decryptSymmetric'
import { signAndEncryptSymmetric } from '../../utils/pgp/signAndEncryptSymmetric'
import { parseError } from '../../utils/result/parseError'
import { LoadingScreen } from '../loading/LoadingScreen'
import { ChatBox } from './components/ChatBox'
import { useDecryptedContractData } from './useDecryptedContractData'

export const ContractChat = () => {
  const { contractId } = useRoute<'contractChat'>().params
  const { contract } = useContractDetails(contractId)

  return !contract ? <LoadingScreen /> : <ChatScreen contract={contract} />
}

function ChatScreen ({ contract }: { contract: Contract }) {
  const { data: decryptedData } = useDecryptedContractData(contract)
  const { contractId } = useRoute<'contractChat'>().params

  const { connected, send, off, on } = useWebsocketContext()
  const {
    messages,
    isLoading,
    error: messagesError,
    page,
    fetchNextPage,
  } = useChatMessages({ id: contractId, symmetricKey: decryptedData?.symmetricKey })
  const showError = useShowErrorBanner()
  const account = useAccountStore((state) => state.account)
  const tradingPartner = contract ? getTradingPartner(contract, account) : null
  const [chat, setChat] = useState(getChat(contractId))
  const [newMessage, setNewMessage] = useState(chat.draftMessage)
  const [disableSend, setDisableSend] = useState(false)

  const setAndSaveChat = (id: string, c: Partial<Chat>, save = true) => setChat(saveChat(id, c, save))

  const sendMessage = useCallback(
    async (message: string) => {
      if (!tradingPartner || !decryptedData?.symmetricKey || !message) return

      const encryptedResult = await signAndEncryptSymmetric(message, decryptedData.symmetricKey)
      const messageObject: Message = {
        roomId: `contract-${contractId}`,
        from: account.publicKey,
        date: new Date(),
        readBy: [],
        message,
        signature: encryptedResult.signature,
      }
      if (connected) {
        send(
          JSON.stringify({
            path: '/v1/contract/chat',
            contractId,
            message: encryptedResult.encrypted,
            signature: encryptedResult.signature,
          }),
        )
      }

      setAndSaveChat(
        contractId,
        {
          messages: [messageObject],
          lastSeen: new Date(),
        },
        false,
      )
    },
    [contractId, connected, decryptedData?.symmetricKey, send, tradingPartner, account.publicKey],
  )
  const resendMessage = (message: Message) => {
    if (!connected) return
    deleteMessage(contractId, message)
    sendMessage(message.message)
  }

  const submit = () => {
    if (!contract || !tradingPartner || !decryptedData?.symmetricKey || !newMessage) return
    setDisableSend(true)
    setTimeout(() => setDisableSend(false), 300)

    sendMessage(newMessage)
    setNewMessage('')
    setAndSaveChat(contractId, {
      draftMessage: '',
    })
  }

  useEffect(
    () => () => {
      // save draft message if screen is unmounted
      setAndSaveChat(contractId, {
        draftMessage: newMessage,
      })
    },
    [contractId, newMessage],
  )

  useEffect(() => {
    const timeout = setTimeout(() => {
      const unsentMessages = getUnsentMessages(chat.messages)
      if (unsentMessages.length === 0) return

      setAndSaveChat(contractId, {
        messages: unsentMessages.map((message) => ({ ...message, failedToSend: true })),
      })
    }, 5000)

    return () => clearTimeout(timeout)
  }, [contractId, chat.messages])

  useEffect(() => {
    const messageHandler = async (message?: Message) => {
      if (!message) return
      if (!contract || !decryptedData?.symmetricKey) return
      if (!message.message || message.roomId !== `contract-${contract.id}`) return

      let messageBody = ''
      try {
        messageBody = await decryptSymmetric(message.message, decryptedData.symmetricKey)
      } catch {
        error(new Error(`Could not decrypt message for contract ${contract.id}`))
      }
      const decryptedMessage = {
        ...message,
        date: new Date(message.date),
        message: messageBody,
      }
      setAndSaveChat(contractId, {
        messages: [decryptedMessage],
      })
      if (!message.readBy.includes(account.publicKey)) {
        send(
          JSON.stringify({
            path: '/v1/contract/chat/received',
            contractId: contract.id,
            start: message.date,
            end: message.date,
          }),
        )
      }
    }
    const unsubscribe = () => {
      off('message', messageHandler)
    }

    if (!connected) return unsubscribe
    on('message', messageHandler)
    return unsubscribe
  }, [contract, contractId, connected, on, send, off, decryptedData?.symmetricKey, account.publicKey])

  useEffect(() => {
    if (messages) setAndSaveChat(contractId, { messages })
  }, [contractId, messages])

  useEffect(() => {
    if (messagesError) showError(parseError(messagesError))
  }, [messagesError, showError])

  return (
    <Screen
      style={tw`p-0`}
      header={<ContractChatHeader contract={contract} symmetricKey={decryptedData?.symmetricKey} />}
    >
      <View style={[tw`flex-1`, !decryptedData?.symmetricKey && tw`opacity-50`]}>
        <ChatBox
          tradingPartner={tradingPartner?.id || ''}
          online={connected}
          chat={chat}
          setAndSaveChat={setAndSaveChat}
          page={page}
          fetchNextPage={fetchNextPage}
          isLoading={isLoading}
          resendMessage={resendMessage}
        />
      </View>
      {contract.isChatActive && (
        <View style={tw`w-full`}>
          <MessageInput
            onChangeText={setNewMessage}
            onSubmit={submit}
            disabled={!decryptedData?.symmetricKey}
            disableSubmit={disableSend}
            value={newMessage}
          />
        </View>
      )}
    </Screen>
  )
}

type Props = {
  contract: Contract
  symmetricKey?: string
}

function ContractChatHeader ({ contract, symmetricKey }: Props) {
  const account = useAccountStore((state) => state.account)
  const view = getContractViewer(contract.seller.id, account)
  const { contractId } = useRoute<'contractChat'>().params

  const showConfirmPopup = useConfirmCancelTrade()
  const openDisputePopup = useOpenDispute(contractId)

  const memoizedIcons = useMemo(() => {
    if (contract?.disputeActive) return []

    const canCancel = canCancelContract(contract, view)
    const canDispute = canOpenDispute(contract, view, symmetricKey)

    const icons = []
    if (canCancel) {
      icons.push({
        ...headerIcons.cancel,
        onPress: () => showConfirmPopup(contract),
      })
    }
    if (canDispute) {
      icons.push({
        ...headerIcons.warning,
        onPress: openDisputePopup,
      })
    }
    return icons
  }, [contract, openDisputePopup, showConfirmPopup, symmetricKey, view])

  return <Header title={contractIdToHex(contractId)} icons={memoizedIcons} />
}

function canOpenDispute (contract: Contract, view: ContractViewer, symmetricKey?: string) {
  return (
    !!symmetricKey
    && ((!contract.disputeActive && !isCashTrade(contract.paymentMethod))
      || (view === 'seller' && contract.cancelationRequested))
  )
}
