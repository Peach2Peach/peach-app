import { useCallback, useState } from 'react'
import { View } from 'react-native'

import i18n from '../../utils/i18n'

import { CURRENCIES } from '../../constants'
import { useNavigation, useRoute } from '../../hooks'
import { getPaymentDataByType } from '../../utils/account'
import { countrySupportsCurrency, getPaymentMethodInfo, isAmazonGiftCard } from '../../utils/paymentMethod'
import { Countries } from './Countries'
import { SelectCurrency } from './Currency'
import { PaymentMethod } from './PaymentMethod'
import { useDrawerContext } from '../../contexts/drawer'

const screens = ['currency', 'paymentMethod', 'extraInfo']

export const AddPaymentMethod = () => {
  const { origin } = useRoute<'addPaymentMethod'>().params
  const navigation = useNavigation()
  const [page, setPage] = useState(0)
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(CURRENCIES[0])
  const [country, setCountry] = useState<PaymentMethodCountry>()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>()

  const [, updateDrawer] = useDrawerContext()

  const id = screens[page]

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
        origin,
      })
    },
    [navigation, origin],
  )

  const next = () => {
    setPage(page + 1)
  }

  const selectPaymentMethod = (method?: PaymentMethod) => {
    setPaymentMethod(method)
    updateDrawer({ show: false })
    if (!method) return

    if (isAmazonGiftCard(method)) {
      next()
      return
    }

    goToPaymentMethodForm({ paymentMethod: method, currencies: [selectedCurrency], country })
  }

  const countries
    = paymentMethod
    && getPaymentMethodInfo(paymentMethod)
      .countries?.filter(countrySupportsCurrency(selectedCurrency))
      .map((c) => ({
        value: c,
        display: i18n(`country.${c}`),
      }))

  const selectCurrency = () => {
    if (selectedCurrency === 'USDT') {
      goToPaymentMethodForm({ paymentMethod: 'liquid', currencies: [selectedCurrency], country })
    } else {
      next()
    }
  }

  return (
    <View>
      {id === 'currency' && (
        <SelectCurrency currency={selectedCurrency} setCurrency={setSelectedCurrency} next={selectCurrency} />
      )}
      {id === 'paymentMethod' && (
        <PaymentMethod currency={selectedCurrency} setPaymentMethod={selectPaymentMethod} next={next} />
      )}
      {id === 'extraInfo' && paymentMethod && /giftCard/u.test(paymentMethod) && (
        <Countries
          countries={countries}
          selectedCountry={country}
          setCountry={setCountry}
          next={() => goToPaymentMethodForm({ paymentMethod, currencies: [selectedCurrency], country })}
        />
      )}
    </View>
  )
}
