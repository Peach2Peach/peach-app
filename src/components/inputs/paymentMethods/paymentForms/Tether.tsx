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
export const Tether: PaymentMethodForm = ({ style, data, view, onSubmit, onChange, onCancel  }) => {
  const [keyboardOpen, setKeyboardOpen] = useState(false)
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
      tetherAddress: {
        required: true,
        tetherAddress: true,
      }
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
  }, [label, tetherAddress, selectedCurrencies])

  return <View style={[tw`flex`, style]}>
    <View style={tw`h-full flex-shrink flex justify-center`}>
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