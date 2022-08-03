import React, { ReactElement, useCallback, useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import tw from '../../styles/tailwind'

import { useFocusEffect } from '@react-navigation/native'
import { CURRENCIES } from '../../constants'
import { StackNavigation } from '../../utils/navigation'
import Currency from './Currency'
import ExtraCurrencies from './ExtraCurrencies'
import PaymentMethod from './PaymentMethod'

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
    if (page >= screens.length - 1 && paymentMethod) return navigation.navigate('paymentDetails', {
      paymentMethod,
      currencies
    })
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
      setCurrency={(c) => setCurrencies([c])}
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

  const restoreDefaults = () => {
    setPage(0)
    setCurrencies([CURRENCIES[0]])
    setPaymentMethod(undefined)
  }

  useFocusEffect(useCallback(() => {
    restoreDefaults()
  }, []))

  return <View testID="view-buy" style={tw`h-full flex`}>
    <View style={tw`h-full flex-shrink pt-7 pb-8`}>
      {getScreen()}
    </View>
  </View>
}
