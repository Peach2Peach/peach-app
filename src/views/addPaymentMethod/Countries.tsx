import { useEffect, useMemo, useState, Dispatch, SetStateAction } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { PrimaryButton, RadioButtons } from '../../components'
import { useHeaderSetup } from '../../hooks'
import i18n from '../../utils/i18n'
import { whiteGradient } from '../../utils/layout'
import { countrySupportsCurrency, getPaymentMethodInfo } from '../../utils/paymentMethod'
import { Country } from '../../utils/country/countryMap'
const { LinearGradient } = require('react-native-gradients')

type CountrySelectProps = {
  paymentMethod: PaymentMethod
  currency: Currency
  selected?: Country
  setCountry: Dispatch<SetStateAction<PaymentMethodCountry | undefined>>
  back: () => void
  next: () => void
}

export default ({ paymentMethod, currency, selected, setCountry, next }: CountrySelectProps) => {
  const [paymentMethodInfo] = useState(() => getPaymentMethodInfo(paymentMethod))
  const [stepValid, setStepValid] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(selected)
  const countries = paymentMethodInfo.countries!.filter(countrySupportsCurrency(currency)).map((c) => ({
    value: c,
    display: i18n(`country.${c}`),
  }))

  useEffect(() => {
    setStepValid(!!selectedCountry)
    if (selectedCountry) setCountry(selectedCountry)
  }, [selectedCountry])

  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('paymentMethod.giftCard.countrySelect.title'),
      }),
      [],
    ),
  )

  return (
    <View style={tw`flex h-full`}>
      <View style={tw`flex justify-center flex-shrink h-full px-10`}>
        <RadioButtons
          items={countries}
          selectedValue={selectedCountry}
          onChange={(cs) => setSelectedCountry(cs as PaymentMethodCountry)}
        />
      </View>
      <View style={tw`flex items-center w-full px-6 mt-4`}>
        <View style={tw`w-full h-8 -mt-8`}>
          <LinearGradient colorList={whiteGradient} angle={90} />
        </View>
        <View style={tw`items-center flex-grow`}>
          <PrimaryButton testID="navigation-next" disabled={!stepValid} onPress={next} narrow>
            {i18n('next')}
          </PrimaryButton>
        </View>
      </View>
    </View>
  )
}
