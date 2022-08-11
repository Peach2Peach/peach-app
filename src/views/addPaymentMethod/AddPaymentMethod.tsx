import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { RouteProp, useFocusEffect } from '@react-navigation/native'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import { CURRENCIES, PAYMENTCATEGORIES } from '../../constants'
import { getPaymentDataByType } from '../../utils/account'
import { StackNavigation } from '../../utils/navigation'
import { getPaymentMethodInfo } from '../../utils/paymentMethod'
import Currency from './Currency'
import ExtraCurrencies from './ExtraCurrencies'
import PaymentMethod from './PaymentMethod'
import Countries from './Countries'

type Props = {
  route: RouteProp<{ params: RootStackParamList['addPaymentMethod'] }>,
  navigation: StackNavigation,
}

const screens = [
  { id: 'currency' },
  { id: 'paymentMethod' },
  { id: 'extraInfo' }
]
const getPage = ({ currencies, paymentMethod }: Props['route']['params']) => {
  if (paymentMethod) return 2
  if (currencies?.length === 1) return 1
  return 0
}

// eslint-disable-next-line max-lines-per-function
export default ({ route, navigation }: Props): ReactElement => {
  const [page, setPage] = useState(getPage(route.params))
  const [currencies, setCurrencies] = useState<Currency[]>(route.params.currencies || [CURRENCIES[0]])
  const [country, setCountry] = useState(route.params.country)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod|undefined>(route.params.paymentMethod)

  const { id } = screens[page]
  const scroll = useRef<ScrollView>(null)

  const goToPaymentDetails = () => {
    if (!paymentMethod) return
    const methodType = country
      ? `${paymentMethod}.${country}` as PaymentMethod
      : paymentMethod
    const existingPaymentMethodsOfType = getPaymentDataByType(methodType).length
    let label = i18n(`paymentMethod.${methodType}`)
    if (existingPaymentMethodsOfType > 0) label += ' #' + (existingPaymentMethodsOfType + 1)

    navigation.push('paymentDetails', {
      paymentData: { type: paymentMethod, label, currencies, country },
      origin: route.params.origin,
      originOnCancel: [
        'addPaymentMethod',
        {
          currencies,
          country,
          paymentMethod: !/twint|swish|sepa|mbWay|bizum/u.test(paymentMethod) ? paymentMethod : null,
          origin: route.params.origin,
        }
      ]
    })
  }

  const next = () => {
    if (page >= screens.length - 1) {
      goToPaymentDetails()
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
    if (id === 'currency') return <Currency
      currency={currencies[0]}
      setCurrency={c => setCurrencies([c] as Currency[])}
      back={back} next={next}
    />
    if (id === 'paymentMethod') return <PaymentMethod currency={currencies[0]}
      paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
      back={back} next={next}
    />
    if (id === 'extraInfo' && paymentMethod !== 'sepa') return /giftCard/u.test(paymentMethod as string)
      ? <Countries selected={country} currency={currencies[0]}
        paymentMethod={paymentMethod!} setCountry={setCountry}
        back={back} next={next}
      />
      : <ExtraCurrencies selected={currencies}
        paymentMethod={paymentMethod!} setCurrencies={setCurrencies}
        back={back} next={next}
      />
    return <View />
  }

  const initView = () => {
    setPage(getPage(route.params))
    setCurrencies(route.params.currencies || [CURRENCIES[0]])
    setPaymentMethod(route.params.paymentMethod)
  }

  useFocusEffect(useCallback(initView, [route]))

  useEffect(() => {
    if (!paymentMethod) return

    if (paymentMethod === 'sepa') goToPaymentDetails()

    const paymentMethodInfo = getPaymentMethodInfo(paymentMethod)
    if (paymentMethodInfo?.currencies.length !== 1
      || (PAYMENTCATEGORIES.localOption.indexOf(paymentMethod) !== -1 && screens[page].id !== 'extraInfo')) return

    goToPaymentDetails()
  }, [paymentMethod, page])

  return <View testID="view-buy" style={tw`h-full pt-7 pb-10`}>
    {getScreen()}
  </View>
}
