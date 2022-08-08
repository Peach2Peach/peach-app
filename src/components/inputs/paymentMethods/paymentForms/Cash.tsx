import React, { ReactElement, useEffect, useImperativeHandle, useState } from 'react'
import { Pressable, View } from 'react-native'
import { PaymentMethodFormProps } from '.'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import Icon from '../../../Icon'
import { Text } from '../../../text'
import CashTitle from './cash-title.svg'

const { useValidation } = require('react-native-form-validator')

export const Cash = ({
  forwardRef,
  data,
  currencies = [],
  onSubmit,
  onChange
}: PaymentMethodFormProps): ReactElement => {
  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = useState(data?.disclaimerAcknowledged || false)

  const buildPaymentData = (): PaymentData & CashData => ({
    id: data?.id || `cash-${new Date().getTime()}`,
    label: 'Cash on the conference!',
    type: 'cash',
    currencies: data?.currencies || currencies,
  })

  const acknowledge = () => setDisclaimerAcknowledged(true)
  const validateForm = () => disclaimerAcknowledged
  const save = () => {
    if (!validateForm()) return

    if (onSubmit) onSubmit(buildPaymentData())
  }

  useImperativeHandle(forwardRef, () => ({
    buildPaymentData,
    validateForm,
    save,
  }))

  useEffect(() => {
    if (onChange) onChange(buildPaymentData())
  }, [disclaimerAcknowledged])

  return <View style={tw`h-full flex justify-between items-center -mb-16`}>
    <CashTitle style={tw`max-w-full max-h-20`}/>
    <View>
      <Text style={tw`text-center`}>
        {i18n('paymentMethod.cash.riga.1')}
      </Text>
      <Text style={tw`mt-1 text-center`}>
        {i18n('paymentMethod.cash.riga.2')}
      </Text>
    </View>
    <Pressable onPress={acknowledge} style={tw`flex flex-row justify-between items-center`}>
      <View style={tw`w-5 h-5 flex items-center justify-center ml-4`}>
        {disclaimerAcknowledged
          ? <Icon id="checkbox" style={tw`w-5 h-5`} color={tw`text-peach-1`.color as string} />
          : <View style={tw`w-4 h-4 rounded-sm border-2 border-grey-2`} />
        }
      </View>
      <Text style={tw`pl-7 flex-shrink`}>
        {i18n('paymentMethod.cash.riga.checkbox')}
      </Text>
    </Pressable>
  </View>
}