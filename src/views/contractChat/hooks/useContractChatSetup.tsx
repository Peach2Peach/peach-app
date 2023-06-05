import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ContractTitle } from '../../../components/titles/ContractTitle'
import { useHeaderSetup, useRoute } from '../../../hooks'
import { useChatMessages } from '../../../hooks/query/useChatMessages'
import { useCommonContractSetup } from '../../../hooks/useCommonContractSetup'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useOpenDispute } from '../../../popups/dispute/hooks/useOpenDispute'
import { useConfirmCancelTrade } from '../../../popups/tradeCancelation/useConfirmCancelTrade'
import { useConfigStore } from '../../../store/configStore'
import { account } from '../../../utils/account'
import { deleteMessage, getChat, getUnsentMessages, saveChat } from '../../../utils/chat'
import { getTradingPartner } from '../../../utils/contract'
import { error } from '../../../utils/log'
import { PeachWSContext } from '../../../utils/peachAPI/websocket'
import { decryptSymmetric, signAndEncryptSymmetric } from '../../../utils/pgp'
import { parseError } from '../../../utils/result'
import { getHeaderChatActions } from '../utils/getHeaderChatActions'
import { useShowDisputeDisclaimer } from './useShowDisputeDisclaimer'

// eslint-disable-next-line max-statements
export const useContractChatSetup = () => {
  const route = useRoute<'contractChat'>()
  const { contractId } = route.params
  const chatId = contractId

  const { connected, send, off, on } = useContext(PeachWSContext)
  const { contract, view } = useCommonContractSetup(contractId)
  const {
    messages,
    isLoading,
    error: messagesError,
    page,
    fetchNextPage,
  } = useChatMessages(contractId, contract?.symmetricKey)
  const showError = useShowErrorBanner()
  const { showConfirmOverlay } = useConfirmCancelTrade()
  const showDisputeDisclaimer = useShowDisputeDisclaimer()
  const openDisputeOverlay = useOpenDispute(contractId)
  const tradingPartner = contract ? getTradingPartner(contract, account) : null
  const [chat, setChat] = useState(getChat(contractId))
  const [newMessage, setNewMessage] = useState(chat.draftMessage)
  const [disableSend, setDisableSend] = useState(false)
  const seenDisputeDisclaimer = useConfigStore((state) => state.seenDisputeDisclaimer)

  useHeaderSetup(
    useMemo(
      () => ({
        titleComponent: <ContractTitle id={contractId} />,
        icons: contract
          ? getHeaderChatActions(contract, () => showConfirmOverlay(contract), openDisputeOverlay, view)
          : [],
      }),
      [contractId, contract, showConfirmOverlay, openDisputeOverlay, view],
    ),
  )

  const setAndSaveChat = (id: string, c: Partial<Chat>, save = true) => setChat(saveChat(id, c, save))

  const sendMessage = useCallback(
    async (message: string) => {
      if (!tradingPartner || !contract?.symmetricKey || !message) return

      const encryptedResult = await signAndEncryptSymmetric(message, contract.symmetricKey)
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
        chatId,
        {
          messages: [messageObject],
          lastSeen: new Date(),
        },
        false,
      )
    },
    [chatId, connected, contract?.symmetricKey, contractId, send, tradingPartner],
  )
  const resendMessage = (message: Message) => {
    if (!connected) return
    deleteMessage(chatId, message)
    sendMessage(message.message)
  }

  const submit = async () => {
    if (!contract || !tradingPartner || !contract.symmetricKey || !newMessage) return
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

  const onChangeMessage = (message: string) => {
    setNewMessage(message)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      const unsentMessages = getUnsentMessages(chat.messages)
      if (unsentMessages.length === 0) return

      setAndSaveChat(chatId, {
        messages: unsentMessages.map((message) => ({ ...message, failedToSend: true })),
      })
    }, 5000)

    return () => clearTimeout(timeout)
  }, [chatId, chat.messages])

  useEffect(() => {
    const messageHandler = async (message: Message) => {
      if (!contract || !contract.symmetricKey) return
      if (!message.message || message.roomId !== `contract-${contract.id}`) return

      let messageBody = ''
      try {
        messageBody = await decryptSymmetric(message.message, contract.symmetricKey)
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
  }, [contract, contractId, connected, on, send, off])

  useEffect(() => {
    if (messages) setAndSaveChat(contractId, { messages })
  }, [contractId, messages])

  useEffect(() => {
    if (messagesError) showError(parseError(messagesError))
  }, [messagesError, showError])

  useEffect(() => {
    if (contract && !contract.disputeActive && !seenDisputeDisclaimer) {
      showDisputeDisclaimer()
    }
  }, [chat, contract, seenDisputeDisclaimer, showDisputeDisclaimer])

  return {
    contract,
    chat,
    connected,
    setAndSaveChat,
    tradingPartner,
    page,
    fetchNextPage,
    isLoading,
    onChangeMessage,
    resendMessage,
    submit,
    disableSend,
    newMessage,
  }
}
