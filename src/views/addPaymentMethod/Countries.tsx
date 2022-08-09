import React, { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { Checkboxes, Headline, RadioButtons } from '../../components'
import i18n from '../../utils/i18n'
import { whiteGradient } from '../../utils/layout'
import { getPaymentMethodInfo } from '../../utils/paymentMethod'
import { Navigation } from './components/Navigation'
const { LinearGradient } = require('react-native-gradients')

type CountrySelectProps = {
  paymentMethod: PaymentMethod,
  selected?: Country,
  setCountry: React.Dispatch<React.SetStateAction<Country|undefined>>,
  back: () => void,
  next: () => void,
}

export default ({ paymentMethod, selected, setCountry, back, next }: CountrySelectProps): ReactElement => {
  const [paymentMethodInfo] = useState(() => getPaymentMethodInfo(paymentMethod))
  const [stepValid, setStepValid] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(selected)
  const countries = paymentMethodInfo.countries!.map(c => ({
    value: c,
    display: i18n(`country.${c}`)
  }))

  useEffect(() => {
    setStepValid(!!selectedCountry)
    if (selectedCountry) setCountry(selectedCountry)
  }, [selectedCountry])

  return <View style={tw`flex h-full`}>
    <Headline>
      {i18n('paymentMethod.giftCard.countrySelect.title',)}
    </Headline>
    <View style={tw`h-full flex-shrink flex justify-center px-10`}>
      <RadioButtons items={countries}
        selectedValue={selectedCountry}
        onChange={cs => setSelectedCountry(cs as Country)}
      />
    </View>
    <View style={tw`mt-4 px-6 flex items-center w-full bg-white-1`}>
      <View style={tw`w-full h-8 -mt-8`}>
        <LinearGradient colorList={whiteGradient} angle={90} />
      </View>
      <Navigation back={back} next={next} stepValid={stepValid} />
    </View>
  </View>
}