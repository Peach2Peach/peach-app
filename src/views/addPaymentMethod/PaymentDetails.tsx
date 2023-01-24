import React, { ReactElement, useContext, useMemo } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

import { HeaderConfig } from '../../components/header/store'
import { HelpIcon } from '../../components/icons'
import { DeleteIcon } from '../../components/icons/DeleteIcon'
import { PaymentMethodForm } from '../../components/inputs/paymentMethods/paymentForms'
import { useHeaderSetup, useNavigation, useRoute } from '../../hooks'
import { useShowHelp } from '../../hooks/useShowHelp'
import { addPaymentData } from '../../utils/account'
import { info } from '../../utils/log'
import { specialTemplates } from './specialTemplates'
import { useDeletePaymentMethod } from '../../components/payment/hooks/useDeletePaymentMethod'

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
  const deletePaymentMethod = useDeletePaymentMethod(data.id ?? '')

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

  const showHelp = useShowHelp('currencies')

  const headerIcons = () => {
    const icons: HeaderConfig['icons'] = []
    if (['revolut', 'wise', 'paypal'].includes(paymentMethod)) {
      icons[0] = { iconComponent: <HelpIcon />, onPress: showHelp }
    }
    if (data.id) {
      icons[1] = {
        iconComponent: <DeleteIcon />,
        onPress: () => {
          if (!data?.id) return
          deletePaymentMethod()
        },
      }
    }
    info('icons' + icons)
    return icons
  }

  useHeaderSetup(
    useMemo(
      () => ({
        title: data.id
          ? i18n('paymentMethod.edit.title', i18n(`paymentMethod.${paymentMethod}`))
          : i18n('paymentMethod.select.title', i18n(`paymentMethod.${paymentMethod}`)),
        icons: headerIcons(),
      }),
      [paymentMethod, showHelp],
    ),
  )

  return (
    <View style={[tw`flex h-full`, specialTemplates[paymentMethod]?.style]}>
      <View style={[!specialTemplates[paymentMethod] ? tw`px-6` : {}]}>
        <PaymentMethodForm back={goToOriginOnCancel} {...{ paymentMethod, onSubmit, currencies, data }} />
      </View>
    </View>
  )
}
