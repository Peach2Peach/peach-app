import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'

import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { Icon, Loading, Text } from '../../components'
import { MessageContext } from '../../contexts/message'
import { OverlayContext } from '../../contexts/overlay'
import getContractEffect from '../../effects/getContractEffect'
import keyboard from '../../effects/keyboard'
import { account } from '../../utils/account'
import { decryptMessage, getChat, saveChat } from '../../utils/chat'
import { createDisputeSystemMessages } from '../../utils/chat/createSystemMessage'
import { getContract, saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { error, info } from '../../utils/log'
import { StackNavigation } from '../../utils/navigation'
import { PeachWSContext } from '../../utils/peachAPI/websocket'
import { decryptSymmetric, signAndEncryptSymmetric } from '../../utils/pgp'
import { handleOverlays } from '../contract/helpers/handleOverlays'
import { parseContract } from '../contract/helpers/parseContract'
import ChatBox from './components/ChatBox'
import ContractActions from './components/ContractActions'
import { DisputeDisclaimer } from './components/DisputeDisclaimer'
import getMessagesEffect from './effects/getMessagesEffect'
import MessageInput from '../../components/inputs/MessageInput'

type Props = {
  route: RouteProp<{ params: RootStackParamList['contractChat'] }>,
  navigation: StackNavigation,
}

// eslint-disable-next-line max-lines-per-function, max-statements
export default ({ route, navigation }: Props): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)
  const ws = useContext(PeachWSContext)

  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [updatePending, setUpdatePending] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(true)
  const [contractId, setContractId] = useState(route.params.contractId)
  const [contract, setContract] = useState<Contract|null>(() => getContract(contractId))
  const [tradingPartner, setTradingPartner] = useState<User|null>()
  const [chat, setChat] = useState<Chat>(getChat(contractId))
  const [newMessage, setNewMessage] = useState('')
  const [view, setView] = useState<'seller'|'buyer'|''>('')
  const [page, setPage] = useState(0)
  const [disableSend, setDisableSend] = useState(false)

  const setAndSaveChat = (id: string, c: Partial<Chat>, save = true) => setChat(saveChat(id, c, save))

  const saveAndUpdate = (contractData: Contract): Contract => {
    if (typeof contractData.creationDate === 'string') contractData.creationDate = new Date(contractData.creationDate)

    setContract(() => contractData)
    saveContract(contractData)
    return contractData
  }

  const initChat = () => {
    if (contract?.id !== route.params.contractId) {
      setContractId(route.params.contractId)
      setUpdatePending(true)
      setLoadingMessages(true)
      setPage(0)
      setNewMessage('')
      setView('')
      setTradingPartner(null)
      setChat(getChat(route.params.contractId) || {})
      setContract(getContract(route.params.contractId))
    }
  }

  useFocusEffect(useCallback(initChat, [route]))

  useFocusEffect(useCallback(() => {

    const messageHandler = async (message: Message) => {
      if (!contract || !contract.symmetricKey) return
      if (!message.message || message.roomId !== `contract-${contract.id}`) return

      const decryptedMessage = {
        ...message,
        date: new Date(message.date),
        message: await decryptSymmetric(message.message, contract.symmetricKey)
      }
      setAndSaveChat(contractId, {
        messages: [decryptedMessage]
      })
    }
    const unsubscribe = () => {
      ws.off('message', messageHandler)
    }

    if (!ws.connected) return unsubscribe

    ws.on('message', messageHandler)

    return unsubscribe
  }, [contract, ws.connected]))

  useFocusEffect(useCallback(getContractEffect({
    contractId,
    onSuccess: async (result) => {
      info('Got contract', result.id)
      let c = getContract(result.id)
      const v = account.publicKey === result.seller.id ? 'seller' : 'buyer'
      setView(v)
      setTradingPartner(() => account.publicKey === result.seller.id ? result.buyer : result.seller)

      const { symmetricKey, paymentData } = await parseContract({
        ...result,
        symmetricKey: c?.symmetricKey,
        paymentData: c?.paymentData,
      })

      c = saveAndUpdate(c
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
        }
      )

      handleOverlays({ contract: c, navigation, updateOverlay, view: v })
    },
    onError: err => updateMessage({
      msg: i18n(err.error || 'error.general'),
      level: 'ERROR',
    })
  }), [contractId]))

  useEffect(() => {
    if (!contract) return

    // Show dispute disclaimer
    updateMessage({
      template: <DisputeDisclaimer navigation={navigation} contract={contract!}/>,
      level: 'INFO',
    })

    getMessagesEffect({
      contractId: contract.id,
      page,
      onSuccess: async (result) => {
        if (!contract || !contract.symmetricKey) return
        let decryptedMessages = await Promise.all(result.map(decryptMessage(chat, contract.symmetricKey)))

        if (decryptedMessages.some(m => m.message === null)) {
          // delete symmetric key to let app decrypt actual one
          const { symmetricKey } = await parseContract({
            ...contract,
            symmetricKey: undefined
          })
          saveAndUpdate({
            ...contract,
            symmetricKey,
          })
          decryptedMessages = await Promise.all(decryptedMessages.map(decryptMessage(chat, symmetricKey)))
        }

        if (decryptedMessages.some(m => m.message === null)) {
          error('Could not decrypt all messages', contract.id)
        }

        decryptedMessages = decryptedMessages.concat(createDisputeSystemMessages(chat.id, contract))

        setAndSaveChat(contractId, {
          messages: decryptedMessages
        })
        setLoadingMessages(false)
        setUpdatePending(false)
      },
      onError: err => {
        setUpdatePending(false)
        setLoadingMessages(false)
        updateMessage({
          msg: i18n(err.error || 'error.general'),
          level: 'ERROR',
        })
      }
    })()
  }, [contract, page])

  useEffect(keyboard(setKeyboardOpen), [])

  const sendMessage = async () => {
    if (!contract || !tradingPartner || !contract.symmetricKey || !ws || !newMessage) return
    setDisableSend(true)
    setTimeout(() => setDisableSend(false), 300)

    setNewMessage('')

    const encryptedResult = await signAndEncryptSymmetric(
      newMessage,
      contract.symmetricKey
    )
    ws.send(JSON.stringify({
      path: '/v1/contract/chat',
      contractId: contract.id,
      from: account.publicKey,
      message: encryptedResult.encrypted,
      signature: encryptedResult.signature,
    }))
    setAndSaveChat(chat.id, { lastSeen: new Date() }, false)
  }

  const loadMore = () => {
    setLoadingMessages(true)
    setPage(p => p + 1)
  }

  const goBack = () => navigation.replace('contract', { contractId })
  // contract.disputeActive

  return !contract || updatePending
    ? <Loading />
    : <View style={[tw`h-full flex-col`]}>
      <View style={tw`w-full flex-row items-center p-1`}>
        <Pressable onPress={goBack}>
          <Icon id={'arrowLeft'} style={tw`w-10 h-10 flex-shrink-0`} color={tw`text-peach-1`.color as string}/>
        </Pressable>
        <Text
          style={tw`items-center text-peach-1 text-xl font-bold`}>
          {i18n(contract.disputeActive
            ? 'dispute.chat'
            : 'trade.chat')}
        </Text>
        <ContractActions style={tw`flex-row-reverse content-end flex-grow ml-2`}
          contract={contract}
          view={view}
          navigation={navigation}
        />
      </View>
      <View style={[
        tw`w-full flex-shrink`,
        !ws.connected || !contract.symmetricKey ? tw`opacity-50` : {}
      ]}>
        <ChatBox chat={chat} setAndSaveChat={setAndSaveChat}
          tradingPartner={tradingPartner?.id || ''}
          page={page} loadMore={loadMore} loading={loadingMessages}
        />
      </View>
      <View style={tw`absolute bottom-0 w-full bg-white-1 shadow-lg`}>
        <MessageInput
          onChange={setNewMessage}
          onSubmit={sendMessage} disableSubmit={disableSend}
          value={newMessage}
          placeholder={i18n('chat.yourMessage')}
        />

      </View>
    </View>
}