import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { PrimaryButton } from '../../components'
import { useHeaderSetup, useNavigation } from '../../hooks'
import i18n from '../../utils/i18n'
import { CurrencyTabs } from './CurrencyTabs'
import { useCallback, useState } from 'react'
import { CURRENCIES } from '../../constants'
import { getPaymentDataByType } from '../../utils/account'

export const SelectCurrency = () => {
  useHeaderSetup(i18n('paymentMethod.select'))
  const navigation = useNavigation()

  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(CURRENCIES[0])

  const goToPaymentMethodForm = useCallback(
    (data: Pick<PaymentData, 'currencies' | 'country'> & { paymentMethod: PaymentMethod }) => {
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
        origin: 'addPaymentMethod',
      })
    },
    [navigation],
  )

  const next = () => {
    if (selectedCurrency === 'USDT') {
      goToPaymentMethodForm({ paymentMethod: 'liquid', currencies: [selectedCurrency] })
    } else {
      // TODO: fix type
      navigation.navigate('addPaymentMethod', { selectedCurrency, origin: 'buy' })
    }
  }

  return (
    <View style={tw`h-full`}>
      <CurrencyTabs currency={selectedCurrency} setCurrency={setSelectedCurrency} />
      <PrimaryButton style={tw`self-center mt-2 mb-5`} onPress={next} narrow>
        {i18n('next')}
      </PrimaryButton>
    </View>
  )
}
