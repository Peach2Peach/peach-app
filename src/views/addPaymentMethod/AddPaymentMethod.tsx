import React, { ReactElement, useCallback, useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import tw from '../../styles/tailwind'


import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { PeachScrollView } from '../../components'
import { CURRENCIES } from '../../constants'
import { StackNavigation } from '../../utils/navigation'
import Currency from './Currency'
import PaymentMethod from './PaymentMethod'

const { LinearGradient } = require('react-native-gradients')

type Props = {
  route: RouteProp<{ params: {
    offer?: BuyOffer,
    page?: number,
  } }>,
  navigation: StackNavigation,
}

type Screen = null | (({}) => ReactElement)

const screens = [
  { id: 'currency' },
  { id: 'paymentMethod' },
  { id: 'paymentDetails' }
]

export default ({ route, navigation }: Props): ReactElement => {
  const [page, setPage] = useState(0)
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0])
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>()

  const { id } = screens[page]
  const scroll = useRef<ScrollView>(null)

  const next = () => {
    if (page >= screens.length - 1) return
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
      currency={currency}
      setCurrency={setCurrency}
      back={back} next={next}
    />
    if (id === 'paymentMethod') return <PaymentMethod currency={currency}
      paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
      back={back} next={next}
    />
    // if (id === 'paymentDetails') return <Currency currency={currency} setCurrency={setCurrency} setStepValid={setStepValid} />

    return <View />
  }

  const restoreDefaults = () => {
    setPage(0)
    setCurrency(CURRENCIES[0])
    setPaymentMethod(undefined)
  }

  useFocusEffect(useCallback(() => {
    restoreDefaults()
  }, [route]))

  return <View testID="view-buy" style={tw`h-full flex`}>
    <View style={tw`h-full flex-shrink pt-7 pb-8`}>
      {getScreen()}
    </View>
  </View>
}
