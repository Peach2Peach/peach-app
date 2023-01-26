/* eslint-disable max-lines */
import React, { ReactElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Text, View } from 'react-native'
import tw from '../../styles/tailwind'

import { useFocusEffect } from '@react-navigation/native'
import { Loading } from '../../components'
import MessageInput from '../../components/inputs/MessageInput'
import { MessageContext } from '../../contexts/message'
import { OverlayContext } from '../../contexts/overlay'
import getContractEffect from '../../effects/getContractEffect'
import getOfferDetailsEffect from '../../effects/getOfferDetailsEffect'
import { useHeaderSetup, useNavigation, useRoute, useThrottledEffect } from '../../hooks'
import { useConfirmCancelTrade } from '../../overlays/tradeCancelation/useConfirmCancelTrade'
import { account } from '../../utils/account'
import { decryptMessage, getChat, popUnsentMessages, saveChat } from '../../utils/chat'
import {
  getContract,
  getOfferHexIdFromContract,
  getOfferIdFromContract,
  getTradingPartner,
  saveContract,
} from '../../utils/contract'
import i18n from '../../utils/i18n'
import { error, info } from '../../utils/log'
import { saveOffer } from '../../utils/offer'
import { PeachWSContext } from '../../utils/peachAPI/websocket'
import { decryptSymmetric, signAndEncryptSymmetric } from '../../utils/pgp'
import { decryptContractData } from '../contract/helpers/decryptContractData'
import { useHandleOverlays } from '../contract/hooks/useHandleOverlays'
import ChatBox from './components/ChatBox'
import { getHeaderChatActions } from './utils/getHeaderChatActions'
import getMessagesEffect from './utils/getMessagesEffect'
import { useShowDisputeDisclaimer } from './utils/useShowDisputeDisclaimer'

// eslint-disable-next-line max-statements, max-lines-per-function
export default (): ReactElement => {
  const route = useRoute<'contractChat'>()
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)
  const ws = useContext(PeachWSContext)
  const handleOverlays = useHandleOverlays()
  const [updatePending, setUpdatePending] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(true)
  const [contractId, setContractId] = useState(route.params.contractId)
  const [contract, setContract] = useState(getContract(contractId))
  const [tradingPartner, setTradingPartner] = useState<User | null>(
    contract ? getTradingPartner(contract, account) : null,
  )
  const [chat, setChat] = useState<Chat>(getChat(contractId))
  const [newMessage, setNewMessage] = useState('')
  const [page, setPage] = useState(0)
  const [disableSend, setDisableSend] = useState(false)

  // choose cancel overlay
  const cancelTradeOverlay = useConfirmCancelTrade(contractId)

  // HEADER CONFIG
  const view = account.publicKey === contract?.seller.id ? 'seller' : 'buyer'
  useHeaderSetup(
    useMemo(
      () =>
        !!contract
          ? {
            titleComponent: (
              <Text style={tw`lowercase text-black-1 h6`}>
                {i18n('contract.trade', getOfferHexIdFromContract(contract))}
                {contract?.disputeActive ? (
                // Did this considering all amounts are un k so max 1000k, but should it be 1M or is there an util ?
                  <Text style={tw`text-black-3`}>
                    {' '}
                      - {contract.amount / 1000}k {i18n('sats')}
                  </Text>
                ) : (
                  <Text style={tw`text-black-3`}> - {i18n('chat')}</Text>
                )}
              </Text>
            ),
            icons: !contract?.disputeActive
              ? getHeaderChatActions(contract, view, cancelTradeOverlay, updateOverlay)
              : [],
          }
          : {},
      [contract],
    ),
  )

  // CHECK SHOW DISPUTE DISCLAIMER
  const showDisclaimer = useShowDisputeDisclaimer()
  useEffect(() => {
    if (contract && !updatePending && !contract.disputeActive && account.settings.showDisputeDisclaimer) {
      showDisclaimer()
    }
  }, [contract, updatePending])

  // INIT CHAT...

  const setAndSaveChat = (id: string, c: Partial<Chat>, save = true) => setChat(saveChat(id, c, save))
  const saveAndUpdate = (contractData: Contract): Contract => {
    if (typeof contractData.creationDate === 'string') contractData.creationDate = new Date(contractData.creationDate)

    setContract(contractData)
    saveContract(contractData)
    return contractData
  }

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

  const initChat = () => {
    setNewMessage(chat.draftMessage)
    if (contract?.id !== route.params.contractId) {
      const c = getContract(route.params.contractId)
      setContractId(route.params.contractId)
      setUpdatePending(true)
      setLoadingMessages(true)
      setPage(0)
      setTradingPartner(c ? (account.publicKey === c.seller.id ? c.buyer : c.seller) : null)
      setChat(getChat(route.params.contractId) || {})
      setContract(c)
    }
  }

  useFocusEffect(useCallback(initChat, [contract?.id, route.params.contractId]))

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

  useFocusEffect(
    useCallback(
      getContractEffect({
        contractId,
        onSuccess: async (result) => {
          info('Got contract', result.id)
          let c = getContract(result.id)
          setTradingPartner(() => (account.publicKey === result.seller.id ? result.buyer : result.seller))

          const { symmetricKey, paymentData } = await decryptContractData({
            ...result,
            symmetricKey: c?.symmetricKey,
            paymentData: c?.paymentData,
          })

          c = saveAndUpdate(
            c
              ? {
                ...c,
                ...result,
                symmetricKey,
                paymentData,
              }
              : {
                ...result,
                symmetricKey,
                paymentData,
              },
          )

          handleOverlays(c, view)
        },
        onError: (err) =>
          updateMessage({
            msgKey: err.error || 'GENERAL_ERROR',
            level: 'ERROR',
            action: {
              callback: () => navigation.navigate('contact'),
              label: i18n('contactUs'),
              icon: 'mail',
            },
          }),
      }),
      [contractId],
    ),
  )

  useFocusEffect(
    useCallback(
      getOfferDetailsEffect({
        offerId: contract ? getOfferIdFromContract(contract) : undefined,
        onSuccess: async (result) => {
          saveOffer(result, false)
        },
        onError: (err) =>
          updateMessage({
            msgKey: err.error || 'GENERAL_ERROR',
            level: 'ERROR',
            action: {
              callback: () => navigation.navigate('contact'),
              label: i18n('contactUs'),
              icon: 'mail',
            },
          }),
      }),
      [contract],
    ),
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
  }, [contractId, page, updateMessage])

  return !contract || updatePending ? (
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
          page={page}
          loadMore={loadMore}
          loading={loadingMessages}
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
