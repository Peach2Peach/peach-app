import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import { RouteProp } from '@react-navigation/native'
import { Headline } from '../../components'
import { PaymentMethodForm } from '../../components/inputs/paymentMethods/paymentForms'
import { StackNavigation } from '../../utils/navigation'
import { addPaymentData } from '../../utils/account'
import Ljubljana from './ljubljana.svg'

type Props = {
  route: RouteProp<{ params: RootStackParamList['paymentDetails'] }>,
  navigation: StackNavigation,
}

const previousScreen: Record<keyof RootStackParamList, keyof RootStackParamList> = {
  'buyPreferences': 'buy',
  'sellPreferences': 'sell',
  'paymentMethods': 'settings',
}

export default ({ route, navigation }: Props): ReactElement => {
  const [paymentData, setPaymentData] = useState(route.params.paymentData)
  const { type: paymentMethod } = paymentData

  const goToOrigin = (origin: [keyof RootStackParamList, RootStackParamList[keyof RootStackParamList]]) => {
    navigation.reset({
      index: 2,
      routes: [
        { name: 'home' },
        { name: previousScreen[origin[0]] as string || 'home' },
        {
          name: origin[0] as string,
          params: origin[1],
        },
      ],
    })
  }

  const goToOriginOnCancel = () => goToOrigin(route.params.originOnCancel || route.params.origin)

  const onSubmit = (d: PaymentData) => {
    addPaymentData(d)
    goToOrigin(route.params.origin)
  }

  const onDelete = () => {
    goToOrigin(route.params.origin)
  }

  return <View style={paymentMethod === 'cash' ? tw`flex h-full pb-10 bg-[#12172B]` : tw`flex h-full pb-10 pt-7`}>
    {paymentMethod !== 'cash' && <Headline>
      {i18n(
        'paymentMethod.select.title',
        i18n(`paymentMethod.${paymentMethod}`)
      )}
    </Headline>}
    {paymentMethod === 'cash' && <Ljubljana style={tw`w-full`}/>}
    <View style={paymentMethod === 'cash'
      ? tw`h-full flex-shrink flex justify-center px-3`
      : tw`h-full flex-shrink flex justify-center mt-8 px-6`}>
      <PaymentMethodForm paymentMethod={paymentMethod}
        style={tw`h-full flex-shrink flex-col justify-between`}
        currencies={paymentData.currencies}
        data={paymentData}
        onSubmit={onSubmit}
        onDelete={onDelete}
        back={goToOriginOnCancel}
        navigation={navigation}
      />
    </View>
  </View>
}