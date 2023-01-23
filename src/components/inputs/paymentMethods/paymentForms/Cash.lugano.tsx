import React, { ReactElement, useEffect, useImperativeHandle, useState } from 'react'
import { Dimensions, Image, Pressable, View } from 'react-native'
import { FormProps } from '.'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import Icon from '../../../Icon'
import { Text } from '../../../text'

export const CashLugano = ({ forwardRef, data, currencies = [], onSubmit, setStepValid }: FormProps): ReactElement => {
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

      <View style={tw`px-6 mt-4`}>
        <Text style={tw`text-center text-white-1`}>
          {i18n('paymentMethod.cash.lugano.1')}
          {'\n\n'}
          {i18n('paymentMethod.cash.3')}
        </Text>
      </View>
      <Pressable onPress={acknowledge} style={tw`flex flex-row items-center justify-between px-6 mt-10`}>
        <View style={tw`flex items-center justify-center w-5 h-5 ml-4`}>
          {disclaimerAcknowledged ? (
            <Icon id="checkboxMark" style={tw`w-5 h-5`} color={tw`text-peach-1`.color} />
          ) : (
            <View style={tw`w-4 h-4 border-2 rounded-sm border-grey-2`} />
          )}
        </View>
        <Text style={tw`flex-shrink pl-7 text-white-1`}>{i18n('paymentMethod.cash.checkbox')}</Text>
      </Pressable>
    </View>
  )
}
