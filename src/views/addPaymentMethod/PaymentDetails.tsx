import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import { RouteProp } from '@react-navigation/native'
import { Checkboxes, Headline, Icon, Text } from '../../components'
import { PaymentMethodForm } from '../../components/inputs/paymentMethods/paymentForms'
import { OverlayContext } from '../../contexts/overlay'
import Currency from '../../overlays/info/Currency'
import { whiteGradient } from '../../utils/layout'
import { StackNavigation } from '../../utils/navigation'
import { getPaymentMethodInfo } from '../../utils/paymentMethod'
import { Navigation } from './components/Navigation'

const { LinearGradient } = require('react-native-gradients')


type Props = {
  route: RouteProp<{ params: RootStackParamList['paymentDetails'] }>,
  navigation: StackNavigation,
}

// eslint-disable-next-line max-lines-per-function
export default ({ route, navigation }: Props): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const { paymentMethod, currencies } = route.params
  const [paymentMethodInfo] = useState(() => getPaymentMethodInfo(paymentMethod))
  const [currenciesSelected, setCurrenciesSelected] = useState(paymentMethodInfo.currencies.length === 1)
  const [paymentData, setPaymentData] = useState(route.params.paymentData || {
    type: paymentMethod,
    currencies
  })

  const [stepValid, setStepValid] = useState(true)

  const openCurrencyHelp = () => updateOverlay({
    content: <Currency view={'buyer'} />,
    help: true
  })

  const next = () => {
    if (!currenciesSelected) {
      setCurrenciesSelected(true)
      return
    }
    // get payment data and publish offer
    return
  }


  const confirm = (d: PaymentData) => {
    console.log(d)
  }
  useEffect(() => {
    setStepValid(currenciesSelected)
  }, [])

  return <View style={tw`flex h-full`}>
    <Headline>
      {i18n(
        currenciesSelected ? 'paymentMethod.select.title' : 'paymentMethod.currency.select.title',
        i18n(`paymentMethod.${paymentMethod}`)
      )}
    </Headline>
    {!currenciesSelected && <View style={tw`flex-row justify-center items-center`}>
      <Text style={tw`text-center text-grey-2`}>
        {i18n(
          'paymentMethod.currency.select.subtitle',
          i18n(`paymentMethod.${paymentMethod}`)
        )}
      </Text>
      <Pressable style={tw`w-0 ml-1 mt-0.5`} onPress={openCurrencyHelp}>
        <View style={tw`w-8 h-8 flex items-center justify-center`}>
          <Icon id="help" style={tw`w-5 h-5`} color={tw`text-blue-1`.color as string} />
        </View>
      </Pressable>
    </View>}
    <View style={tw`h-full flex-shrink flex justify-center px-10`}>
      <PaymentMethodForm paymentMethod={paymentMethod}
        style={tw`h-full flex-shrink flex-col justify-between`}
        data={paymentData}
        view="new"
        onSubmit={confirm}
        navigation={navigation}
      />
    </View>
  </View>
}