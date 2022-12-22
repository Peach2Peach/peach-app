import React, { ReactElement, useContext, useMemo } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import { PaymentMethodForm } from '../../components/inputs/paymentMethods/paymentForms'
import { addPaymentData } from '../../utils/account'
import { specialTemplates } from './specialTemplates'
import { useHeaderSetup, useNavigation, useRoute } from '../../hooks'
import { HelpIcon } from '../../components/icons'
import { OverlayContext } from '../../contexts/overlay'
import { NavigationContainerRefWithCurrent, useNavigationContainerRef } from '@react-navigation/native'
import { showHelp } from '../../overlays/showHelp'

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

  const [, updateOverlay] = useContext(OverlayContext)

  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('paymentMethod.select.title', i18n(`paymentMethod.${paymentMethod}`)),
        icons:
          paymentMethod === 'revolut' || paymentMethod === 'wise' || paymentMethod === 'paypal'
            ? [
              {
                iconComponent: <HelpIcon />,
                onPress: () => {
                  showHelp(updateOverlay, 'currencies', navigation)
                },
              },
            ]
            : [],
      }),
      [],
    ),
  )

  return (
    <View style={[tw`flex h-full`, specialTemplates[paymentMethod]?.style]}>
      <View style={[!specialTemplates[paymentMethod] ? tw`px-6` : {}]}>
        <PaymentMethodForm back={goToOriginOnCancel} {...{ paymentMethod, onSubmit, onDelete, currencies, data }} />
      </View>
    </View>
  )
}
