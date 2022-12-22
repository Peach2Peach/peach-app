import React, { ReactElement, useContext, useMemo, useState } from 'react'

import tw from '../../styles/tailwind'

import { PeachScrollView } from '../../components'
import i18n from '../../utils/i18n'
import PaymentDetails from '../../components/payment/PaymentDetails'
import AddPaymentMethodButton from '../../components/payment/AddPaymentMethodButton'
import { account } from '../../utils/account'
import { useHeaderSetup, useNavigation } from '../../hooks'
import { HelpIcon } from '../../components/icons'
import { View, Text } from 'react-native'
import { showHelp } from '../../overlays/showHelp'
import { OverlayContext } from '../../contexts/overlay'

export default (): ReactElement => {
  const navigation = useNavigation()
  const [, updateOverlay] = useContext(OverlayContext)
  const headerConfig = {
    title: i18n('form.paymentMethod'),
    icons: [
      {
        iconComponent: <HelpIcon />,
        onPress: () => {
          showHelp(updateOverlay, 'paymentMethods', navigation)
        },
      },
    ],
  }
  useHeaderSetup(useMemo(() => headerConfig, []))

  const [, setUpdate] = useState(0)
  const dummy = () => setUpdate(Math.random())

  return (
    <PeachScrollView style={tw`h-full w-full`} contentContainerStyle={tw`flex-1 px-6 pt-7 pb-10 justify-center`}>
      {account.paymentData.length === 0 ? (
        <Text style={tw`h6 text-black-3 text-center`}>{i18n('paymentMethod.empty')}</Text>
      ) : (
        <PaymentDetails editable={true} paymentData={account.paymentData} setMeansOfPayment={dummy} />
      )}
      <View style={tw`w-60 bg-black-5 h-0.3 m-5`} />
      <AddPaymentMethodButton origin={['paymentMethods']} />
    </PeachScrollView>
  )
}
