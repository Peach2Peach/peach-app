import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import { Button, Fade, Input, Loading, SatsFormat, Text, Title } from '../../components'
import { RouteProp, useFocusEffect } from '@react-navigation/native'
import getContractEffect from '../../effects/getContractEffect'
import { error } from '../../utils/log'
import { MessageContext } from '../../contexts/message'
import i18n from '../../utils/i18n'
import { contractIdToHex, getContract, saveContract } from '../../utils/contract'
import { account } from '../../utils/account'
import getMessagesEffect from './effects/getMessagesEffect'
import { signAndEncryptSymmetric, decryptSymmetric } from '../../utils/pgp'
import ChatBox from './components/ChatBox'
import { decryptSymmetricKey, getPaymentData } from '../contract/helpers/parseContract'
import { PeachWSContext } from '../../utils/peachAPI/websocket'
import { getChat, saveChat } from '../../utils/chat'
import { unique } from '../../utils/array'
import ContractActions from './components/ContractActions'
import { DisputeDisclaimer } from './components/DisputeDisclaimer'
import keyboard from '../../effects/keyboard'
import YouGotADispute from '../../overlays/YouGotADispute'
import { OverlayContext } from '../../contexts/overlay'

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
  const contractId = route.params.contractId
  const [contract, setContract] = useState<Contract|null>(() => getContract(contractId))
  const [tradingPartner, setTradingPartner] = useState<User|null>()
  const [chat, setChat] = useState<Chat>(getChat(contractId))
  const [newMessage, setNewMessage] = useState('')
  const [view, setView] = useState<'seller'|'buyer'|''>('')
  const [page, setPage] = useState(0)

  const saveAndUpdate = (contractData: Contract) => {
    if (typeof contractData.creationDate === 'string') contractData.creationDate = new Date(contractData.creationDate)

    setContract(() => contractData)
    saveContract(contractData)
  }

  useFocusEffect(useCallback(() => {
    const messageHandler = async (message: Message) => {
      if (!contract || !contract.symmetricKey) return
      if (!message.message || message.roomId !== `contract-${contract.id}`) return

      const decryptedMessage = {
        ...message,
        date: new Date(message.date),
        message: await decryptSymmetric(message.message, contract.symmetricKey)
      }
      setChat(() => saveChat(contractId, {
        messages: [decryptedMessage]
      }))
    }
    const unsubscribe = () => {
      ws.off('message', messageHandler)
    }

    if (!ws.connected) return unsubscribe

    ws.on('message', messageHandler)

    return unsubscribe
  }, [ws.connected]))

  useFocusEffect(useCallback(() => {
    setUpdatePending(true)
    setPage(0)
    setChat(getChat(contractId) || {})
  }, []))

  useFocusEffect(useCallback(getContractEffect({
    contractId,
    onSuccess: async (result) => {
      // info('Got contract', result)

      setView(() => account.publicKey === result.seller.id ? 'seller' : 'buyer')
      setTradingPartner(() => account.publicKey === result.seller.id ? result.buyer : result.seller)

      const [symmetricKey, err] = !contract?.symmetricKey ? await decryptSymmetricKey(
        result.symmetricKeyEncrypted,
        result.symmetricKeySignature,
        result.buyer.pgpPublicKey,
      ) : [contract?.symmetricKey, null]

      if (err) error(err)

      saveAndUpdate(contract
        ? {
          ...contract,
          ...result,
          symmetricKey,
          // canceled: contract.canceled
        }
        : {
          ...result,
          symmetricKey,
        }
      )

      if (result.disputeActive
        && result.disputeInitiator !== account.publicKey
        && !result.disputeAcknowledgedByCounterParty) {
        updateOverlay({
          content: <YouGotADispute
            contractId={result.id}
            message={result.disputeClaim as string}
            navigation={navigation} />,
          showCloseButton: false
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
        const decryptedMessages = await Promise.all(result.map(async (message) => {
          const existingMessage = chat.messages.find(m =>
            m.date.getTime() === message.date.getTime() && m.from === message.from
          )
          let decryptedMessage = existingMessage?.message
          try {
            if (message.message && contract.symmetricKey) {
              decryptedMessage = decryptedMessage
                || await decryptSymmetric(message.message || '', contract.symmetricKey)
            }
          } catch (e) {
            error('Could not decrypt message', e)
          }
          return {
            ...message,
            message: decryptedMessage,
          }
        }))

        setChat(() => saveChat(contractId, {
          messages: decryptedMessages.filter(unique('date'))
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

  useEffect(() => {
    (async () => {
      if (!contract || !view || contract.canceled) return

      if (contract.paymentData && contract.symmetricKey) return

      const [paymentData, err] = await getPaymentData(contract)

      if (err) error(err)
      if (paymentData) {
        // TODO if err is yielded consider open a dispute directly
        const contractErrors = contract.contractErrors || []
        if (err) contractErrors.push(err.message)
        saveAndUpdate({
          ...contract,
          paymentData,
          contractErrors,
        })
      }
    })()

  }, [contract])

  useEffect(keyboard(setKeyboardOpen), [])

  const sendMessage = async () => {
    if (!contract || !tradingPartner || !contract.symmetricKey || !ws || !newMessage) return

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
    setNewMessage(() => '')
  }

  const loadMore = () => {
    setLoadingMessages(true)
    setPage(p => p + 1)
  }

  const returnTrue = () => true

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
        <Text style={tw`text-center text-grey-2 mt-2`}>{i18n('contact.trade', contractIdToHex(contract.id))}</Text>
      </Fade>
      <View style={tw`h-full flex-col flex-shrink`}>
        <View style={[
          tw`w-full h-full flex-col flex-shrink`,
          !ws.connected || !contract.symmetricKey ? tw`opacity-50 pointer-events-none` : {}
        ]}>
          <View style={tw`h-full flex-shrink`}>
            <ChatBox chat={chat} page={page} loadMore={loadMore} loading={loadingMessages}
              disclaimer={<DisputeDisclaimer navigation={navigation} contract={contract}/>} />
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
          onPress={() => navigation.goBack()}
          style={tw`mt-2`}
          title={i18n('back')}
        />
      </Fade>
    </View>
}