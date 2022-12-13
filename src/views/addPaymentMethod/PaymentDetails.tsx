import React, { ReactElement } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import { RouteProp } from '@react-navigation/native'
import { Headline } from '../../components'
import { PaymentMethodForm } from '../../components/inputs/paymentMethods/paymentForms'
import { StackNavigation } from '../../utils/navigation'
import { specialTemplates } from './specialTemplates'
import { UserDataStore, useUserDataStore } from '../../store'
import shallow from 'zustand/shallow'

type Props = {
  route: RouteProp<{ params: RootStackParamList['paymentDetails'] }>
  navigation: StackNavigation
}

const previousScreen: Record<keyof RootStackParamList, keyof RootStackParamList> = {
  buyPreferences: 'buy',
  sellPreferences: 'sell',
  paymentMethods: 'settings',
}

const paymentDetailsSelector = (state: UserDataStore) => ({
  preferredPaymentMethods: state.settings.preferredPaymentMethods,
  setPaymentData: state.setPaymentData,
  setSettings: state.updateSettings,
})

export default ({ route, navigation }: Props): ReactElement => {
  const { preferredPaymentMethods, setPaymentData, setSettings } = useUserDataStore(paymentDetailsSelector, shallow)
  const { paymentData: data } = route.params
  const { type: paymentMethod, currencies } = data

  const goToOrigin = (origin: [keyof RootStackParamList, RootStackParamList[keyof RootStackParamList]]) => {
    navigation.reset({
      index: 2,
      routes: [
        { name: 'home' },
        { name: (previousScreen[origin[0]] as string) || 'home' },
        {
          name: origin[0] as string,
          params: origin[1],
        },
      ],
    })
  }

  const goToOriginOnCancel = () => goToOrigin(route.params.originOnCancel || route.params.origin)

  const onSubmit = (d: PaymentData) => {
    setPaymentData(d)
    setSettings({
      showBackupReminder: true,
    })
    if (!preferredPaymentMethods[d.type]) {
      setSettings({
        preferredPaymentMethods: {
          ...preferredPaymentMethods,
          [data.type]: data.id,
        },
      })
    }

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
          {...{ paymentMethod, onSubmit, onDelete, navigation, currencies, data }}
        />
      </View>
    </View>
  )
}
