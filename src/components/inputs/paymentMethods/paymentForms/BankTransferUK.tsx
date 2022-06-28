import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
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
export const BankTransferUK = ({ forwardRef, view, data, onSubmit, onChange }: PaymentMethodFormProps) => {
  const [label, setLabel] = useState(data?.label || '')
  const [beneficiary, setBeneficiary] = useState(data?.beneficiary || '')
  const [ukSortCode, setUKSortCode] = useState(data?.ukSortCode || '')
  const [ukBankAccount, setUKBankAccount] = useState(data?.ukBankAccount || '')
  const [address, setAddress] = useState(data?.address || '')
  const [currencies, setCurrencies] = useState(data?.currencies || [])
  const [selectedCurrencies, setSelectedCurrencies] = useState(currencies)

  let $beneficiary = useRef<TextInput>(null).current
  let $ukSortCode = useRef<TextInput>(null).current
  let $ukBankAccount = useRef<TextInput>(null).current
  let $address = useRef<TextInput>(null).current

  const { validate, isFieldInError, getErrorsInField, isFormValid } = useValidation({
    deviceLocale: 'default',
    state: { label, beneficiary, ukSortCode, ukBankAccount, address },
    rules,
    messages: getMessages()
  })

  const buildPaymentData = (): PaymentData & BankTransferUKData => ({
    id: data?.id || `bankTransferUK-${new Date().getTime()}`,
    label,
    type: 'bankTransferUK',
    beneficiary,
    ukSortCode,
    ukBankAccount,
    address,
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
      beneficiary: {
        required: true,
      },
      ukSortCode: {
        required: true,
        ukSortCode: true
      },
      ukBankAccount: {
        required: true,
        ukBankAccount: true
      },
      address: {
        required: false,
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
  }, [label, beneficiary, ukSortCode, ukBankAccount, address, selectedCurrencies])

  return <View>
    <View>
      <Input
        onChange={setLabel}
        onSubmit={() => $beneficiary?.focus()}
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
        onChange={setBeneficiary}
        onSubmit={() => $ukSortCode?.focus()}
        reference={(el: any) => $beneficiary = el}
        value={beneficiary}
        disabled={view === 'view'}
        label={i18n('form.beneficiary')}
        isValid={!isFieldInError('beneficiary')}
        autoCorrect={false}
        errorMessage={getErrorsInField('beneficiary')}
      />
    </View>
    <View style={tw`mt-2`}>
      <Input
        onChange={setUKSortCode}
        onSubmit={() => $ukBankAccount?.focus()}
        reference={(el: any) => $ukSortCode = el}
        value={ukSortCode}
        disabled={view === 'view'}
        label={i18n('form.ukSortCode')}
        isValid={!isFieldInError('ukSortCode')}
        autoCorrect={false}
        errorMessage={getErrorsInField('ukSortCode')}
      />
    </View>
    <View style={tw`mt-2`}>
      <Input
        onChange={setUKBankAccount}
        onSubmit={() => $address?.focus()}
        reference={(el: any) => $ukBankAccount = el}
        value={ukBankAccount}
        disabled={view === 'view'}
        label={i18n('form.ukBankAccount')}
        isValid={!isFieldInError('ukBankAccount')}
        autoCorrect={false}
        errorMessage={getErrorsInField('ukBankAccount')}
      />
    </View>
    <View style={tw`mt-2`}>
      <Input
        onChange={setAddress}
        onSubmit={save}
        reference={(el: any) => $address = el}
        value={address}
        required={false}
        disabled={view === 'view'}
        label={i18n('form.address')}
        isValid={!isFieldInError('address')}
        autoCorrect={false}
        errorMessage={getErrorsInField('address')}
      />
    </View>
    <CurrencySelection style={tw`mt-2`}
      paymentMethod="bankTransferUK"
      selectedCurrencies={selectedCurrencies}
      onToggle={onCurrencyToggle}
    />
  </View>
}