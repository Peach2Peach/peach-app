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
import { signAndEncrypt } from '../../utils/pgp'
import { PEACHPGPPUBLICKEY } from '../../constants'
import keyboard from '../../effects/keyboard'
const { useValidation } = require('react-native-form-validator')

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'dispute'>

type Props = {
  route: RouteProp<{ params: {
    contractId: string,
  } }>,
  navigation: ProfileScreenNavigationProp,
}

const disputeReasonsSeller: DisputeReason[] = [
  'noPayment',
  'wrongPaymentAmount',
  'buyerUnresponsive',
  'buyerBehaviour',
  'disputeOther'
]
const disputeReasonsBuyer: DisputeReason[] = [
  'satsNotReceived',
  'sellerUnresponsive',
  'sellerBehaviour',
  'disputeOther'
]

// eslint-disable-next-line max-lines-per-function, max-statements
export default ({ route, navigation }: Props): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)

  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [contractId, setContractId] = useState(route.params.contractId)
  const [contract, setContract] = useState<Contract|null>(() => getContract(contractId))
  const [start, setStart] = useState(false)
  const [reason, setReason] = useState<DisputeReason>()
  const [email, setEmail] = useState()
  const [message, setMessage] = useState()
  const [loading, setLoading] = useState(false)
  let $message = useRef<TextInput>(null).current

  const view = contract ? account.publicKey === contract.seller.id ? 'seller' : 'buyer' : ''
  const availableReasons = view === 'seller' ? disputeReasonsSeller : disputeReasonsBuyer

  const { validate, isFieldInError, getErrorsInField, isFormValid } = useValidation({
    deviceLocale: 'default',
    state: { email, message },
    rules,
    messages: getMessages()
  })

  useEffect(() => {
    setContractId(route.params.contractId)
    setContract(getContract(route.params.contractId))
    setStart(false)
    setReason(undefined)
    setMessage(undefined)
    setLoading(false)
  }, [route])

  useEffect(keyboard(setKeyboardOpen), [])

  const startDispute = () => setStart(true)
  const openExplainer = () => updateOverlay({
    content: <WhatIsADispute />,
    showCloseButton: true
  })
  const goBack = () => {
    if (reason) return setReason(undefined)
    return setStart(false)
  }


  const submit = async () => {
    if (!contract?.symmetricKey) return

    validate({
      email: {
        required: true,
        email: true
      },
      reason: {
        required: true,
      },
      message: {
        required: true,
      }
    })
    if (!isFormValid() || !email || !reason || !message) return
    setLoading(true)

    const { encrypted: symmetricKeyEncrypted } = await signAndEncrypt(
      contract.symmetricKey,
      PEACHPGPPUBLICKEY
    )

    const [result, err] = await raiseDispute({
      contractId,
      email,
      reason,
      message,
      symmetricKeyEncrypted
    })
    if (result) {
      Keyboard.dismiss()
      updateOverlay({
        content: <RaiseDisputeSuccess />,
        showCloseButton: false
      })
      setTimeout(() => {
        navigation.navigate('contract', { contractId })
        updateOverlay({ content: null, showCloseButton: true })
      }, 3000)
      setLoading(false)

      return
    }

    if (err) {
      error('Error', err)
      updateMessage({
        msg: i18n(err?.error || 'error.general'),
        level: 'ERROR',
      })
    }
    setLoading(false)
  }


  return <View style={tw`h-full pt-6 px-6 flex-col justify-between items-center pb-10`}>
    <View style={tw`mb-2`}>
      <Title
        title={i18n(view === 'buyer' ? 'buy.title' : 'sell.title')}
      />
      <Text style={tw`text-grey-2 text-center -mt-1`}>
        {i18n('contract.subtitle')} <SatsFormat sats={contract?.amount || 0}
          color={tw`text-grey-2`}
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
      : !reason
        ? <View style={tw`flex items-center`}>
          <Text style={tw`text-center`}>
            {i18n('dispute.whatIsTheDisputeAbout') + '\n'}
          </Text>
          {availableReasons.map((rsn, i) => <Button
            key={rsn}
            wide={true}
            onPress={() => setReason(rsn)}
            style={i === 0 ? tw`mt-5` : tw`mt-2`}
            title={i18n(`dispute.reason.${rsn}`)}
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
            loading={loading}
            disabled={loading}
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