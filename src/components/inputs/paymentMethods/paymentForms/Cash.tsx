import React, { ReactElement, useEffect, useImperativeHandle, useState } from 'react'
import { Pressable, View } from 'react-native'
import { PaymentMethodFormProps } from '.'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import Icon from '../../../Icon'
import { Text } from '../../../text'

export const Cash = ({
  forwardRef,
  data,
  currencies = [],
  onSubmit,
  onChange,
}: PaymentMethodFormProps): ReactElement => {
  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = useState(data?.disclaimerAcknowledged || false)

  const buildPaymentData = (): PaymentData & CashData => ({
    id: data?.id || 'bitcoin-ljubljana',
    label: 'Cash in Ljubljana!',
    type: 'cash',
    disclaimerAcknowledged,
    currencies: data?.currencies || currencies,
  })

  const acknowledge = () => setDisclaimerAcknowledged(true)
  const isFormValid = () => disclaimerAcknowledged
  const save = () => {
    if (!isFormValid()) return

    if (onSubmit) onSubmit(buildPaymentData())
  }

  useImperativeHandle(forwardRef, () => ({
    buildPaymentData,
    isFormValid,
    save,
  }))

  useEffect(() => {
    if (onChange) onChange(buildPaymentData())
  }, [disclaimerAcknowledged])

  return (
    <View style={tw`h-full flex items-center -mb-16 bg-[#12172B]`}>
      <View>
        <Text style={tw`text-center text-white-1`}>{i18n('paymentMethod.cash.1')}</Text>
        <Text style={tw`mt-1 text-center text-white-1`}>{i18n('paymentMethod.cash.2')}</Text>
        <Text style={tw`mt-1 text-center text-white-1`}>{i18n('paymentMethod.cash.3')}</Text>
      </View>
      <Pressable onPress={acknowledge} style={tw`flex flex-row justify-between items-center mt-10`}>
        <View style={tw`w-5 h-5 flex items-center justify-center ml-4`}>
          {disclaimerAcknowledged ? (
            <Icon id="checkbox" style={tw`w-5 h-5`} color={tw`text-peach-1`.color as string} />
          ) : (
            <View style={tw`w-4 h-4 rounded-sm border-2 border-grey-2`} />
          )}
        </View>
        <Text style={tw`pl-7 flex-shrink text-white-1`}>{i18n('paymentMethod.cash.checkbox')}</Text>
      </Pressable>
    </View>
  )
}
