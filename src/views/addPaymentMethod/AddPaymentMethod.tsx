import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { RouteProp, useFocusEffect } from '@react-navigation/native'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import { CURRENCIES, PAYMENTCATEGORIES } from '../../constants'
import { getPaymentDataByType } from '../../utils/account'
import { StackNavigation } from '../../utils/navigation'
import { countrySupportsCurrency, getPaymentMethodInfo, isLocalOption } from '../../utils/paymentMethod'
import Currency from './Currency'
import PaymentMethod from './PaymentMethod'
import Countries from './Countries'

type Props = {
  route: RouteProp<{ params: RootStackParamList['addPaymentMethod'] }>
  navigation: StackNavigation
}

const screens = [{ id: 'currency' }, { id: 'paymentMethod' }, { id: 'extraInfo' }]
const getPage = ({ currencies, paymentMethod }: Props['route']['params']) => {
  if (paymentMethod) return 2
  if (currencies?.length === 1) return 1
  return 0
}

// eslint-disable-next-line max-lines-per-function
export default ({ route, navigation }: Props): ReactElement => {
  const [page, setPage] = useState(getPage(route.params))
  const [currencies, setCurrencies] = useState(route.params.currencies || [CURRENCIES[0]])
  const [country, setCountry] = useState(route.params.country)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>()

  const { id } = screens[page]
  const scroll = useRef<ScrollView>(null)

  const goToPaymentDetails = (data: Partial<PaymentData>) => {
    if (!data.paymentMethod || !data.currencies) return
    const methodType = data.country ? (`${data.paymentMethod}.${data.country}` as PaymentMethod) : data.paymentMethod
    const existingPaymentMethodsOfType: number = getPaymentDataByType(methodType).length
    let label = i18n(`paymentMethod.${methodType}`)
    if (existingPaymentMethodsOfType > 0) label += ' #' + (existingPaymentMethodsOfType + 1)

    navigation.push('paymentDetails', {
      paymentData: { type: data.paymentMethod, label, currencies: data.currencies, country: data.country },
      origin: route.params.origin,
      originOnCancel: [
        'addPaymentMethod',
        {
          currencies: data.currencies,
          country: null,
          paymentMethod: null,
          origin: route.params.origin,
        },
      ],
    })
  }

  const next = () => {
    if (page >= screens.length - 1) {
      goToPaymentDetails({ paymentMethod, currencies, country })
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
  const getScreen = () => {
    const commonProps = { ...{ currency: currencies[0], back, next } }
    return id === 'currency' ? (
      <Currency setCurrency={(c: Currency) => setCurrencies([c])} {...commonProps} />
    ) : id === 'paymentMethod' ? (
      <PaymentMethod {...{ paymentMethod, setPaymentMethod, ...commonProps }} />
    ) : id === 'extraInfo' && paymentMethod && /giftCard/u.test(paymentMethod) ? (
      <Countries selected={country} {...{ paymentMethod, setCountry, ...commonProps }} />
    ) : (
      <View />
    )
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
      goToPaymentDetails({ paymentMethod, currencies, country })
    } else if (paymentMethodInfo.countries) {
      const countries = paymentMethodInfo.countries.filter(countrySupportsCurrency(currencies[0]))
      if (countries.length === 1) {
        setCountry(countries[0])
        goToPaymentDetails({ paymentMethod, currencies, country: countries[0] })
        return
      }
    }

    if (
      paymentMethodInfo?.currencies.length !== 1
      || (PAYMENTCATEGORIES.localOption.indexOf(paymentMethod) !== -1 && screens[page].id !== 'extraInfo')
    ) return

    goToPaymentDetails({ paymentMethod, currencies, country })
  }, [paymentMethod, page])

  return (
    <View testID="view-buy" style={tw`h-full pt-7 pb-10`}>
      {getScreen()}
    </View>
  )
}
