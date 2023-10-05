import tw from '../../styles/tailwind'

import { useState } from 'react'
import { Header, PrimaryButton, Screen } from '../../components'
import { useNavigation, useRoute } from '../../hooks'
import i18n from '../../utils/i18n'
import { CurrencyTabs } from './CurrencyTabs'
import { usePaymentMethodLabel } from './hooks'

export const SelectCurrency = () => {
  const navigation = useNavigation()
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('EUR')

  const { origin } = useRoute<'selectCurrency'>().params

  const getPaymentMethodLabel = usePaymentMethodLabel()

  const goToPaymentMethodForm = (type: PaymentMethod) => {
    const label = getPaymentMethodLabel(type)
    navigation.navigate('paymentMethodForm', {
      paymentData: { type, label, currencies: [selectedCurrency] },
      origin,
    })
  }

  const next = () => {
    if (selectedCurrency === 'USDT') return goToPaymentMethodForm('liquid')
    if (selectedCurrency === 'SAT') return goToPaymentMethodForm('lnurl')
    return navigation.navigate('selectPaymentMethod', { selectedCurrency, origin })
  }

  return (
    <Screen>
      <Header title={i18n('selectCurrency.title')} />
      <CurrencyTabs currency={selectedCurrency} setCurrency={setSelectedCurrency} />
      <PrimaryButton style={tw`self-center mt-2 mb-5`} onPress={next} narrow>
        {i18n('next')}
      </PrimaryButton>
    </Screen>
  )
}
