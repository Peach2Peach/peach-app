import React, { ReactElement, useMemo, useState } from 'react'

import tw from '../../styles/tailwind'

import { PeachScrollView } from '../../components'
import i18n from '../../utils/i18n'
import PaymentDetails from '../../components/payment/PaymentDetails'
import AddPaymentMethodButton from '../../components/payment/AddPaymentMethodButton'
import { account } from '../../utils/account'
import { useHeaderSetup } from '../../hooks'
import { HelpIcon } from '../../components/icons'
import { View } from 'react-native'
import { useShowHelp } from '../../hooks/useShowHelp'

export default (): ReactElement => {
  const showHelp = useShowHelp('paymentMethods')
  const headerConfig = useMemo(
    () => ({
      title: i18n('form.paymentMethod.edit'),
    }),
    [showHelp],
  )
  useHeaderSetup(useMemo(() => headerConfig, [headerConfig]))

  const [, setUpdate] = useState(0)
  const dummy = () => setUpdate(Math.random())

  return (
    <PeachScrollView style={tw`h-full w-full`} contentContainerStyle={tw`flex-1 px-6 pt-7 pb-10 justify-center`}>
      <PaymentDetails paymentData={account.paymentData} setMeansOfPayment={dummy} editing={true} />
      <View style={tw`w-60 bg-black-5 h-0.3 m-5`} />
      <AddPaymentMethodButton origin={['paymentMethods', {}]} />
    </PeachScrollView>
  )
}
