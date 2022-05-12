import React, { useEffect, useState } from 'react'
import { Keyboard, Pressable, View } from 'react-native'
import { PaymentMethodForm } from '.'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { getMessages, rules } from '../../../../utils/validation'
import { Fade } from '../../../animation'
import Button from '../../../Button'
import Icon from '../../../Icon'
import Input from '../../Input'
const { useValidation } = require('react-native-form-validator')

export const PayPal: PaymentMethodForm = ({ style, data, onSubmit, onCancel }) => {
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [paypal, setPayPal] = useState(data?.paypal || '')

  const { validate, isFieldInError, getErrorsInField, isFormValid } = useValidation({
    deviceLocale: 'default',
    state: { paypal },
    rules,
    messages: getMessages()
  })

  const save = () => {
    validate({
      paypal: {
        required: true,
        paypal: true
      },
    })
    if (!isFormValid()) return
    if (onSubmit) onSubmit({
      id: `paypal-${paypal}-${new Date().getTime()}`,
      type: 'paypal',
      paypal,
    })
  }

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', () => setKeyboardOpen(true))
    Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true))
    Keyboard.addListener('keyboardWillHide', () => setKeyboardOpen(false))
    Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false))
  }, [])

  return <View style={style}>
    <View style={[tw`mt-32`, tw.md`mt-40`]}>
      <View style={tw`mt-2`}>
        <Input
          onChange={setPayPal}
          onSubmit={save}
          value={paypal}
          disabled={!!data}
          label={i18n('form.paypal')}
          isValid={!isFieldInError('paypal')}
          autoCorrect={false}
          errorMessage={getErrorsInField('paypal')}
        />
      </View>
    </View>
    {!data
      ? <Fade show={!keyboardOpen} style={tw`w-full flex items-center`}>
        <Pressable style={tw`absolute left-0 z-10`} onPress={onCancel}>
          <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-white-1`.color as string} />
        </Pressable>
        <Button
          title={i18n('form.paymentMethod.add')}
          secondary={true}
          wide={false}
          onPress={save}
        />
      </Fade>
      : null
    }
  </View>
}