import tw from '../../styles/tailwind'

import { PeachScrollView, PrimaryButton, RadioButtons, Screen } from '../../components'
import { useHeaderSetup, useNavigation, useRoute } from '../../hooks'
import i18n from '../../utils/i18n'

import { useMemo, useState } from 'react'

import { countrySupportsCurrency, getPaymentMethodInfo } from '../../utils/paymentMethod'
import { usePaymentMethodLabel } from './hooks'

export const SelectCountry = () => {
  useHeaderSetup(i18n('paymentMethod.giftCard.countrySelect.title'))

  const { origin, selectedCurrency } = useRoute<'selectCountry'>().params
  const navigation = useNavigation()
  const [selectedCountry, setCountry] = useState<PaymentMethodCountry>()

  const countries = useMemo(
    () =>
      getPaymentMethodInfo('giftCard.amazon')
        ?.countries?.filter(countrySupportsCurrency(selectedCurrency))
        .map((c) => ({
          value: c,
          display: i18n(`country.${c}`),
        })),
    [selectedCurrency],
  )

  const getPaymentMethodLabel = usePaymentMethodLabel()

  const goToPaymentMethodForm = () => {
    if (!selectedCountry) return
    const methodType = `giftCard.amazon.${selectedCountry}` satisfies PaymentMethod
    const label = getPaymentMethodLabel(methodType)

    navigation.navigate('paymentMethodForm', {
      paymentData: { type: 'giftCard.amazon', label, currencies: [selectedCurrency], country: selectedCountry },
      origin,
    })
  }

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
      <PrimaryButton
        style={tw`self-center mt-2 mb-5`}
        disabled={!selectedCountry}
        onPress={goToPaymentMethodForm}
        narrow
      >
        {i18n('next')}
      </PrimaryButton>
    </Screen>
  )
}