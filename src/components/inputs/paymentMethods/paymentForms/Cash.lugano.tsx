import React, { ReactElement, useEffect, useImperativeHandle, useState } from 'react'
import { Dimensions, Image, Pressable, View } from 'react-native'
import { PaymentMethodFormProps } from '.'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import Icon from '../../../Icon'
import { Text } from '../../../text'

export const CashLugano = ({
  forwardRef,
  data,
  currencies = [],
  onSubmit,
  onChange,
}: PaymentMethodFormProps): ReactElement => {
  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = useState(data?.disclaimerAcknowledged || false)
  const [bannerWidth, setBannerWidth] = useState(0)
  const [bannerHeight, setBannerHeight] = useState(0)

  const buildPaymentData = (): PaymentData & CashData => ({
    id: data?.id || 'cash.lugano',
    label: 'Plan b forum',
    type: 'cash.lugano',
    disclaimerAcknowledged,
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

  useEffect(() => {
    const screenWidth = Dimensions.get('window').width
    const imageHeight = screenWidth * (210 / 375)
    setBannerWidth(screenWidth)
    setBannerHeight(imageHeight)
  }, [])

  return (
    <View style={tw`flex items-center pb-10`}>
      <Image
        source={require('./assets/cash.lugano.png')}
        resizeMode="contain"
        style={{ width: bannerWidth, height: bannerHeight }}
      />

      <View style={tw`mt-4 px-6`}>
        <Text style={tw`text-center text-white-1`}>
          {i18n('paymentMethod.cash.lugano.1')}
          {'\n\n'}
          {i18n('paymentMethod.cash.3')}
        </Text>
      </View>
      <Pressable onPress={acknowledge} style={tw`flex flex-row justify-between items-center mt-10 px-6`}>
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
