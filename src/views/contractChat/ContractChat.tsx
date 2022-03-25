import React, { ReactElement, useContext, useEffect, useState } from 'react'
import {
  Pressable,
  ScrollView,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Button, Input, Loading, Text, Timer, Title } from '../../components'
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
import Icon from '../../components/Icon'
import { signAndEncryptSymmetric, decryptSymmetric } from '../../utils/pgp'
import { postChat } from '../../utils/peachAPI'
import ChatBox from './components/ChatBox'
import { getTimerStart } from '../contract/helpers/getTimerStart'
import { getPaymentDataBuyer, getPaymentDataSeller } from '../contract/helpers/parseContract'
import { getRequiredAction } from '../contract/helpers/getRequiredAction'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'chat'>

type Props = {
  route: RouteProp<{ params: {
    contractId: string,
  } }>,
  navigation: ProfileScreenNavigationProp,
}

// eslint-disable-next-line max-lines-per-function
export default ({ route, navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)

  const [updatePending, setUpdatePending] = useState(true)
  const [contractId, setContractId] = useState(route.params.contractId)
  const [contract, setContract] = useState<Contract|null>(getContract(contractId))
  const [tradingPartner, setTradingPartner] = useState<User|null>()
  const [messages, setMessages] = useState<Message[]>(account.chats[contractId] || [])
  const [newMessage, setNewMessage] = useState('')
  const [view, setView] = useState<'seller'|'buyer'|''>('')
  const [requiredAction, setRequiredAction] = useState<ContractAction>('none')

  const saveAndUpdateContract = (contractData: Contract) => {
    if (typeof contractData.creationDate === 'string') contractData.creationDate = new Date(contractData.creationDate)

    setContract(() => contractData)
    saveContract(contractData)
  }

  useEffect(() => {
    setContractId(() => route.params.contractId)
  }, [route])

  useEffect(getContractEffect({
    contractId,
    onSuccess: async (result) => {
      // info('Got contract', result)

      setView(() => account.publicKey === result.seller.id ? 'seller' : 'buyer')
      setMessages(account.chats[contractId] || [])

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

  useEffect(getMessagesEffect({
    contractId,
    onSuccess: async (result) => {
      if (!contract || !contract.symmetricKey) return

      const decryptedMessages = await Promise.all(result.map(async (message) => {
        const existingMessage = messages.find(m => m.date === message.date && m.from === message.from)
        const decryptedMessage = existingMessage?.message
          || await decryptSymmetric(message.message, contract.symmetricKey)
        return {
          ...message,
          message: decryptedMessage
        }
      }))
      setMessages(decryptedMessages)
    },
    onError: err => updateMessage({
      msg: i18n(err.error || 'error.general'),
      level: 'ERROR',
    })
  }), [contractId])

  useEffect(() => {
    (async () => {
      if (!contract || !view || contract.canceled) return

      if ((view === 'seller' && contract?.ratingBuyer)
        || (view === 'buyer' && contract?.ratingSeller)) {
        setContractId('')
        navigation.navigate('tradeComplete', { contract, view })
        return
      }

      if (contract.paymentData) return

      const [paymentData, err] = view === 'buyer'
        ? await getPaymentDataBuyer(contract)
        : await getPaymentDataSeller(contract)

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
    if (!contract || !tradingPartner || !contract.symmetricKey) return

    const encryptedResult = await signAndEncryptSymmetric(
      newMessage,
      contract.symmetricKey
    )

    const [result, err] = await postChat({
      contractId: contract.id,
      message: encryptedResult.encrypted,
      signature: encryptedResult.signature,
    })

    if (err) {
      updateMessage({
        msg: i18n(err.error || 'error.general'),
        level: 'ERROR',
      })
    } else {
      setMessages(() => messages.concat({
        from: account.publicKey,
        date: new Date(),
        message: newMessage,
        signature: encryptedResult.signature,
      }))
      setNewMessage('')
    }
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
          <View style={tw`w-full h-full flex-col flex-shrink`}>
            <View style={tw`h-full flex-shrink`}>
              <ChatBox messages={messages} />
            </View>
            <View style={tw`mt-4 flex-shrink-0`}>
              <Input
                onChange={setNewMessage}
                value={newMessage}
                label={i18n('chat.yourMessage')}
                isValid={true}
                autoCorrect={true}
              />
              <Pressable onPress={sendMessage} style={tw`h-full absolute right-3 flex justify-center`}>
                <Icon id="send" style={tw`w-5 h-5`} />
              </Pressable>
            </View>
          </View>
        </View>
        : null
      }
      <Button
        secondary={true}
        wide={false}
        onPress={() => navigation.back()}
        style={tw`mt-2`}
        title={i18n('back')}
      />
    </View>
}