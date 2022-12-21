import React, { ReactElement, useContext, useMemo, useState } from 'react'

import tw from '../../styles/tailwind'

import { PeachScrollView } from '../../components'
import i18n from '../../utils/i18n'
import PaymentDetails from '../../components/payment/PaymentDetails'
import AddPaymentMethodButton from '../../components/payment/AddPaymentMethodButton'
import { account } from '../../utils/account'
import { useHeaderSetup } from '../../hooks'
import { HelpIcon } from '../../components/icons'
import { View, Text } from 'react-native'
import { showHelp } from '../../overlays/showHelp'
import { OverlayContext } from '../../contexts/overlay'

export default (): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const headerConfig = {
    title: i18n('form.paymentMethod'),
    icons: [
      {
        iconComponent: <HelpIcon />,
        onPress: () => {
          showHelp(updateOverlay, 'paymentMethods')
        },
      },
    ],
  }
  useHeaderSetup(useMemo(() => headerConfig, []))

  const [, setUpdate] = useState(0)
  const dummy = () => setUpdate(Math.random())

  return account.paymentData.length === 0 ? (
    <View style={tw`items-center justify-center m-10 flex-1`}>
      <Text style={tw`h6 text-black-3`}>{i18n('paymentMethod.empty')}</Text>
      <View style={tw`w-60 bg-black-5 h-0.3 m-5`} />
      <AddPaymentMethodButton origin={['paymentMethods']} />
    </View>
  ) : (
    <PeachScrollView style={tw`h-full`} contentContainerStyle={tw`px-6 pt-7 pb-10`}>
      <PaymentDetails editable={true} paymentData={account.paymentData} setMeansOfPayment={dummy} />
      <View style={tw`w-60 bg-black-5 h-0.3 m-5`} />
      <AddPaymentMethodButton origin={['paymentMethods']} />
    </PeachScrollView>
  )
}
