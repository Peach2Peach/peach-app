import tw from '../../styles/tailwind'

import { PeachScrollView, PrimaryButton, RadioButtons, Screen } from '../../components'
import { useHeaderSetup, useNavigation, useRoute } from '../../hooks'
import i18n from '../../utils/i18n'

import { useCallback, useState } from 'react'

import { getPaymentDataByType } from '../../utils/account'
import { countrySupportsCurrency, getPaymentMethodInfo } from '../../utils/paymentMethod'

export const SelectCountry = () => {
  useHeaderSetup({ title: i18n('paymentMethod.giftCard.countrySelect.title') })

  // TODO: fix type
  const { origin, paymentMethod, selectedCurrency } = useRoute<'selectCountry'>().params
  const navigation = useNavigation()
  const [selectedCountry, setCountry] = useState<PaymentMethodCountry>()

  const next = useCallback(() => {
    const data: Pick<PaymentData, 'currencies' | 'country'> & { paymentMethod: PaymentMethod } = {
      paymentMethod,
      currencies: [selectedCurrency],
      country: selectedCountry,
    }
    if (!data.paymentMethod || !data.currencies) return
    const methodType
      = data.paymentMethod === 'giftCard.amazon' && data.country
        ? (`${data.paymentMethod}.${data.country}` satisfies PaymentMethod)
        : data.paymentMethod
    const existingPaymentMethodsOfType = getPaymentDataByType(methodType).length
    let label = i18n(`paymentMethod.${methodType}`)
    if (existingPaymentMethodsOfType > 0) label += ` #${existingPaymentMethodsOfType + 1}`

    navigation.push('paymentMethodForm', {
      paymentData: { type: data.paymentMethod, label, currencies: data.currencies, country: data.country },
      origin,
    })
  }, [navigation, origin, paymentMethod, selectedCountry, selectedCurrency])

  const countries
    = paymentMethod
    && getPaymentMethodInfo(paymentMethod)
      .countries?.filter(countrySupportsCurrency(selectedCurrency))
      .map((c) => ({
        value: c,
        display: i18n(`country.${c}`),
      }))

  return (
    <Screen>
      <PeachScrollView contentContainerStyle={[tw`justify-center flex-grow py-4`, tw.md`py-8`]}>
        {!!countries && (
          <RadioButtons
            style={tw`items-center`}
            items={countries}
            selectedValue={selectedCountry}
            onChange={setCountry}
          />
        )}
      </PeachScrollView>
      <PrimaryButton style={tw`self-center mt-2 mb-5`} disabled={!selectedCountry} onPress={next} narrow>
        {i18n('next')}
      </PrimaryButton>
    </Screen>
  )
}
