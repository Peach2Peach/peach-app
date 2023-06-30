import { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'

import i18n from '../../utils/i18n'

import { CURRENCIES, PAYMENTCATEGORIES } from '../../constants'
import { getPaymentDataByType } from '../../utils/account'
import { countrySupportsCurrency, getPaymentMethodInfo, isLocalOption } from '../../utils/paymentMethod'
import { Currency } from './Currency'
import { PaymentMethod } from './PaymentMethod'
import { Countries } from './Countries'
import { useNavigation, useRoute } from '../../hooks'

const screens = [{ id: 'currency' }, { id: 'paymentMethod' }, { id: 'extraInfo' }]
const getPage = ({ currencies, paymentMethod }: RootStackParamList['addPaymentMethod']) => {
  if (paymentMethod) return 2
  if (currencies?.length === 1) return 1
  return 0
}

export default () => {
  const route = useRoute<'addPaymentMethod'>()
  const navigation = useNavigation()
  const [page, setPage] = useState(getPage(route.params))
  const [currencies, setCurrencies] = useState<Currency[]>(route.params.currencies || [CURRENCIES[0]])
  const [country, setCountry] = useState(route.params.country)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | undefined>(route.params.paymentMethod)

  const { id } = screens[page]
  const scroll = useRef<ScrollView>(null)

  const goToPaymentMethodDetails = useCallback(
    (data: Partial<PaymentData>) => {
      if (!data.paymentMethod || !data.currencies) return
      const methodType = data.country ? (`${data.paymentMethod}.${data.country}` as PaymentMethod) : data.paymentMethod
      const existingPaymentMethodsOfType: number = getPaymentDataByType(methodType).length
      let label = i18n(`paymentMethod.${methodType}`)
      if (existingPaymentMethodsOfType > 0) label += ` #${existingPaymentMethodsOfType + 1}`

      navigation.push('paymentMethodDetails', {
        paymentData: { type: data.paymentMethod, label, currencies: data.currencies, country: data.country },
        origin: route.params.origin,
      })
    },
    [navigation, route.params.origin],
  )

  const next = () => {
    if (page >= screens.length - 1) {
      goToPaymentMethodDetails({ paymentMethod, currencies, country })
      return
    }
    setPage(page + 1)

    scroll.current?.scrollTo({ x: 0 })
  }

  const back = () => {
    if (page === 0) {
      navigation.goBack()
      return
    }
    setPage(page - 1)
    scroll.current?.scrollTo({ x: 0 })
  }
  const initView = () => {
    setPage(getPage(route.params))
    setCurrencies(route.params.currencies || [CURRENCIES[0]])
    setPaymentMethod(route.params.paymentMethod)
  }

  useFocusEffect(useCallback(initView, [route]))

  useEffect(() => {
    if (!paymentMethod) return

    const paymentMethodInfo = getPaymentMethodInfo(paymentMethod)

    if (!/giftCard/u.test(paymentMethod as string) && !isLocalOption(paymentMethod)) {
      goToPaymentMethodDetails({ paymentMethod, currencies, country })
      return
    } else if (!!paymentMethodInfo.countries) {
      const countries = paymentMethodInfo.countries.filter(countrySupportsCurrency(currencies[0]))
      if (countries.length === 1) {
        setCountry(countries[0])
        goToPaymentMethodDetails({ paymentMethod, currencies, country: countries[0] })
        return
      }
    }

    if (
      (paymentMethodInfo?.currencies.length !== 1 && paymentMethod.includes('giftCard.amazon'))
      || (PAYMENTCATEGORIES.localOption.includes(paymentMethod) && screens[page].id !== 'extraInfo')
    ) return

    goToPaymentMethodDetails({ paymentMethod, currencies, country })
  }, [paymentMethod, page, goToPaymentMethodDetails, currencies, country])

  const commonProps = { ...{ currency: currencies[0], back, next } }
  return (
    <View>
      {id === 'currency' ? (
        <Currency setCurrency={(c: Currency) => setCurrencies([c])} {...commonProps} />
      ) : id === 'paymentMethod' ? (
        <PaymentMethod {...{ paymentMethod, setPaymentMethod, ...commonProps }} />
      ) : (
        id === 'extraInfo'
        && paymentMethod
        && /giftCard/u.test(paymentMethod) && (
          <Countries selected={country} {...{ paymentMethod, setCountry, ...commonProps }} />
        )
      )}
    </View>
  )
}
