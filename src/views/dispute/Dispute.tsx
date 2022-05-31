import React, { ReactElement, useContext, useEffect, useRef, useState } from 'react'
import {
  Keyboard,
  TextInput,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import { Button, Fade, Input, SatsFormat, Text, Title } from '../../components'
import { RouteProp } from '@react-navigation/native'
import i18n from '../../utils/i18n'
import { getContract } from '../../utils/contract'
import { account } from '../../utils/account'
import { OverlayContext } from '../../contexts/overlay'
import WhatIsADispute from '../../overlays/WhatIsADispute'

import { getMessages, rules } from '../../utils/validation'
import { MessageContext } from '../../contexts/message'
import RaiseDisputeSuccess from '../../overlays/RaiseDisputeSuccess'
import { raiseDispute } from '../../utils/peachAPI'
import { error } from '../../utils/log'
const { useValidation } = require('react-native-form-validator')

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'dispute'>

type Props = {
  route: RouteProp<{ params: {
    contractId: string,
  } }>,
  navigation: ProfileScreenNavigationProp,
}

const disputeTopicsSeller: DisputeTopic[] = [
  'payment',
  'behaviourBuyer',
  'other'
]
const disputeTopicsBuyer: DisputeTopic[] = [
  'payment',
  'behaviourSeller',
  'other'
]

// eslint-disable-next-line max-lines-per-function
export default ({ route, navigation }: Props): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)

  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [contractId, setContractId] = useState(route.params.contractId)
  const [contract, setContract] = useState<Contract|null>(() => getContract(contractId))
  const [start, setStart] = useState(false)
  const [topic, setTopic] = useState<DisputeTopic>()
  const [email, setEmail] = useState()
  const [message, setMessage] = useState()
  let $message = useRef<TextInput>(null).current

  const view = contract ? account.publicKey === contract.seller.id ? 'seller' : 'buyer' : ''
  const availableTopics = view === 'seller' ? disputeTopicsSeller : disputeTopicsBuyer

  const { validate, isFieldInError, getErrorsInField, isFormValid } = useValidation({
    deviceLocale: 'default',
    state: { email, message },
    rules,
    messages: getMessages()
  })

  useEffect(() => {
    setContractId(route.params.contractId)
    setContract(getContract(route.params.contractId))
  }, [route])

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', () => setKeyboardOpen(true))
    Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true))
    Keyboard.addListener('keyboardWillHide', () => setKeyboardOpen(false))
    Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false))
  }, [])

  const startDispute = () => setStart(true)
  const openExplainer = () => updateOverlay({
    content: <WhatIsADispute />,
    showCloseButton: true
  })
  const goBack = () => {
    if (topic) return setTopic(undefined)
    return setStart(false)
  }


  const submit = async () => {
    validate({
      email: {
        required: true,
        email: true
      },
      topic: {
        required: true,
      },
      message: {
        required: true,
      }
    })
    if (!isFormValid() || !email || !topic || !message) return

    const [result, err] = await raiseDispute({
      contractId,
      email,
      topic,
      message
    })
    if (result) {
      updateOverlay({
        content: <RaiseDisputeSuccess navigation={navigation} contractId={contractId} message={message} />,
        showCloseButton: false
      })
      return
    }

    if (err) {
      error('Error', err)
      updateMessage({
        msg: i18n(err?.error || 'error.general'),
        level: 'ERROR',
      })
    }
  }


  return <View style={tw`h-full pt-6 px-6 flex-col justify-between items-center pb-10`}>
    <View style={tw`mb-2`}>
      <Title
        title={i18n(view === 'buyer' ? 'buy.title' : 'sell.title')}
      />
      <Text style={tw`text-grey-2 text-center -mt-1`}>
        {i18n('contract.subtitle')} <SatsFormat sats={contract?.amount || 0}
          color={tw`text-grey-2`} color2={tw`text-grey-4`}
        />
      </Text>
    </View>
    {!start
      ? <View style={tw`flex items-center`}>
        <Text style={tw`text-center`}>
          {i18n('dispute.doYouWantToOpenDispute')}
        </Text>
        <Button
          wide={false}
          onPress={startDispute}
          style={tw`mt-5`}
          title={i18n('dispute.openDispute')}
        />
        <Button
          secondary={true}
          wide={false}
          onPress={navigation.goBack}
          style={tw`mt-2`}
          title={i18n('neverMind')}
        />
        <Button
          secondary={true}
          wide={false}
          onPress={openExplainer}
          style={tw`mt-2`}
          title={i18n('whatIsThis')}
        />
      </View>
      : !topic
        ? <View style={tw`flex items-center`}>
          <Text style={tw`text-center`}>
            {i18n('dispute.whatIsTheDisputeAbout') + '\n'}
          </Text>
          {availableTopics.map((tpc, i) => <Button
            key={tpc}
            wide={false}
            onPress={() => setTopic(tpc)}
            style={i === 0 ? tw`mt-5` : tw`mt-2`}
            title={i18n(`dispute.topic.${tpc}`)}
          />)}
        </View>
        : <View style={tw`flex items-center`}>
          <Text style={tw`text-center px-4`}>
            {i18n('dispute.provideExplanation')}
          </Text>
          <View style={tw`mt-4`}>
            <Input
              onChange={setEmail}
              onSubmit={() => $message?.focus()}
              value={email}
              label={i18n('form.userEmail')}
              isValid={!isFieldInError('email')}
              autoCorrect={false}
              errorMessage={getErrorsInField('email')}
            />
          </View>
          <View style={tw`mt-2`}>
            <Input
              style={tw`h-40`}
              onChange={setMessage}
              reference={(el: any) => $message = el}
              value={message}
              multiline={true}
              label={i18n('form.message')}
              isValid={!isFieldInError('message')}
              autoCorrect={false}
              errorMessage={getErrorsInField('message')}
            />
          </View>
          <Button
            wide={false}
            onPress={submit}
            style={tw`mt-2`}
            title={i18n('confirm')}
          />
        </View>
    }
    <View style={tw`flex-col flex-shrink`}>
      <Fade show={start && !keyboardOpen} pointerEvents={start ? 'auto' : 'none'} displayNone={false}>
        <Button
          secondary={true}
          wide={false}
          onPress={goBack}
          style={tw`mt-2`}
          title={i18n('back')}
        />
      </Fade>
    </View>
  </View>
}