import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Headline } from '../../../components'
import { PaymentMethods } from '../../../components/inputs'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/accountUtils'
import i18n from '../../../utils/i18n'

type PaymentMethodSelectionProps = {
  setPaymentData: (data: PaymentData[]) => void
}
export default ({ setPaymentData }: PaymentMethodSelectionProps): ReactElement => <View>
  <Headline style={tw`mt-16`}>
    {i18n('sell.paymentMethods')}
  </Headline>
  <PaymentMethods paymentData={account.paymentData}
    onChange={(updatedPaymentData: PaymentData[]) => setPaymentData(updatedPaymentData)}/>
</View>