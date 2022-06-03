import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Pressable, TextInput, View } from 'react-native'
import { PaymentMethodForm } from '.'
import keyboard from '../../../../effects/keyboard'
import tw from '../../../../styles/tailwind'
import { getPaymentData, removePaymentData } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getMessages, rules } from '../../../../utils/validation'
import { Fade } from '../../../animation'
import Button from '../../../Button'
import Icon from '../../../Icon'
import { Text } from '../../../text'
import Input from '../../Input'
import { CurrencySelection, toggleCurrency } from './CurrencySelection'
const { useValidation } = require('react-native-form-validator')


// eslint-disable-next-line max-lines-per-function
export const PayPal: PaymentMethodForm = ({ style, view, data, onSubmit, onChange, onCancel }): ReactElement => {
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [id, setId] = useState(data?.id || '')
  const [phone, setPhone] = useState(data?.phone || '')
  const [email, setEmail] = useState(data?.email || '')
  const [userName, setUserName] = useState(data?.userName || '')
  const [currencies] = useState(data?.currencies || [])
  const [selectedCurrencies, setSelectedCurrencies] = useState(currencies)

  let $phone = useRef<TextInput>(null).current
  let $email = useRef<TextInput>(null).current
  let $userName = useRef<TextInput>(null).current
  const anyFieldSet = !!(phone || userName || email)

  const { validate, isFieldInError, getErrorsInField, isFormValid } = useValidation({
    deviceLocale: 'default',
    state: { id, phone, userName, email },
    rules,
    messages: getMessages()
  })

  const buildPaymentData = (): PaymentData & PaypalData => ({
    id,
    type: 'paypal',
    phone,
    email,
    userName,
    currencies,
  })

  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
  }

  const save = () => {
    validate({
      id: {
        required: true,
        duplicate: view === 'new' && getPaymentData(id)
      },
      phone: {
        required: !email && !userName,
        phone: true
      },
      email: {
        required: !phone && !userName,
        email: !phone && !userName
      },
      userName: {
        required: !phone && !email,
        userName: true
      },
    })
    if (!isFormValid()) return

    if (onSubmit) onSubmit(buildPaymentData())
  }

  const cancel = () => {
    if (onCancel) onCancel(buildPaymentData())
  }

  const remove = () => {
    removePaymentData(data?.id || '')
    if (onSubmit) onSubmit(buildPaymentData())
  }

  useEffect(keyboard(setKeyboardOpen), [])

  useEffect(() => {
    if (onChange) onChange(buildPaymentData())
  }, [id, phone, email, userName, selectedCurrencies])

  return <View style={[tw`flex`, style]}>
    <View style={tw`h-full flex-shrink flex justify-center`}>
      <View>
        <Input
          onChange={setId}
          onSubmit={() => $phone?.focus()}
          value={id}
          disabled={view === 'view'}
          label={i18n('form.paymentMethodName')}
          isValid={!isFieldInError('id')}
          autoCorrect={false}
          errorMessage={getErrorsInField('id')}
        />
      </View>
      <View style={tw`mt-2`}>
        <Input
          onChange={setPhone}
          onSubmit={() => $email?.focus()}
          reference={(el: any) => $phone = el}
          value={phone}
          required={!anyFieldSet}
          disabled={view === 'view'}
          label={i18n('form.phone')}
          isValid={!isFieldInError('phone')}
          autoCorrect={false}
          errorMessage={getErrorsInField('phone')}
        />
      </View>
      <View style={tw`mt-2`}>
        <Input
          onChange={setEmail}
          onSubmit={() => $userName?.focus()}
          reference={(el: any) => $email = el}
          required={!anyFieldSet}
          value={email}
          disabled={view === 'view'}
          label={i18n('form.email')}
          isValid={!isFieldInError('userName')}
          autoCorrect={false}
          errorMessage={getErrorsInField('userName')}
        />
      </View>
      <View style={tw`mt-2`}>
        <Input
          onChange={setUserName}
          onSubmit={() => {
            setUserName((user: string) => !/@/ug.test(userName) ? `@${userName}` : user)
            save()
          }}
          reference={(el: any) => $userName = el}
          required={!anyFieldSet}
          value={userName}
          disabled={view === 'view'}
          label={i18n('form.userName')}
          isValid={!isFieldInError('userName')}
          autoCorrect={false}
          errorMessage={getErrorsInField('userName')}
        />
      </View>
      <CurrencySelection style={tw`mt-2`}
        paymentMethod="paypal"
        selectedCurrencies={selectedCurrencies}
        onToggle={onCurrencyToggle}
      />
    </View>
    {view !== 'view'
      ? <Fade show={!keyboardOpen} style={tw`w-full flex items-center`}>
        <Pressable style={tw`absolute left-0 z-10`} onPress={cancel}>
          <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-white-1`.color as string} />
        </Pressable>
        <Button
          title={i18n('form.paymentMethod.add')}
          secondary={true}
          wide={false}
          onPress={save}
        />
        {view === 'edit'
          ? <Pressable onPress={remove} style={tw`mt-6`}>
            <Text style={tw`font-baloo text-sm text-center underline text-white-1`}>
              {i18n('form.paymentMethod.remove')}
            </Text>
          </Pressable>
          : null
        }
      </Fade>
      : null
    }
  </View>
}