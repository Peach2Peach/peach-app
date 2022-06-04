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
export const BankTransferUK: PaymentMethodForm = ({ style, view, data, onSubmit, onChange, onCancel }) => {
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [label, setLabel] = useState(data?.label || '')
  const [beneficiary, setBeneficiary] = useState(data?.beneficiary || '')
  const [ukSortCode, setUKSortCode] = useState(data?.ukSortCode || '')
  const [ukBankAccount, setUKBankAccount] = useState(data?.ukBankAccount || '')
  const [currencies, setCurrencies] = useState(data?.currencies || [])
  const [selectedCurrencies, setSelectedCurrencies] = useState(currencies)

  let $beneficiary = useRef<TextInput>(null).current
  let $ukSortCode = useRef<TextInput>(null).current
  let $ukBankAccount = useRef<TextInput>(null).current

  const { validate, isFieldInError, getErrorsInField, isFormValid } = useValidation({
    deviceLocale: 'default',
    state: { label, beneficiary, ukSortCode, ukBankAccount },
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
  }, [label, beneficiary, ukSortCode, ukBankAccount, selectedCurrencies])

  return <View style={[tw`flex`, style]}>
    <View style={tw`h-full flex-shrink flex justify-center`}>
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
          onSubmit={save}
          reference={(el: any) => $ukBankAccount = el}
          value={ukBankAccount}
          disabled={view === 'view'}
          label={i18n('form.ukBankAccount')}
          isValid={!isFieldInError('ukBankAccount')}
          autoCorrect={false}
          errorMessage={getErrorsInField('ukBankAccount')}
        />
      </View>
      <CurrencySelection style={tw`mt-2`}
        paymentMethod="bankTransferUK"
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