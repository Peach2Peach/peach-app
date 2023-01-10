import React, { ReactElement, useEffect, useImperativeHandle, useState } from 'react'
import { Pressable, View } from 'react-native'
import { FormProps } from '.'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import Icon from '../../../Icon'
import { Text } from '../../../text'
import TitleSVG from './assets/cash.belgianEmbassy.svg'

export const CashBelgianEmbassy = ({
  forwardRef,
  data,
  currencies = [],
  onSubmit,
  setStepValid,
}: FormProps): ReactElement => {
  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = useState(data?.disclaimerAcknowledged || false)

  const buildPaymentData = (): PaymentData & CashData => ({
    id: data?.id || 'cash.belgianEmbassy',
    label: 'Cash (Antwerp)',
    type: 'cash.belgianEmbassy',
    disclaimerAcknowledged,
    currencies: data?.currencies || currencies,
  })

  const acknowledge = () => setDisclaimerAcknowledged(true)
  const isFormValid = () => disclaimerAcknowledged
  const save = () => {
    if (!isFormValid()) return

    onSubmit(buildPaymentData())
  }

  useImperativeHandle(forwardRef, () => ({
    save,
  }))

  useEffect(() => {
    setStepValid(isFormValid())
  }, [isFormValid, setStepValid])

  return (
    <View style={tw`flex items-center pb-10`}>
      <TitleSVG style={tw`mt-14 max-w-full`} />

      <View style={tw`mt-20`}>
        <Text style={tw`text-center text-grey-1`}>{i18n('paymentMethod.cash.belgianEmbassy.1')}</Text>
        <Text style={tw`mt-1 text-center text-grey-1`}>{i18n('paymentMethod.cash.2')}</Text>
        <Text style={tw`mt-1 text-center text-grey-1`}>{i18n('paymentMethod.cash.3')}</Text>
      </View>
      <Pressable onPress={acknowledge} style={tw`flex flex-row justify-between items-center mt-10`}>
        <View style={tw`w-5 h-5 flex items-center justify-center ml-4`}>
          {disclaimerAcknowledged ? (
            <Icon id="checkboxMark" style={tw`w-5 h-5`} color={tw`text-peach-1`.color} />
          ) : (
            <View style={tw`w-4 h-4 rounded-sm border-2 border-grey-2`} />
          )}
        </View>
        <Text style={tw`pl-7 flex-shrink text-grey-1`}>{i18n('paymentMethod.cash.checkbox')}</Text>
      </Pressable>
    </View>
  )
}
