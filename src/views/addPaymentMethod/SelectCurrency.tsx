import tw from '../../styles/tailwind'

import { useState } from 'react'
import { PrimaryButton, Screen } from '../../components'
import { CURRENCIES } from '../../constants'
import { useHeaderSetup, useNavigation, useRoute } from '../../hooks'
import i18n from '../../utils/i18n'
import { CurrencyTabs } from './CurrencyTabs'
import { usePaymentMethodLabel } from './hooks'

export const SelectCurrency = () => {
  useHeaderSetup(i18n('selectCurrency.title'))
  const navigation = useNavigation()
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0])

  const { origin } = useRoute<'selectCurrency'>().params

  const getPaymentMethodLabel = usePaymentMethodLabel()

  const goToLiquidForm = () => {
    const label = getPaymentMethodLabel('liquid')
    navigation.navigate('paymentMethodForm', {
      paymentData: { type: 'liquid', label, currencies: [selectedCurrency] },
      origin,
    })
  }

  const next = () => {
    if (selectedCurrency === 'USDT') {
      goToLiquidForm()
    } else {
      navigation.navigate('selectPaymentMethod', { selectedCurrency, origin })
    }
  }

  return (
    <Screen>
      <CurrencyTabs currency={selectedCurrency} setCurrency={setSelectedCurrency} />
      <PrimaryButton style={tw`self-center mt-2 mb-5`} onPress={next} narrow>
        {i18n('next')}
      </PrimaryButton>
    </Screen>
  )
}
