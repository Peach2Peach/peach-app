import React, { ReactElement, useContext, useState } from 'react'
import { Keyboard, View } from 'react-native'
import tw from '../styles/tailwind'

import { Button, Headline, Input, Loading, Text } from '../components'
import i18n from '../utils/i18n'
import { OverlayContext } from '../contexts/overlay'
import { contractIdToHex } from '../utils/contract'
import { acknowledgeDispute } from '../utils/peachAPI/private/contract'
import { getMessages, rules } from '../utils/validation'
import SuccessOverlay from './SuccessOverlay'
import { MessageContext } from '../contexts/message'
import { NavigationContainerRefWithCurrent } from '@react-navigation/native'
import { error } from '../utils/log'
import { StackNavigationProp } from '@react-navigation/stack'
const { useValidation } = require('react-native-form-validator')
type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'dispute'|'contract'|'contractChat'>


type YouGotADisputeProps = {
  message: string,
  contractId: Contract['id'],
  navigation: NavigationContainerRefWithCurrent<RootStackParamList>|ProfileScreenNavigationProp,
}

// eslint-disable-next-line max-lines-per-function
export default ({ message, contractId, navigation }: YouGotADisputeProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)
  const [email, setEmail] = useState()
  const [loading, setLoading] = useState(false)

  const { validate, isFieldInError, getErrorsInField, isFormValid } = useValidation({
    deviceLocale: 'default',
    state: { email },
    rules,
    messages: getMessages()
  })

  const closeOverlay = () => {
    navigation.navigate('contract', { contractId })
    updateOverlay({ content: null, showCloseButton: true })
  }
  const submit = async () => {
    validate({
      email: {
        required: true,
        email: true
      }
    })
    if (!isFormValid() || !email) return

    setLoading(true)
    const [result, err] = await acknowledgeDispute({
      contractId,
      email
    })
    if (result) {
      Keyboard.dismiss()
      updateOverlay({
        content: <SuccessOverlay />,
        showCloseButton: false
      })
      setTimeout(closeOverlay, 3000)
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
  return <View style={tw`flex items-center`}>
    <Headline style={tw`text-3xl leading-3xl text-white-1`}>
      {i18n('dispute.startedOverlay.title')}
    </Headline>
    <View style={tw`flex justify-center items-center`}>
      <Text style={tw`text-white-1 text-center`}>
        {i18n('dispute.startedOverlay.description.1', contractIdToHex(contractId))}
      </Text>
      <Text style={tw`text-white-1 text-center mt-2`}>
        {i18n('dispute.startedOverlay.description.2')}
      </Text>
      <Text style={tw`text-white-1 italic text-center mt-2`}>
        {message}
      </Text>
      <Text style={tw`text-white-1 text-center mt-2`}>
        {i18n('dispute.startedOverlay.description.3')}
      </Text>
    </View>
    <View style={tw`mt-4`}>
      <Input
        onChange={setEmail}
        onSubmit={submit}
        value={email}
        label={i18n('form.userEmail')}
        isValid={!isFieldInError('email')}
        autoCorrect={false}
        errorMessage={getErrorsInField('email')}
      />
    </View>
    <View style={tw`flex items-center`}>
      <Button
        style={tw`mt-6`}
        title={loading ? '' : i18n('close')}
        disabled={loading}
        loading={loading}
        secondary={true}
        wide={false}
        onPress={submit}
      />
    </View>
  </View>
}