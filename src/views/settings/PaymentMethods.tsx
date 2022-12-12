import React, { ReactElement, useState } from 'react'

import tw from '../../styles/tailwind'

import { GoBackButton, PeachScrollView, Title } from '../../components'
import i18n from '../../utils/i18n'
import PaymentDetails from '../../components/payment/PaymentDetails'
import AddPaymentMethodButton from '../../components/payment/AddPaymentMethodButton'
import { account } from '../../utils/account'

export default (): ReactElement => {
  const [, setUpdate] = useState(0)
  const dummy = () => setUpdate(Math.random())
  return (
    <PeachScrollView style={tw`h-full`} contentContainerStyle={tw`px-6 pt-7 pb-10`}>
      <Title title={i18n('settings.title')} subtitle={i18n('settings.paymentMethods.subtitle')} />
      <PaymentDetails style={tw`mt-4`} editable={true} paymentData={account.paymentData} setMeansOfPayment={dummy} />
      <AddPaymentMethodButton origin={['paymentMethods']} style={tw`mt-4`} />

      <GoBackButton style={tw`self-center mt-16`} />
    </PeachScrollView>
  )
}
