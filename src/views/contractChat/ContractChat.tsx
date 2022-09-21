import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { Loading } from '../../components'
import MessageInput from '../../components/inputs/MessageInput'
import { MessageContext } from '../../contexts/message'
import { OverlayContext } from '../../contexts/overlay'
import getContractEffect from '../../effects/getContractEffect'
import { account } from '../../utils/account'
import { decryptMessage, getChat, popUnsentMessages, saveChat } from '../../utils/chat'
import { createDisputeSystemMessages } from '../../utils/chat/createSystemMessage'
import { getContract, saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { error, info } from '../../utils/log'
import { StackNavigation } from '../../utils/navigation'
import { PeachWSContext } from '../../utils/peachAPI/websocket'
import { sleep } from '../../utils/performance/sleep'
import { decryptSymmetric, signAndEncryptSymmetric } from '../../utils/pgp'
import { handleOverlays } from '../contract/helpers/handleOverlays'
import { parseContract } from '../contract/helpers/parseContract'
import ChatBox from './components/ChatBox'
import { ChatHeader } from './components/ChatHeader'
import { DisputeDisclaimer } from './components/DisputeDisclaimer'
import getMessagesEffect from './effects/getMessagesEffect'

type Props = {
  route: RouteProp<{params: RootStackParamList['contractChat']}>
  navigation: StackNavigation
}

// eslint-disable-next-line max-lines-per-function, max-statements
export default ({ route, navigation }: Props): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)
  const ws = useContext(PeachWSContext)

  const [updatePending, setUpdatePending] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(true)
  const [contractId, setContractId] = useState(route.params.contractId)
  const [contract, setContract] = useState<Contract | null>(() => getContract(contractId))
  const [tradingPartner, setTradingPartner] = useState<User | null>(
    contract ? (account.publicKey === contract.seller.id ? contract.buyer : contract.seller) : null,
  )
  const [chat, setChat] = useState<Chat>(getChat(contractId))
  const [newMessage, setNewMessage] = useState('')
  const [page, setPage] = useState(0)
  const [disableSend, setDisableSend] = useState(false)

  const setAndSaveChat = (id: string, c: Partial<Chat>, save = true) => setChat(saveChat(id, c, save))

  const saveAndUpdate = (contractData: Contract): Contract => {
    if (typeof contractData.creationDate === 'string') contractData.creationDate = new Date(contractData.creationDate)

    setContract(contractData)
    saveContract(contractData)
    return contractData
  }

  const sendMessage = async (message: string) => {
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
  }

  const submit = async () => {
    if (!contract || !tradingPartner || !contract.symmetricKey || !ws || !newMessage) return
    setDisableSend(true)
    setTimeout(() => setDisableSend(false), 300)

    sendMessage(newMessage)
    setNewMessage('')
  }

  const loadMore = () => {
    setLoadingMessages(true)
    setPage(p => p + 1)
  }

  const initChat = () => {
    if (contract?.id !== route.params.contractId) {
      const c = getContract(route.params.contractId)
      setContractId(route.params.contractId)
      setUpdatePending(true)
      setLoadingMessages(true)
      setPage(0)
      setNewMessage('')
      setTradingPartner(c ? (account.publicKey === c.seller.id ? c.buyer : c.seller) : null)
      setChat(getChat(route.params.contractId) || {})
      setContract(c)
    }
  }

  const showDisclaimer = async () => {
    await sleep(1000)
    updateMessage({
      template: <DisputeDisclaimer navigation={navigation} contract={contract!} />,
      level: 'INFO',
      close: false,
    })
  }

  useFocusEffect(useCallback(initChat, [route]))

  useFocusEffect(
    useCallback(() => {
      const unsentMessages = popUnsentMessages(chat.id)
      if (ws.connected && unsentMessages.length) {
        unsentMessages.forEach(unsent => {
          sendMessage(unsent.message || '')
        })
      }

      const messageHandler = async (message: Message) => {
        if (!contract || !contract.symmetricKey) return
        if (!message.message || message.roomId !== `contract-${contract.id}`) return

        const decryptedMessage = {
          ...message,
          date: new Date(message.date),
          message: await decryptSymmetric(message.message, contract.symmetricKey),
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
    }, [contract, ws.connected]),
  )

  useFocusEffect(
    useCallback(
      getContractEffect({
        contractId,
        onSuccess: async result => {
          info('Got contract', result.id)
          let c = getContract(result.id)
          const view = account.publicKey === result.seller.id ? 'seller' : 'buyer'
          setTradingPartner(() => (account.publicKey === result.seller.id ? result.buyer : result.seller))

          const { symmetricKey, paymentData } = await parseContract({
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

          handleOverlays({ contract: c, navigation, updateOverlay, view })
        },
        onError: err =>
          updateMessage({
            msgKey: err.error || 'error.general',
            level: 'ERROR',
          }),
      }),
      [contractId],
    ),
  )

  // Show dispute disclaimer
  useEffect(() => {
    if (contract && !contract.disputeActive && account.settings.showDisputeDisclaimer) {
      showDisclaimer()
    }
  }, [])

  useEffect(() => {
    if (!contract) return
    getMessagesEffect({
      contractId: contract.id,
      page,
      onSuccess: async result => {
        if (!contract || !contract.symmetricKey) return
        let decryptedMessages = await Promise.all(result.map(decryptMessage(chat, contract.symmetricKey)))

        if (decryptedMessages.some(m => m.message === null)) {
          // delete symmetric key to let app decrypt actual one
          const { symmetricKey } = await parseContract({
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

        if (decryptedMessages.some(m => m.message === null)) {
          error('Could not decrypt all messages', contract.id)
        }

        decryptedMessages = decryptedMessages.concat(createDisputeSystemMessages(chat.id, contract))

        setAndSaveChat(contractId, {
          messages: decryptedMessages,
        })
        setLoadingMessages(false)
        setUpdatePending(false)
      },
      onError: err => {
        setUpdatePending(false)
        setLoadingMessages(false)
        updateMessage({
          msgKey: err.error || 'error.general',
          level: 'ERROR',
        })
      },
    })()
  }, [contract, page])

  return !contract || updatePending ? (
    <Loading />
  ) : (
    <View style={[tw`h-full flex-col`]}>
      <ChatHeader contract={contract} navigation={navigation} />
      <View style={[tw`w-full h-full flex-shrink`, !contract.symmetricKey ? tw`opacity-50` : {}]}>
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
      <View style={tw`w-full bg-white-1`}>
        <MessageInput
          onChange={setNewMessage}
          onSubmit={submit}
          disableSubmit={disableSend}
          value={newMessage}
          placeholder={i18n('chat.yourMessage')}
        />
      </View>
    </View>
  )
}
