import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Headline } from '../../../components'
import { PaymentMethods } from '../../../components/inputs'
import tw from '../../../styles/tailwind'
import { account } from '../../../utils/account'
import i18n from '../../../utils/i18n'

type PaymentMethodSelectionProps = {
  currencies: Currency[],
  setPaymentData: (data: PaymentData[]) => void,
}
export default ({ setPaymentData, currencies }: PaymentMethodSelectionProps): ReactElement => <View>
  <Headline style={tw`mt-16 text-grey-1`}>
    {i18n('sell.paymentMethods')}
  </Headline>
  <PaymentMethods paymentData={account.paymentData}
    currencies={currencies}
    onChange={(updatedPaymentData: PaymentData[]) => setPaymentData(updatedPaymentData)}/>
</View>