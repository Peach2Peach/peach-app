import React, { ReactElement } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import { Headline } from '../../components'
import { PaymentMethodForm } from '../../components/inputs/paymentMethods/paymentForms'
import { addPaymentData } from '../../utils/account'
import { specialTemplates } from './specialTemplates'
import { useNavigation, useRoute } from '../../hooks'

const previousScreen: Partial<Record<keyof RootStackParamList, keyof RootStackParamList>> = {
  buyPreferences: 'buy',
  sellPreferences: 'sell',
  paymentMethods: 'settings',
}

export default (): ReactElement => {
  const route = useRoute<'paymentDetails'>()
  const navigation = useNavigation()
  const { paymentData: data, originOnCancel } = route.params
  const { type: paymentMethod, currencies } = data

  const goToOrigin = (origin: [keyof RootStackParamList, RootStackParamList[keyof RootStackParamList]]) => {
    navigation.reset({
      index: 2,
      routes: [
        { name: 'home' },
        { name: previousScreen[origin[0]] || 'home' },
        {
          name: origin[0],
          params: origin[1],
        },
      ],
    })
  }

  const goToOriginOnCancel = () => goToOrigin(originOnCancel || route.params.origin)

  const onSubmit = (d: PaymentData) => {
    addPaymentData(d)
    goToOrigin(route.params.origin)
  }

  const onDelete = () => {
    goToOrigin(route.params.origin)
  }

  return (
    <View
      style={
        specialTemplates[paymentMethod]
          ? [tw`flex h-full`, specialTemplates[paymentMethod]!.style]
          : tw`flex h-full mt-8`
      }
    >
      {!specialTemplates[paymentMethod] && (
        <Headline>{i18n('paymentMethod.select.title', i18n(`paymentMethod.${paymentMethod}`))}</Headline>
      )}
      <View style={[tw`h-full flex-shrink flex justify-center`, !specialTemplates[paymentMethod] ? tw`px-6` : {}]}>
        <PaymentMethodForm
          style={tw`h-full flex-shrink flex-col justify-between`}
          back={goToOriginOnCancel}
          {...{ paymentMethod, onSubmit, onDelete, currencies, data }}
        />
      </View>
    </View>
  )
}
