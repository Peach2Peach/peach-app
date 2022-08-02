import React, { ReactElement, useCallback, useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import tw from '../../styles/tailwind'


import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { PeachScrollView } from '../../components'
import { whiteGradient } from '../../utils/layout'
import { StackNavigation } from '../../utils/navigation'
import { Navigation } from './components/Navigation'
import Currency from './Currency'
import PaymentMethod from './PaymentMethod'
import { CURRENCIES } from '../../constants'

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
  {
    id: 'currency',
    scrollable: false
  },
  {
    id: 'paymentMethod',
    scrollable: false
  },
  {
    id: 'paymentDetails',
    scrollable: false
  }
]

// eslint-disable-next-line max-lines-per-function
export default ({ route, navigation }: Props): ReactElement => {
  const [stepValid, setStepValid] = useState(false)
  const [page, setPage] = useState(0)
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0])
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>()

  const { id, scrollable } = screens[page]
  const scroll = useRef<ScrollView>(null)

  const getScreen = () => {
    if (id === 'currency') return <Currency currency={currency} setCurrency={setCurrency} setStepValid={setStepValid} />
    if (id === 'paymentMethod') return <PaymentMethod currency={currency}
      setPaymentMethod={setPaymentMethod}
      setStepValid={setStepValid} next={next}
    />
    // if (id === 'paymentDetails') return <Currency currency={currency} setCurrency={setCurrency} setStepValid={setStepValid} />

    return <View />
  }

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

  const restoreDefaults = () => {
    setPage(0)
    setCurrency(CURRENCIES[0])
  }

  useFocusEffect(useCallback(() => {
    restoreDefaults()
  }, [route]))

  return <View testID="view-buy" style={tw`h-full flex`}>
    <View style={tw`h-full flex-shrink`}>
      <PeachScrollView scrollRef={scroll}
        disable={!scrollable}
        contentContainerStyle={!scrollable ? tw`h-full` : tw`pb-10`}
        style={tw`pt-7 overflow-visible`}>
        <View style={tw`pb-8`}>
          {getScreen()}
        </View>
        {scrollable
          ? <View style={tw`mb-8 px-6`}>
            <Navigation back={back} next={next} stepValid={stepValid}/>
          </View>
          : null
        }
      </PeachScrollView>
    </View>
    {!scrollable
      ? <View style={tw`mt-4 px-6 pb-10 flex items-center w-full bg-white-1`}>
        <View style={tw`w-full h-8 -mt-8`}>
          <LinearGradient colorList={whiteGradient} angle={90} />
        </View>
        <Navigation back={back} next={next} stepValid={stepValid} />
      </View>
      : null
    }
  </View>
}
