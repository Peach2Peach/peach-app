import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'

import ContractTitle from '../../../components/titles/ContractTitle'
import { useHeaderSetup, useRoute, useThrottledEffect } from '../../../hooks'
import { useChatMessages } from '../../../hooks/query/useChatMessages'
import { useCommonContractSetup } from '../../../hooks/useCommonContractSetup'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useOpenDispute } from '../../../overlays/disputeResults/useOpenDispute'
import { useConfirmCancelTrade } from '../../../overlays/tradeCancelation/useConfirmCancelTrade'
import { account } from '../../../utils/account'
import { getChat, popUnsentMessages, saveChat } from '../../../utils/chat'
import { getTradingPartner } from '../../../utils/contract'
import { error } from '../../../utils/log'
import { PeachWSContext } from '../../../utils/peachAPI/websocket'
import { decryptSymmetric, signAndEncryptSymmetric } from '../../../utils/pgp'
import { parseError } from '../../../utils/system'
import { getHeaderChatActions } from '../utils/getHeaderChatActions'
import { useShowDisputeDisclaimer } from '../utils/useShowDisputeDisclaimer'

// eslint-disable-next-line max-statements
export const useContractChatSetup = () => {
  const route = useRoute<'contractChat'>()
  const { contractId } = route.params

  const ws = useContext(PeachWSContext)
  const { contract, view } = useCommonContractSetup(contractId)
  const {
    messages,
    isLoading,
    error: messagesError,
    fetchNextPage,
    hasNextPage,
  } = useChatMessages(contractId, contract?.symmetricKey)
  const showError = useShowErrorBanner()
  const cancelTradeOverlay = useConfirmCancelTrade(contractId)
  const showDisclaimer = useShowDisputeDisclaimer()
  const openDisputeOverlay = useOpenDispute(contractId)
  const tradingPartner = contract ? getTradingPartner(contract, account) : null
  const [chat, setChat] = useState<Chat>(getChat(contractId))
  const [newMessage, setNewMessage] = useState(chat.draftMessage)
  const [disableSend, setDisableSend] = useState(false)

  useHeaderSetup(
    useMemo(
      () => ({
        titleComponent: <ContractTitle id={contractId} amount={contract?.amount} />,
        icons: contract ? getHeaderChatActions(contract, cancelTradeOverlay, openDisputeOverlay, view) : [],
      }),
      [contractId, contract, cancelTradeOverlay, openDisputeOverlay, view],
    ),
  )

  const setAndSaveChat = (id: string, c: Partial<Chat>, save = true) => setChat(saveChat(id, c, save))

  useThrottledEffect(
    () => {
      setAndSaveChat(contractId, {
        draftMessage: newMessage,
      })
    },
    2000,
    [contractId, newMessage],
  )

  const sendMessage = useCallback(
    async (message: string) => {
      if (!contract || !tradingPartner || !contract.symmetricKey || !ws || !message) return

      const encryptedResult = await signAndEncryptSymmetric(message, contract.symmetricKey)

      if (ws.connected) {
        ws.send(
          JSON.stringify({
            path: '/v1/contract/chat',
            contractId: contract.id,
            message: encryptedResult.encrypted,
            signature: encryptedResult.signature,
          }),
        )
      }

      setAndSaveChat(
        chat.id,
        {
          messages: [
            {
              roomId: `contract-${contract.id}`,
              from: account.publicKey,
              date: new Date(),
              readBy: [],
              message,
              signature: encryptedResult.signature,
            },
          ],
          lastSeen: new Date(),
        },
        false,
      )
    },
    [chat.id, contract, tradingPartner, ws],
  )

  const submit = async () => {
    if (!contract || !tradingPartner || !contract.symmetricKey || !ws || !newMessage) return
    setDisableSend(true)
    setTimeout(() => setDisableSend(false), 300)

    sendMessage(newMessage)
    setNewMessage('')
  }

  const onChangeMessage = (message: string) => {
    setNewMessage(message)
  }

  useEffect(() => {
    const unsentMessages = popUnsentMessages(chat.id)
    if (ws.connected && unsentMessages.length) {
      unsentMessages.forEach((unsent) => {
        sendMessage(unsent.message || '')
      })
    }

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
        ws.send(
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
      ws.off('message', messageHandler)
    }

    if (!ws.connected) return unsubscribe
    ws.on('message', messageHandler)
    return unsubscribe
  }, [chat.id, contract, contractId, sendMessage, ws])

  useEffect(() => {
    if (messages) setAndSaveChat(contractId, { messages })
  }, [contractId, messages])

  useEffect(() => {
    if (messagesError) showError(parseError(messagesError))
  }, [messagesError, showError])

  useEffect(() => {
    if (contract && !contract.disputeActive && account.settings.showDisputeDisclaimer) {
      showDisclaimer()
    }
  }, [contract, showDisclaimer])

  return {
    contract,
    chat,
    setAndSaveChat,
    tradingPartner,
    ws,
    fetchNextPage,
    hasNextPage,
    isLoading,
    onChangeMessage,
    submit,
    disableSend,
    newMessage,
  }
}
