import React, { ReactElement, useMemo, useState } from 'react'

import tw from '../../styles/tailwind'

import { View } from 'react-native'
import { PeachScrollView } from '../../components'
import AddPaymentMethodButton from '../../components/payment/AddPaymentMethodButton'
import PaymentDetails from '../../components/payment/PaymentDetails'
import { useHeaderSetup } from '../../hooks'
import { useShowHelp } from '../../hooks/useShowHelp'
import { account } from '../../utils/account'
import i18n from '../../utils/i18n'

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
    <PeachScrollView style={tw`w-full h-full`} contentContainerStyle={tw`justify-center flex-grow px-6 pb-10 pt-7`}>
      <PaymentDetails paymentData={account.paymentData} setMeansOfPayment={dummy} editing={true}/>
      <View style={tw`bg-black-5 h-0.3 m-5`} />
      <AddPaymentMethodButton origin={['paymentMethods', {}]} />
    </PeachScrollView>
  )
}
