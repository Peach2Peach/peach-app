import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { PaymentMethodFormProps } from '.'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getMessages, rules } from '../../../../utils/validation'
import { HorizontalLine } from '../../../ui'
import Input from '../../Input'
import { CurrencySelection, toggleCurrency } from './CurrencySelection'
const { useValidation } = require('react-native-form-validator')

// eslint-disable-next-line max-lines-per-function
export const Wise = ({ forwardRef, view, data, onSubmit, onChange }: PaymentMethodFormProps) => {
  const [label, setLabel] = useState(data?.label || '')
  const [email, setEmail] = useState(data?.email || '')
  const [beneficiary, setBeneficiary] = useState(data?.beneficiary || '')
  const [iban, setIBAN] = useState(data?.IBAN || '')
  const [bic, setBIC] = useState(data?.bic || '')
  const [currencies] = useState(data?.currencies || [])
  const [selectedCurrencies, setSelectedCurrencies] = useState(currencies)

  let $email = useRef<TextInput>(null).current
  let $beneficiary = useRef<TextInput>(null).current
  let $iban = useRef<TextInput>(null).current
  let $bic = useRef<TextInput>(null).current
  const anyFieldSet = !!(email || (beneficiary && (iban || bic)))

  const { validate, isFieldInError, getErrorsInField, isFormValid } = useValidation({
    deviceLocale: 'default',
    state: { label, email, beneficiary, iban, bic },
    rules,
    messages: getMessages()
  })

  const buildPaymentData = (): PaymentData & WiseData => ({
    id: data?.id || `wise-${new Date().getTime()}`,
    label,
    type: 'wise',
    email,
    beneficiary,
    iban,
    bic,
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
      email: {
        required: !iban && !bic,
        email: true
      },
      beneficiary: {
        required: !email,
      },
      iban: {
        required: !email,
        iban: true
      },
      bic: {
        bic: true
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
  }, [label, email, beneficiary, iban, bic, selectedCurrencies])

  return <View>
    <View>
      <Input
        onChange={setLabel}
        onSubmit={() => $email?.focus()}
        value={label}
        disabled={view === 'view'}
        label={i18n('form.paymentMethodName')}
        isValid={!isFieldInError('label')}
        autoCorrect={false}
        errorMessage={getErrorsInField('label')}
      />
    </View>
    <HorizontalLine style={tw`mt-4`} />
    <View style={tw`mt-4`}>
      <Input
        onChange={setEmail}
        onSubmit={() => $beneficiary?.focus()}
        reference={(el: any) => $email = el}
        value={email}
        required={!iban}
        disabled={view === 'view'}
        label={i18n('form.email')}
        isValid={!isFieldInError('email')}
        autoCorrect={false}
        errorMessage={getErrorsInField('email')}
      />
    </View>
    <HorizontalLine style={tw`mt-4`} />
    <View style={tw`mt-4`}>
      <Input
        onChange={setBeneficiary}
        onSubmit={() => $iban?.focus()}
        reference={(el: any) => $beneficiary = el}
        required={!anyFieldSet}
        value={beneficiary}
        disabled={view === 'view'}
        label={i18n('form.beneficiary')}
        isValid={!isFieldInError('beneficiary')}
        autoCorrect={false}
        errorMessage={getErrorsInField('beneficiary')}
      />
    </View>
    <View style={tw`mt-4`}>
      <Input
        onChange={setIBAN}
        onSubmit={() => $bic?.focus()}
        reference={(el: any) => $iban = el}
        required={!email}
        value={iban}
        disabled={view === 'view'}
        label={i18n('form.iban')}
        isValid={!isFieldInError('iban')}
        autoCorrect={false}
        errorMessage={getErrorsInField('iban')}
      />
    </View>
    <View style={tw`mt-4`}>
      <Input
        onChange={setBIC}
        onSubmit={save}
        reference={(el: any) => $bic = el}
        value={bic}
        disabled={view === 'view'}
        label={i18n('form.bic')}
        isValid={!isFieldInError('bic')}
        autoCorrect={false}
        errorMessage={getErrorsInField('bic')}
      />
    </View>
    <CurrencySelection style={tw`mt-2`}
      paymentMethod="wise"
      selectedCurrencies={selectedCurrencies}
      onToggle={onCurrencyToggle}
    />
  </View>
}