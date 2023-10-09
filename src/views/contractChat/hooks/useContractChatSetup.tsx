import { useCallback, useEffect, useState } from 'react'
import { useRoute } from '../../../hooks'
import { useChatMessages } from '../../../hooks/query/useChatMessages'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { account } from '../../../utils/account'
import { deleteMessage, getChat, getUnsentMessages, saveChat } from '../../../utils/chat'
import { getTradingPartner } from '../../../utils/contract'
import { error } from '../../../utils/log'
import { useWebsocketContext } from '../../../utils/peachAPI/websocket'
import { decryptSymmetric, signAndEncryptSymmetric } from '../../../utils/pgp'
import { parseError } from '../../../utils/result'
import { useDecryptedContractData } from '../useDecryptedContractData'

export const useContractChatSetup = (contract: Contract) => {
  const { contractId } = useRoute<'contractChat'>().params
  const { data: decryptedData } = useDecryptedContractData(contract)

  const { connected, send, off, on } = useWebsocketContext()
  const {
    messages,
    isLoading,
    error: messagesError,
    page,
    fetchNextPage,
  } = useChatMessages(contractId, decryptedData?.symmetricKey)
  const showError = useShowErrorBanner()
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
    [contractId, connected, decryptedData?.symmetricKey, send, tradingPartner],
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
    const messageHandler = async (message: Message) => {
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
  }, [contract, contractId, connected, on, send, off, decryptedData?.symmetricKey])

  useEffect(() => {
    if (messages) setAndSaveChat(contractId, { messages })
  }, [contractId, messages])

  useEffect(() => {
    if (messagesError) showError(parseError(messagesError))
  }, [messagesError, showError])

  return {
    contract,
    chat,
    connected,
    setAndSaveChat,
    tradingPartner,
    page,
    fetchNextPage,
    isLoading,
    setNewMessage,
    resendMessage,
    submit,
    disableSend,
    newMessage,
  }
}
