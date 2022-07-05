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
export const Twint = ({
  forwardRef,
  view,
  data,
  currencies = [],
  onSubmit,
  onChange
}: PaymentMethodFormProps): ReactElement => {
  const [label, setLabel] = useState(data?.label || '')
  const [phone, setPhone] = useState(data?.phone || '')
  const [beneficiary, setBeneficiary] = useState(data?.beneficiary || '')
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)

  let $phone = useRef<TextInput>(null).current
  let $beneficiary = useRef<TextInput>(null).current

  const { validate, isFieldInError, getErrorsInField, isFormValid } = useValidation({
    deviceLocale: 'default',
    state: { label, phone, beneficiary },
    rules,
    messages: getMessages()
  })

  const buildPaymentData = (): PaymentData & TwintData => ({
    id: data?.id || `twint-${new Date().getTime()}`,
    label,
    type: 'twint',
    phone,
    beneficiary,
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
        phone: true,
      }
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
  }, [label, phone, beneficiary, selectedCurrencies])

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
        onSubmit={() => $beneficiary?.focus()}
        reference={(el: any) => $phone = el}
        value={phone}
        disabled={view === 'view'}
        label={i18n('form.phone')}
        isValid={!isFieldInError('phone')}
        autoCorrect={false}
        errorMessage={getErrorsInField('phone')}
      />
    </View>
    <View style={tw`mt-2`}>
      <Input
        onChange={setBeneficiary}
        onSubmit={save}
        reference={(el: any) => $beneficiary = el}
        value={beneficiary}
        required={false}
        disabled={view === 'view'}
        label={i18n('form.name')}
        isValid={!isFieldInError('beneficiary')}
        autoCorrect={false}
        errorMessage={getErrorsInField('beneficiary')}
      />
    </View>
    <CurrencySelection style={tw`mt-2`}
      paymentMethod="twint"
      selectedCurrencies={selectedCurrencies}
      onToggle={onCurrencyToggle}
    />
  </View>
}