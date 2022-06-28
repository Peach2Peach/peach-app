import React, { ReactElement, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { PaymentMethodFormProps } from '.'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getMessages, rules } from '../../../../utils/validation'
import Input from '../../Input'
import { CurrencySelection, toggleCurrency } from './CurrencySelection'
const { useValidation } = require('react-native-form-validator')

// eslint-disable-next-line max-lines-per-function
export const ApplePay = ({
  forwardRef,
  view,
  data,
  currencies = [],
  onSubmit,
  onChange
}: PaymentMethodFormProps): ReactElement => {
  const [label, setLabel] = useState(data?.label || '')
  const [phone, setPhone] = useState(data?.phone || '')
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)

  let $phone = useRef<TextInput>(null).current

  const { validate, isFieldInError, getErrorsInField, isFormValid } = useValidation({
    deviceLocale: 'default',
    state: { label, phone },
    rules,
    messages: getMessages()
  })

  const buildPaymentData = (): PaymentData & ApplePayData => ({
    id: data?.id || `applePay-${new Date().getTime()}`,
    label,
    type: 'applePay',
    phone,
    currencies: selectedCurrencies,
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
        required: true,
        phone: true
      },
    })
    if (!isFormValid()) return

    if (onSubmit) onSubmit(buildPaymentData())
  }

  useImperativeHandle(forwardRef, () => ({
    buildPaymentData,
    save
  }))


  useEffect(() => {
    if (onChange) onChange(buildPaymentData())
  }, [label, phone, selectedCurrencies])

  return <View>
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
        onSubmit={save}
        reference={(el: any) => $phone = el}
        value={phone}
        disabled={view === 'view'}
        label={i18n('form.phone')}
        isValid={!isFieldInError('phone')}
        autoCorrect={false}
        errorMessage={getErrorsInField('phone')}
      />
    </View>
    <CurrencySelection style={tw`mt-2`}
      paymentMethod="applePay"
      selectedCurrencies={selectedCurrencies}
      onToggle={onCurrencyToggle}
    />
  </View>
}