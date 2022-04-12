import React, { ReactElement, useContext, useEffect, useState } from 'react'
import {
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Button, Input, Loading, Timer, Title } from '../../components'
import { RouteProp } from '@react-navigation/native'
import getContractEffect from '../../effects/getContractEffect'
import { error } from '../../utils/log'
import { MessageContext } from '../../utils/message'
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

  const [updatePending, setUpdatePending] = useState(true)
  const [contractId, setContractId] = useState(route.params.contractId)
  const [contract, setContract] = useState<Contract|null>(getContract(contractId))
  const [tradingPartner, setTradingPartner] = useState<User|null>()
  const [chat, setChat] = useState<Message[]>(account.chats[contractId] || [])
  const [newMessage, setNewMessage] = useState('')
  const [view, setView] = useState<'seller'|'buyer'|''>('')
  const [requiredAction, setRequiredAction] = useState<ContractAction>('none')

  const saveAndUpdate = (contractData: Contract) => {
    if (typeof contractData.creationDate === 'string') contractData.creationDate = new Date(contractData.creationDate)

    setContract(() => contractData)
    saveContract(contractData)
  }

  useEffect(() => {
    const messageHandler = async (message: Message) => {
      if (!contract || !contract.symmetricKey) return
      if (!message.message || message.roomId !== `contract-${contract.id}`) return

      const decryptedMessage = {
        ...message,
        date: new Date(message.date),
        message: await decryptSymmetric(message.message, contract.symmetricKey)
      }
      setChat(prevChat => [...prevChat, decryptedMessage])
    }

    if (!ws.connected) return () => {
      ws.off('message', messageHandler)
    }

    ws.on('message', messageHandler)

    return () => {
      ws.off('message', messageHandler)
    }
  }, [ws.connected])

  const saveAndUpdateContract = (contractData: Contract) => {
    if (typeof contractData.creationDate === 'string') contractData.creationDate = new Date(contractData.creationDate)

    setContract(() => contractData)
    saveContract(contractData)
  }

  useEffect(() => {
    setContractId(() => route.params.contractId)
  }, [route])

  useEffect(() => {
    setChat(account.chats[contractId] || [])
  }, [contractId])

  useEffect(getContractEffect({
    contractId,
    onSuccess: async (result) => {
      // info('Got contract', result)

      setView(() => account.publicKey === result.seller.id ? 'seller' : 'buyer')

      const [symmetricKey, err] = contract?.symmetricKey
        ? [contract.symmetricKey, null]
        : await decryptSymmetricKey(result)

      if (err) error(err)

      saveAndUpdate(contract
        ? {
          ...contract,
          ...result,
          symmetricKey,
          // canceled: contract.canceled
        }
        : result
      )

      setTradingPartner(() => account.publicKey === result.seller.id ? result.buyer : result.seller)
      saveAndUpdateContract(contract
        ? {
          ...contract,
          ...result,
          // canceled: contract.canceled
        }
        : result
      )
    },
    onError: err => updateMessage({
      msg: i18n(err.error || 'error.general'),
      level: 'ERROR',
    })
  }), [contractId])

  useEffect(ws.connected && contractId ? getMessagesEffect({
    contractId,
    onSuccess: async (result) => {
      if (!contract || !contract.symmetricKey) return

      const decryptedMessages = await Promise.all(result.map(async (message) => {
        const existingMessage = chat.find(m => m.date === message.date && m.from === message.from)
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
      setChat(decryptedMessages)
    },
    onError: err => updateMessage({
      msg: i18n(err.error || 'error.general'),
      level: 'ERROR',
    })
  }) : () => {}, [ws.connected, contractId])

  useEffect(() => {
    (async () => {
      if (!contract || !view || contract.canceled) return

      if ((view === 'seller' && contract?.ratingBuyer)
        || (view === 'buyer' && contract?.ratingSeller)) {
        setContractId('')
        navigation.navigate('tradeComplete', { contract, view })
        return
      }

      if (contract.paymentData && contract.symmetricKey) return

      const [paymentData, err] = await getPaymentData(contract)

      if (err) error(err)
      if (paymentData) {
        // TODO if err is yielded consider open a dispute directly
        const contractErrors = contract.contractErrors || []
        if (err) contractErrors.push(err.message)
        saveAndUpdateContract({
          ...contract,
          paymentData,
          contractErrors,
        })
      }
    })()

    setRequiredAction(getRequiredAction(contract))

    setUpdatePending(false)
  }, [contract])

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
    setNewMessage(() => '')
  }

  return updatePending
    ? <Loading />
    : <View style={tw`h-full pt-6 pb-24 flex-col content-between items-center`}>
      <Title
        title={i18n(view === 'buyer' ? 'buy.title' : 'sell.title')}
        subtitle={contract?.amount ? i18n('contract.subtitle', thousands(contract.amount)) : ''}
      />
      {contract && !contract.paymentConfirmed
        ? <View style={tw`h-full flex-col flex-shrink mt-16`}>
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
              <ChatBox messages={chat} />
            </View>
            <View style={tw`mt-4 flex-shrink-0`}>
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
      <Button
        secondary={true}
        wide={false}
        onPress={() => navigation.goBack()}
        style={tw`mt-2`}
        title={i18n('back')}
      />
    </View>
}