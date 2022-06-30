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
export const BankTransferCH = ({
  forwardRef,
  view,
  data,
  currencies = [],
  onSubmit,
  onChange
}: PaymentMethodFormProps): ReactElement => {
  const [label, setLabel] = useState(data?.label || '')
  const [iban, setIBAN] = useState(data?.iban || '')
  const [beneficiary, setBeneficiary] = useState(data?.beneficiary || '')
  const [address, setAddress] = useState(data?.address || '')
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)

  let $beneficiary = useRef<TextInput>(null).current
  let $iban = useRef<TextInput>(null).current
  let $address = useRef<TextInput>(null).current

  const { validate, isFieldInError, getErrorsInField, isFormValid } = useValidation({
    deviceLocale: 'default',
    state: { label, beneficiary, iban, address },
    rules,
    messages: getMessages()
  })

  const buildPaymentData = (): PaymentData & BankTransferCHData => ({
    id: data?.id || `bankTransferCH-${new Date().getTime()}`,
    label,
    type: 'bankTransferCH',
    beneficiary,
    iban,
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
      iban: {
        required: true,
        iban: true
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
  }, [label, iban, beneficiary, address, selectedCurrencies])

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
        onSubmit={() => $iban?.focus()}
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
        onChange={setIBAN}
        onSubmit={() => $address?.focus()}
        reference={(el: any) => $iban = el}
        value={iban}
        disabled={view === 'view'}
        label={i18n('form.iban')}
        isValid={!isFieldInError('iban')}
        autoCorrect={false}
        errorMessage={getErrorsInField('iban')}
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
      paymentMethod="bankTransferCH"
      selectedCurrencies={selectedCurrencies}
      onToggle={onCurrencyToggle}
    />
  </View>
}