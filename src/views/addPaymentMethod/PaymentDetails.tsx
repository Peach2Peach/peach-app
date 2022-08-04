import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import { RouteProp } from '@react-navigation/native'
import { Headline } from '../../components'
import { PaymentMethodForm } from '../../components/inputs/paymentMethods/paymentForms'
import { StackNavigation } from '../../utils/navigation'
import { addPaymentData } from '../../utils/account'

type Props = {
  route: RouteProp<{ params: RootStackParamList['paymentDetails'] }>,
  navigation: StackNavigation,
}

export default ({ route, navigation }: Props): ReactElement => {
  const [paymentData, setPaymentData] = useState(route.params.paymentData)
  const { type: paymentMethod } = paymentData

  const confirm = (d: PaymentData) => {
    addPaymentData(d)
    navigation.replace(route.params.origin, {})
  }

  return <View style={tw`flex h-full pt-7 pb-10`}>
    <Headline>
      {i18n(
        'paymentMethod.select.title',
        i18n(`paymentMethod.${paymentMethod}`)
      )}
    </Headline>
    <View style={tw`h-full flex-shrink flex justify-center mt-8 px-6`}>
      <PaymentMethodForm paymentMethod={paymentMethod}
        style={tw`h-full flex-shrink flex-col justify-between`}
        currencies={paymentData.currencies}
        data={paymentData}
        view="new"
        onSubmit={confirm}
        navigation={navigation}
      />
    </View>
  </View>
}