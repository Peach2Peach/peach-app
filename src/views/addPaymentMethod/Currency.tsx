import React, { ReactElement, useMemo } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { PeachScrollView, PrimaryButton, RadioButtons } from '../../components'
import { CURRENCIES } from '../../constants'
import { useHeaderSetup } from '../../hooks'
import i18n from '../../utils/i18n'
import { whiteGradient } from '../../utils/layout'
const { LinearGradient } = require('react-native-gradients')

type CurrencySelectProps = {
  currency?: Currency
  setCurrency: (c: Currency) => void
  back: () => void
  next: () => void
}

const stepValid = true

export default ({ currency = 'EUR', setCurrency, next }: CurrencySelectProps): ReactElement => {
  useHeaderSetup(useMemo(() => ({ title: i18n('paymentMethod.select') }), []))
  const currencies = CURRENCIES.map((c) => ({
    value: c,
    display: i18n(`currency.${c}`),
  }))
  return (
    <View style={tw`flex h-full`}>
      <PeachScrollView contentContainerStyle={tw`items-center justify-center flex-grow px-10 pb-10`}>
        <RadioButtons items={currencies} selectedValue={currency} onChange={setCurrency} />
      </PeachScrollView>
      <View style={tw`flex items-center w-full px-6 mt-4 bg-primary-background`}>
        <View style={tw`w-full h-8 -mt-8`}>
          <LinearGradient colorList={whiteGradient} angle={90} />
        </View>
        <PrimaryButton testID="navigation-next" disabled={!stepValid} onPress={next} narrow>
          {i18n('next')}
        </PrimaryButton>
      </View>
    </View>
  )
}
