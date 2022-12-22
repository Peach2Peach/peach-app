import React, { ReactElement, useMemo } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { Headline, PrimaryButton, RadioButtons } from '../../components'
import { CURRENCIES } from '../../constants'
import i18n from '../../utils/i18n'
import { Navigation } from './components/Navigation'
import { whiteGradient } from '../../utils/layout'
import { useHeaderSetup } from '../../hooks'
const { LinearGradient } = require('react-native-gradients')

type CurrencySelectProps = {
  currency?: Currency
  setCurrency: (c: Currency) => void
  back: () => void
  next: () => void
}

const stepValid = true
const currencies = CURRENCIES.map((c) => ({
  value: c,
  display: i18n(`currency.${c}`),
}))
export default ({ currency = 'EUR', setCurrency, back, next }: CurrencySelectProps): ReactElement => {
  useHeaderSetup(useMemo(() => ({ title: i18n('paymentMethod.select') }), []))
  return (
    <View style={tw`flex h-full`}>
      <View style={tw`h-full flex-shrink flex justify-center px-10`}>
        <RadioButtons items={currencies} selectedValue={currency} onChange={setCurrency} />
      </View>
      <View style={tw`mt-4 px-6 flex items-center w-full bg-white-1`}>
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
