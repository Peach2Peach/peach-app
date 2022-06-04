import React, { useEffect, useRef, useState } from 'react'
import { Pressable, TextInput, View } from 'react-native'
import { PaymentMethodForm } from '.'
import keyboard from '../../../../effects/keyboard'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel, removePaymentData } from '../../../../utils/account'
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
export const Revolut: PaymentMethodForm = ({ style, view, data, onSubmit, onChange, onCancel }) => {
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [label, setLabel] = useState(data?.label || '')
  const [phone, setPhone] = useState(data?.phone || '')
  const [userName, setUserName] = useState(data?.userName || '')
  const [email, setEmail] = useState(data?.email || '')
  const [currencies, setCurrencies] = useState(data?.currencies || [])
  const [selectedCurrencies, setSelectedCurrencies] = useState(currencies)
  const anyFieldSet = !!(phone || userName || email)

  let $phone = useRef<TextInput>(null).current
  let $userName = useRef<TextInput>(null).current
  let $email = useRef<TextInput>(null).current

  const { validate, isFieldInError, getErrorsInField, isFormValid } = useValidation({
    deviceLocale: 'default',
    state: { label, phone, userName, email },
    rules,
    messages: getMessages()
  })

  const buildPaymentData = (): PaymentData & RevolutData => ({
    id: data?.id || `paypal-${new Date().getTime()}`,
    label,
    type: 'revolut',
    phone,
    userName,
    email,
    currencies,
  })

  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
  }

  const save = () => {
    validate({
      label: {
        required: true,
        duplicate: view === 'new' && getPaymentDataByLabel(label)
      },
      phone: {
        required: !userName && !email,
        phone: true
      },
      userName: {
        required: !phone && !email,
        userName: true
      },
      email: {
        required: !userName && !phone,
        email: true
      },
    })
    if (!isFormValid()) return

    if (onSubmit) onSubmit(buildPaymentData())
  }

  const cancel = () => {
    if (onCancel) onCancel(buildPaymentData())
  }

  const remove = () => {
    if (data?.id) removePaymentData(data.id)
    if (onCancel) onCancel(buildPaymentData())
  }

  useEffect(keyboard(setKeyboardOpen), [])

  useEffect(() => {
    if (onChange) onChange(buildPaymentData())
  }, [label, phone, userName, email, selectedCurrencies])

  return <View style={[tw`flex`, style]}>
    <View style={tw`h-full flex-shrink flex justify-center`}>
      <View>
        <Input
          onChange={setLabel}
          onSubmit={() => $phone?.focus()}
          value={label}
          disabled={view === 'view'}
          label={i18n('form.paymentMethodName')}
          isValid={!isFieldInError('label')}
          autoCorrect={false}
          errorMessage={getErrorsInField('label')}
        />
      </View>
      <View style={tw`mt-2`}>
        <Input
          onChange={setPhone}
          onSubmit={() => $userName?.focus()}
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
          onChange={setUserName}
          onSubmit={() => {
            setUserName((user: string) => !/@/ug.test(userName) ? `@${userName}` : user)
            $email?.focus()
          }}
          reference={(el: any) => $userName = el}
          value={userName}
          required={!anyFieldSet}
          disabled={view === 'view'}
          label={i18n('form.userName')}
          isValid={!isFieldInError('paymentLink')}
          autoCorrect={false}
          errorMessage={getErrorsInField('paymentLink')}
        />
      </View>
      <View style={tw`mt-2`}>
        <Input
          onChange={setEmail}
          onSubmit={save}
          reference={(el: any) => $email = el}
          value={email}
          required={!anyFieldSet}
          disabled={view === 'view'}
          label={i18n('form.email')}
          isValid={!isFieldInError('email')}
          autoCorrect={false}
          errorMessage={getErrorsInField('email')}
        />
      </View>
      <CurrencySelection style={tw`mt-2`}
        paymentMethod="revolut"
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
          title={i18n(view === 'new' ? 'form.paymentMethod.add' : 'form.paymentMethod.update')}
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