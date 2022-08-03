import React, { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { Checkboxes, Headline } from '../../components'
import i18n from '../../utils/i18n'
import { whiteGradient } from '../../utils/layout'
import { getPaymentMethodInfo } from '../../utils/paymentMethod'
import { Navigation } from './components/Navigation'
const { LinearGradient } = require('react-native-gradients')

type CurrencySelectProps = {
  paymentMethod: PaymentMethod,
  selected: Currency[],
  setCurrencies: React.Dispatch<React.SetStateAction<Currency[]>>,
  back: () => void,
  next: () => void,
}

export default ({ paymentMethod, selected, setCurrencies, back, next }: CurrencySelectProps): ReactElement => {
  const [paymentMethodInfo] = useState(() => getPaymentMethodInfo(paymentMethod))
  const [stepValid, setStepValid] = useState(false)
  const [selectedCurrencies, setSelectedCurrencies] = useState(selected)
  const currencies = paymentMethodInfo.currencies.map(c => ({
    value: c,
    display: i18n(`currency.${c}`)
  }))

  useEffect(() => {
    setStepValid(selectedCurrencies.length > 0)
  }, [selectedCurrencies])

  return <View style={tw`flex h-full`}>
    <Headline>
      {i18n('currency.select.title')}
    </Headline>
    <View style={tw`h-full flex-shrink flex justify-center px-10`}>
      <Checkboxes items={currencies}
        selectedValues={selectedCurrencies}
        onChange={cs => setSelectedCurrencies(cs as Currency[])}
      />
    </View>
    <View style={tw`mt-4 px-6 pb-10 flex items-center w-full bg-white-1`}>
      <View style={tw`w-full h-8 -mt-8`}>
        <LinearGradient colorList={whiteGradient} angle={90} />
      </View>
      <Navigation back={back} next={next} stepValid={stepValid} />
    </View>
  </View>
}