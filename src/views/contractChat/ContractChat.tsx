import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { Button, Fade, Input, Loading, SatsFormat, Text, Title } from '../../components'
import { MessageContext } from '../../contexts/message'
import { OverlayContext } from '../../contexts/overlay'
import getContractEffect from '../../effects/getContractEffect'
import keyboard from '../../effects/keyboard'
import YouGotADispute from '../../overlays/YouGotADispute'
import { account } from '../../utils/account'
import { decryptMessage, getChat, saveChat } from '../../utils/chat'
import { contractIdToHex, getContract, saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { error, info } from '../../utils/log'
import { PeachWSContext } from '../../utils/peachAPI/websocket'
import { decryptSymmetric, signAndEncryptSymmetric } from '../../utils/pgp'
import { parseContract } from '../contract/helpers/parseContract'
import ChatBox from './components/ChatBox'
import ContractActions from './components/ContractActions'
import { DisputeDisclaimer } from './components/DisputeDisclaimer'
import getMessagesEffect from './effects/getMessagesEffect'
import { DisputeResult } from '../../overlays/DisputeResult'

const returnTrue = () => true

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'contractChat'>

type Props = {
  route: RouteProp<{ params: {
    contractId: string,
  } }>,
  navigation: ProfileScreenNavigationProp,
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
  const [random, setRandom] = useState(0)

  const saveAndUpdate = (contractData: Contract) => {
    if (typeof contractData.creationDate === 'string') contractData.creationDate = new Date(contractData.creationDate)

    setContract(() => contractData)
    saveContract(contractData)
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
    setRandom(Math.random())

    const messageHandler = async (message: Message) => {
      if (!contract || !contract.symmetricKey) return
      if (!message.message || message.roomId !== `contract-${contract.id}`) return

      const decryptedMessage = {
        ...message,
        date: new Date(message.date),
        message: await decryptSymmetric(message.message, contract.symmetricKey)
      }
      setChat(saveChat(contractId, {
        messages: [decryptedMessage]
      }))
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

      setView(() => account.publicKey === result.seller.id ? 'seller' : 'buyer')
      setTradingPartner(() => account.publicKey === result.seller.id ? result.buyer : result.seller)

      const { symmetricKey, paymentData } = await parseContract({
        ...result,
        symmetricKey: contract?.symmetricKey,
        paymentData: contract?.paymentData,
      })

      saveAndUpdate(contract
        ? {
          ...contract,
          ...result,
          symmetricKey,
          paymentData,
          // canceled: contract.canceled,
        }
        : {
          ...result,
          symmetricKey,
          paymentData,
        }
      )

      if (result.disputeActive
        && result.disputeInitiator !== account.publicKey
        && !result.disputeAcknowledgedByCounterParty) {
        updateOverlay({
          content: <YouGotADispute
            contractId={result.id}
            message={result.disputeClaim!}
            reason={result.disputeReason!}
            navigation={navigation} />,
          showCloseButton: false
        })
      }
      if (result.disputeWinner && !contract?.disputeResultAcknowledged) {
        updateOverlay({
          content: <DisputeResult
            contractId={result.id}
            navigation={navigation} />,
        })
      }
    },
    onError: err => updateMessage({
      msg: i18n(err.error || 'error.general'),
      level: 'ERROR',
    })
  }), [contractId]))

  useEffect(() => {
    if (!contract) return

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

        setChat(saveChat(contractId, {
          messages: decryptedMessages
        }))
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
    saveChat(chat.id, { lastSeen: new Date() })
    setNewMessage('')
    setRandom(Math.random())
  }

  const loadMore = () => {
    setLoadingMessages(true)
    setPage(p => p + 1)
  }

  const goBack = () => navigation.replace('contract', { contractId })

  return !contract || updatePending
    ? <Loading />
    : <View style={[tw`h-full pt-6 px-6 flex-col content-between items-center`, !keyboardOpen ? tw`pb-10` : tw`pb-4`]}>
      <Fade show={!keyboardOpen} style={tw`mb-16`}>
        <Title
          title={i18n(view === 'buyer' ? 'buy.title' : 'sell.title')}
        />
        <Text style={tw`text-grey-2 text-center -mt-1`}>
          {i18n('contract.subtitle')} <SatsFormat sats={contract?.amount || 0}
            color={tw`text-grey-2`}
          />
        </Text>
        <Text style={tw`text-center text-grey-2 mt-2`}>{i18n('contract.trade', contractIdToHex(contract.id))}</Text>
      </Fade>
      <View style={tw`h-full flex-col flex-shrink`}>
        <View style={[
          tw`w-full h-full flex-col flex-shrink`,
          !ws.connected || !contract.symmetricKey ? tw`opacity-50` : {}
        ]}>
          <View style={tw`h-full flex-shrink`}>
            <ChatBox chat={chat}
              tradingPartner={tradingPartner?.id || ''}
              page={page} loadMore={loadMore} loading={loadingMessages}
              disclaimer={!contract.disputeActive
                ? <DisputeDisclaimer navigation={navigation} contract={contract}/>
                : undefined
              } />
            <ContractActions style={tw`absolute right-0 top-4 -mr-3`}
              contract={contract}
              view={view}
              navigation={navigation}
            />
          </View>
          <View style={tw`mt-4 flex-shrink-0`} onStartShouldSetResponder={returnTrue}>
            <Input
              onChange={setNewMessage}
              onSubmit={sendMessage}
              icon="send"
              returnKeyType="send"
              value={newMessage}
              label={i18n('chat.yourMessage')}
              isValid={true}
              autoCorrect={true}
            />
          </View>
        </View>
      </View>
      <Fade show={!keyboardOpen}>
        <Button
          secondary={true}
          wide={false}
          onPress={goBack}
          style={tw`mt-2`}
          title={i18n('back')}
        />
      </Fade>
    </View>
}