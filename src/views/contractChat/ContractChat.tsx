import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import {
  Keyboard,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../contexts/language'
import { Button, Fade, Input, Loading, Timer, Title } from '../../components'
import { RouteProp, useFocusEffect } from '@react-navigation/native'
import getContractEffect from '../../effects/getContractEffect'
import { error } from '../../utils/log'
import { MessageContext } from '../../contexts/message'
import i18n from '../../utils/i18n'
import { getContract, saveContract } from '../../utils/contract'
import { account } from '../../utils/account'
import { thousands } from '../../utils/string'
import { TIMERS } from '../../constants'
import getMessagesEffect from './effects/getMessagesEffect'
import { signAndEncryptSymmetric, decryptSymmetric } from '../../utils/pgp'
import ChatBox from './components/ChatBox'
import { getTimerStart } from '../contract/helpers/getTimerStart'
import { decryptSymmetricKey, getPaymentData } from '../contract/helpers/parseContract'
import { getRequiredAction } from '../contract/helpers/getRequiredAction'
import { PeachWSContext } from '../../utils/peachAPI/websocket'
import { getChat, saveChat } from '../../utils/chat'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'chat'>

type Props = {
  route: RouteProp<{ params: {
    contractId: string,
  } }>,
  navigation: ProfileScreenNavigationProp,
}

// eslint-disable-next-line max-lines-per-function, max-statements
export default ({ route, navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const ws = useContext(PeachWSContext)
  const [, updateMessage] = useContext(MessageContext)

  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [updatePending, setUpdatePending] = useState(true)
  const [contractId, setContractId] = useState(route.params.contractId)
  const [contract, setContract] = useState<Contract|null>(getContract(contractId))
  const [tradingPartner, setTradingPartner] = useState<User|null>()
  const [chat, setChat] = useState<Chat>(getChat(contractId))
  const [newMessage, setNewMessage] = useState('')
  const [view, setView] = useState<'seller'|'buyer'|''>('')
  const [requiredAction, setRequiredAction] = useState<ContractAction>('none')

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
      setChat(prevChat => {
        const c = {
          ...prevChat,
          messages: [...prevChat.messages, decryptedMessage]
        }
        saveChat(contract.id, c)
        return c
      })
    }
    const unsubscribe = () => {
      ws.off('message', messageHandler)
    }

    if (!ws.connected) return unsubscribe

    ws.on('message', messageHandler)

    return unsubscribe
  }, [ws.connected]))

  useEffect(() => {
    setUpdatePending(true)
    setContractId(() => route.params.contractId)
  }, [route])

  useEffect(() => {
    setChat(getChat(contractId) || {})
  }, [contractId])

  useFocusEffect(useCallback(getContractEffect({
    contractId,
    onSuccess: async (result) => {
      // info('Got contract', result)

      setView(() => account.publicKey === result.seller.id ? 'seller' : 'buyer')
      setTradingPartner(() => account.publicKey === result.seller.id ? result.buyer : result.seller)

      const [symmetricKey, err] = await decryptSymmetricKey(
        result.symmetricKeyEncrypted,
        result.symmetricKeySignature,
        result.buyer.pgpPublicKey,
      )

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
    },
    onError: err => updateMessage({
      msg: i18n(err.error || 'error.general'),
      level: 'ERROR',
    })
  }), [contractId]))

  useEffect(ws.connected && contract ? getMessagesEffect({
    contractId: contract.id,
    onSuccess: async (result) => {
      if (!contract || !contract.symmetricKey) return

      const decryptedMessages = await Promise.all(result.map(async (message) => {
        const existingMessage = chat.messages.find(m => m.date === message.date && m.from === message.from)
        let decryptedMessage = existingMessage?.message
        try {
          if (message.message && contract.symmetricKey) {
            decryptedMessage = decryptedMessage || await decryptSymmetric(message.message || '', contract.symmetricKey)
          }
        } catch (e) {
          error('Could not decrypt message', e)
        }
        return {
          ...message,
          message: decryptedMessage,
        }
      }))

      saveChat(contractId, { messages: decryptedMessages })
      setChat(c => ({
        ...c,
        messages: decryptedMessages
      }))
      setUpdatePending(false)

    },
    onError: err => {
      setUpdatePending(false)
      updateMessage({
        msg: i18n(err.error || 'error.general'),
        level: 'ERROR',
      })
    }
  }) : () => {}, [ws.connected, contract])

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

    setRequiredAction(getRequiredAction(contract))
  }, [contract])

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', () => setKeyboardOpen(true))
    Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true))
    Keyboard.addListener('keyboardWillHide', () => setKeyboardOpen(false))
    Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false))
  }, [])

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

  const returnTrue = () => true

  return updatePending
    ? <Loading />
    : <View style={[tw`h-full pt-6 px-6 flex-col content-between items-center`, !keyboardOpen ? tw`pb-10` : tw`pb-4`]}>
      <Fade show={!keyboardOpen} style={tw`mb-16`}>
        <Title
          title={i18n(view === 'buyer' ? 'buy.title' : 'sell.title')}
          subtitle={contract?.amount ? i18n('contract.subtitle', thousands(contract.amount)) : ''}
        />
      </Fade>
      {contract
        ? <View style={tw`h-full flex-col flex-shrink`}>
          {requiredAction !== 'none'
            ? <Timer
              text={i18n(`contract.timer.${requiredAction}`)}
              start={getTimerStart(contract, requiredAction)}
              duration={TIMERS[requiredAction]}
            />
            : null
          }
          <View style={[
            tw`w-full h-full flex-col flex-shrink`,
            !ws.connected || !contract.symmetricKey ? tw`opacity-50 pointer-events-none` : {}
          ]}>
            <View style={tw`h-full flex-shrink`}>
              <ChatBox chat={chat} />
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
        : null
      }
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