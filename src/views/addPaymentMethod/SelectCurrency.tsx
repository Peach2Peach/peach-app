import tw from '../../styles/tailwind'

import { useState } from 'react'
import { PrimaryButton, Screen } from '../../components'
import { CURRENCIES } from '../../constants'
import { useHeaderSetup, useNavigation } from '../../hooks'
import { getPaymentDataByType } from '../../utils/account'
import i18n from '../../utils/i18n'
import { CurrencyTabs } from './CurrencyTabs'

export const SelectCurrency = () => {
  useHeaderSetup(i18n('selectCurrency.title'))
  const navigation = useNavigation()
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0])

  const goToLiquidForm = () => {
    const existingPaymentMethodsOfType = getPaymentDataByType('liquid').length
    let label = i18n('paymentMethod.liquid')
    if (existingPaymentMethodsOfType > 0) label += ` #${existingPaymentMethodsOfType + 1}`

    navigation.push('paymentMethodForm', {
      paymentData: { type: 'liquid', label, currencies: [selectedCurrency] },
      origin: 'paymentMethods',
    })
  }

  const next = () => {
    if (selectedCurrency === 'USDT') {
      goToLiquidForm()
    } else {
      navigation.navigate('selectPaymentMethod', { selectedCurrency })
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
