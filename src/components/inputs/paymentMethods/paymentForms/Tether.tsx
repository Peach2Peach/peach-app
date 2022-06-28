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
export const Tether = ({ forwardRef, view, data, onSubmit, onChange }: PaymentMethodFormProps) => {
  const [label, setLabel] = useState(data?.label || '')
  const [tetherAddress, setTetherAddress] = useState(data?.tetherAddress || '')
  const [currencies, setCurrencies] = useState(data?.currencies || [])
  const [selectedCurrencies, setSelectedCurrencies] = useState(currencies)

  let $tetherAddress = useRef<TextInput>(null).current

  const { validate, isFieldInError, getErrorsInField, isFormValid } = useValidation({
    deviceLocale: 'default',
    state: { label, tetherAddress },
    rules,
    messages: getMessages()
  })

  const buildPaymentData = (): PaymentData & TetherData => ({
    id: data?.id || `tether-${new Date().getTime()}`,
    label,
    type: 'tether',
    tetherAddress,
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
      tetherAddress: {
        required: true,
        tetherAddress: true,
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
  }, [label, tetherAddress, selectedCurrencies])

  return <View>
    <View>
      <Input
        onChange={setLabel}
        onSubmit={() => $tetherAddress?.focus()}
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
        onChange={setTetherAddress}
        onSubmit={save}
        reference={(el: any) => $tetherAddress = el}
        value={tetherAddress}
        disabled={view === 'view'}
        label={i18n('form.tetherAddress.tether')}
        isValid={!isFieldInError('tetherAddress')}
        autoCorrect={false}
        errorMessage={getErrorsInField('tetherAddress')}
      />
    </View>
    <CurrencySelection style={tw`mt-2`}
      paymentMethod="tether"
      selectedCurrencies={selectedCurrencies}
      onToggle={onCurrencyToggle}
    />
  </View>
}