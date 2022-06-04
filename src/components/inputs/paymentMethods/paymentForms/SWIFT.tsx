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
export const SWIFT: PaymentMethodForm = ({ style, data, view, onSubmit, onChange, onCancel  }) => {
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [label, setLabel] = useState(data?.label || '')
  const [bic, setBIC] = useState(data?.iban || '')
  const [beneficiary, setBeneficiary] = useState(data?.beneficiary || '')
  const [currencies, setCurrencies] = useState(data?.currencies || [])
  const [selectedCurrencies, setSelectedCurrencies] = useState(currencies)

  let $beneficiary = useRef<TextInput>(null).current
  let $bic = useRef<TextInput>(null).current

  const { validate, isFieldInError, getErrorsInField, isFormValid } = useValidation({
    deviceLocale: 'default',
    state: { label, bic, beneficiary },
    rules,
    messages: getMessages()
  })

  const buildPaymentData = (): PaymentData & SWIFTData => ({
    id: data?.id || `paypal-${new Date().getTime()}`,
    label,
    type: 'swift',
    bic,
    beneficiary,
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
      bic: {
        required: true,
        bic: true
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
  }, [label, bic, beneficiary, selectedCurrencies])

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
          onSubmit={() => $bic?.focus()}
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
        paymentMethod="swift"
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