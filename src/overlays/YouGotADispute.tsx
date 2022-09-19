import { NavigationContainerRefWithCurrent } from '@react-navigation/native'
import React, { ReactElement, useContext, useState } from 'react'
import { Keyboard, View } from 'react-native'
import { Button, Headline, Input, Text } from '../components'
import { MessageContext } from '../contexts/message'
import { OverlayContext } from '../contexts/overlay'
import tw from '../styles/tailwind'
import { getContract, getOfferIdfromContract } from '../utils/contract'
import i18n from '../utils/i18n'
import { error } from '../utils/log'
import { Navigation } from '../utils/navigation'
import { acknowledgeDispute } from '../utils/peachAPI/private/contract'
import { getMessages, rules } from '../utils/validation'
import { isEmailRequired } from '../views/dispute/Dispute'
import SuccessOverlay from './SuccessOverlay'
const { useValidation } = require('react-native-form-validator')

type YouGotADisputeProps = {
  message: string,
  reason: DisputeReason,
  contractId: Contract['id'],
  navigation: Navigation,
}

// eslint-disable-next-line max-lines-per-function
export default ({ message, reason, contractId, navigation }: YouGotADisputeProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)

  const [email, setEmail] = useState()
  const [loading, setLoading] = useState(false)

  const contract = getContract(contractId)
  const offerId = getOfferIdfromContract(contract as Contract)

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
        required: isEmailRequired(reason),
        email: isEmailRequired(reason)
      }
    })
    if (!isFormValid()) return

    setLoading(true)
    const [result, err] = await acknowledgeDispute({
      contractId,
      email,
    })
    if (result) {
      setLoading(false)

      if (isEmailRequired(reason)) {
        Keyboard.dismiss()
        updateOverlay({
          content: <SuccessOverlay />,
          showCloseButton: false
        })
        setTimeout(closeOverlay, 3000)
      } else {
        if ('push' in navigation) {
          navigation.push('contractChat', { contractId })
        } else {
          navigation.navigate({ name: 'contractChat', merge: false, params: { contractId } })
        }
        closeOverlay()
      }
      return
    }

    if (err) {
      error('Error', err)
      updateMessage({
        msgKey: err?.error || 'error.general',
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
        {i18n('dispute.startedOverlay.description.1', offerId)}
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
    {isEmailRequired(reason)
      ? <View style={tw`mt-4`}>
        <Input
          onChange={setEmail}
          onSubmit={submit}
          value={email}
          placeholder={i18n('form.userEmail')}
          isValid={!isFieldInError('email')}
          autoCorrect={false}
          errorMessage={getErrorsInField('email')}
        />
      </View>
      : null
    }
    <View style={tw`flex items-center`}>
      <Button
        style={tw`mt-6`}
        title={loading ? '' : i18n('dispute.startedOverlay.goToDispute')}
        disabled={loading}
        loading={loading}
        secondary={true}
        wide={false}
        onPress={submit}
      />
      {!isEmailRequired(reason)
        ? <Button
          style={tw`mt-2`}
          title={loading ? '' : i18n('close')}
          disabled={loading}
          loading={loading}
          tertiary={true}
          wide={false}
          onPress={closeOverlay}
        />
        : null
      }
    </View>
  </View>
}