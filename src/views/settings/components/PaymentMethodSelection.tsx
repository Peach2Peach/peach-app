import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { PaymentMethods } from '../../../components/inputs'
import { account } from '../../../utils/account'

type PaymentMethodSelectionProps = {
  currencies: Currency[],
  setPaymentData: (data: PaymentData[]) => void,
  showCheckBoxes?: boolean
}
export default ({
  setPaymentData,
  currencies,
  showCheckBoxes = true
}: PaymentMethodSelectionProps): ReactElement => <View>
  <PaymentMethods paymentData={account.paymentData}
    currencies={currencies}
    showCheckBoxes={showCheckBoxes}
    onChange={(updatedPaymentData: PaymentData[]) => setPaymentData(updatedPaymentData)}/>
</View>