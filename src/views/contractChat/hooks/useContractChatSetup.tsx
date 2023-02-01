import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { useFocusEffect } from '@react-navigation/native'
import ContractTitle from '../../../components/titles/ContractTitle'
import { MessageContext } from '../../../contexts/message'
import { OverlayContext } from '../../../contexts/overlay'
import { useHeaderSetup, useNavigation, useRoute, useThrottledEffect } from '../../../hooks'
import { useCommonContractSetup } from '../../../hooks/useCommonContractSetup'
import { useConfirmCancelTrade } from '../../../overlays/tradeCancelation/useConfirmCancelTrade'
import { account } from '../../../utils/account'
import { decryptMessage, getChat, popUnsentMessages, saveChat } from '../../../utils/chat'
import { getTradingPartner } from '../../../utils/contract'
import { decryptContractData } from '../../../utils/contract/decryptContractData'
import i18n from '../../../utils/i18n'
import { error } from '../../../utils/log'
import { PeachWSContext } from '../../../utils/peachAPI/websocket'
import { decryptSymmetric, signAndEncryptSymmetric } from '../../../utils/pgp'
import { getHeaderChatActions } from '../utils/getHeaderChatActions'
import getMessagesEffect from '../utils/getMessagesEffect'
import { useShowDisputeDisclaimer } from '../utils/useShowDisputeDisclaimer'
import { useOpenDispute } from '../../../overlays/dispute/hooks/useOpenDispute'

// eslint-disable-next-line max-statements
export const useContractChatSetup = () => {
  const route = useRoute<'contractChat'>()
  const { contractId } = route.params
  const [, updateMessage] = useContext(MessageContext)

  const navigation = useNavigation()
  const ws = useContext(PeachWSContext)
  const { contract, view, saveAndUpdate } = useCommonContractSetup(contractId)

  const cancelTradeOverlay = useConfirmCancelTrade(contractId)
  const showDisclaimer = useShowDisputeDisclaimer()
  const openDisputeOverlay = useOpenDispute(contractId)

  const [updatePending, setUpdatePending] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(true)
  const tradingPartner = contract ? getTradingPartner(contract, account) : null
  const [chat, setChat] = useState<Chat>(getChat(contractId))
  const [newMessage, setNewMessage] = useState('')
  const [page, setPage] = useState(0)
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

  const loadMore = () => {
    setLoadingMessages(true)
    setPage((p) => p + 1)
  }

  useFocusEffect(
    useCallback(() => {
      setNewMessage(chat.draftMessage)
      if (contract?.id !== contractId) {
        setUpdatePending(true)
        setLoadingMessages(true)
        setPage(0)
        setChat(getChat(contractId) || {})
      }
    }, [contract?.id, contractId]),
  )

  useFocusEffect(
    useCallback(() => {
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
    }, [chat.id, contract, contractId, sendMessage, ws]),
  )

  useEffect(() => {
    if (!contract) return
    getMessagesEffect({
      contractId: contract.id,
      page,
      onSuccess: async (result) => {
        if (!contract || !contract.symmetricKey) {
          setUpdatePending(false)
          return
        }
        let decryptedMessages = await Promise.all(result.map(decryptMessage(chat, contract.symmetricKey)))

        if (decryptedMessages.some((m) => m.message === null)) {
          // delete symmetric key to let app decrypt actual one
          const { symmetricKey } = await decryptContractData({
            ...contract,
            symmetricKey: undefined,
          })

          if (!symmetricKey) return

          saveAndUpdate({
            ...contract,
            unreadMessages: 0,
            symmetricKey,
          })

          decryptedMessages = await Promise.all(decryptedMessages.map(decryptMessage(chat, symmetricKey)))
        }

        if (decryptedMessages.some((m) => m.message === null)) {
          error('Could not decrypt all messages', contract.id)
        }

        setAndSaveChat(contractId, {
          messages: decryptedMessages,
        })
        setLoadingMessages(false)
        setUpdatePending(false)
      },
      onError: (err) => {
        setUpdatePending(false)
        setLoadingMessages(false)
        updateMessage({
          msgKey: err.error || 'GENERAL_ERROR',
          level: 'ERROR',
          action: {
            callback: () => navigation.navigate('contact'),
            label: i18n('contactUs'),
            icon: 'mail',
          },
        })
      },
    })()
  }, [contract, contractId, navigation, page, updateMessage])

  useEffect(() => {
    if (contract && !updatePending && !contract.disputeActive && account.settings.showDisputeDisclaimer) {
      showDisclaimer()
    }
  }, [contract, showDisclaimer, updatePending])

  return {
    contract,
    chat,
    setAndSaveChat,
    tradingPartner,
    ws,
    page,
    loadMore,
    loadingMessages,
    onChangeMessage,
    submit,
    disableSend,
    newMessage,
  }
}
