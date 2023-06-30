import { useEffect, useMemo, useState, Dispatch, SetStateAction } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { PeachScrollView, PrimaryButton, RadioButtons } from '../../components'
import { useHeaderSetup } from '../../hooks'
import i18n from '../../utils/i18n'
import { countrySupportsCurrency, getPaymentMethodInfo } from '../../utils/paymentMethod'
import { Country } from '../../utils/country/countryMap'

type Props = {
  paymentMethod: PaymentMethod
  currency: Currency
  selected?: Country
  setCountry: Dispatch<SetStateAction<PaymentMethodCountry | undefined>>
  back: () => void
  next: () => void
}

export const Countries = ({ paymentMethod, currency, selected, setCountry, next }: Props) => {
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

  useHeaderSetup({
    title: i18n('paymentMethod.giftCard.countrySelect.title'),
  })

  return (
    <View style={tw`h-full`}>
      <PeachScrollView contentStyle={[tw`h-full p-4`, tw.md`p-8`]} contentContainerStyle={tw`flex-grow`}>
        <RadioButtons
          style={tw`items-center justify-center flex-grow`}
          items={countries}
          selectedValue={selectedCountry}
          onChange={(cs) => setSelectedCountry(cs as PaymentMethodCountry)}
        />
      </PeachScrollView>
      <PrimaryButton style={tw`self-center mt-2 mb-5`} disabled={!stepValid} onPress={next} narrow>
        {i18n('next')}
      </PrimaryButton>
    </View>
  )
}
