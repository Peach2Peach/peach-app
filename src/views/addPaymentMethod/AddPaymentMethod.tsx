import React, { ReactElement, useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import tw from '../../styles/tailwind'

import { CURRENCIES } from '../../constants'
import { StackNavigation } from '../../utils/navigation'
import Currency from './Currency'
import ExtraCurrencies from './ExtraCurrencies'
import PaymentMethod from './PaymentMethod'
import { getPaymentDataByType } from '../../utils/account'
import i18n from '../../utils/i18n'
import { getPaymentMethodInfo } from '../../utils/paymentMethod'

type Props = {
  navigation: StackNavigation,
}

const screens = [
  { id: 'currency' },
  { id: 'paymentMethod' },
  { id: 'extraCurrencies' }
]

export default ({ navigation }: Props): ReactElement => {
  const [page, setPage] = useState(0)
  const [currencies, setCurrencies] = useState<Currency[]>([CURRENCIES[0]])
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>()

  const { id } = screens[page]
  const scroll = useRef<ScrollView>(null)

  const next = () => {
    let paymentMethodInfo
    if (paymentMethod) {
      paymentMethodInfo = getPaymentMethodInfo(paymentMethod)
    }
    if (paymentMethod
      && (page >= screens.length - 1 || id === 'paymentMethod' && paymentMethodInfo?.currencies.length === 1)) {
      const existingPaymentMethodsOfType = getPaymentDataByType(paymentMethod).length + 1
      const label = i18n(`paymentMethod.${paymentMethod}`) + ' #' + existingPaymentMethodsOfType
      return navigation.push('paymentDetails', {
        paymentData: {
          type: paymentMethod,
          label,
          currencies,
        },
        origin: 'buyPreferences'
      })
    }
    setPage(page + 1)

    scroll.current?.scrollTo({ x: 0 })
    return undefined
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
    if (id === 'extraCurrencies') return <ExtraCurrencies selected={currencies}
      paymentMethod={paymentMethod!} setCurrencies={setCurrencies}
      back={back} next={next}
    />

    return <View />
  }

  return <View testID="view-buy" style={tw`h-full pt-7 pb-10`}>
    {getScreen()}
  </View>
}
