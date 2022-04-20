import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Checkboxes, Headline, Text } from '../../../components'
import { PAYMENTMETHODS } from '../../../constants'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { paymentMethodAllowedForCurrencies } from '../../../utils/validation'

type PaymentMethodSelectionProps = {
  paymentMethods: PaymentMethod[],
  currencies: Currency[],
  setPaymentMethods: (data: PaymentMethod[]) => void,
}
export default ({ paymentMethods, currencies, setPaymentMethods }: PaymentMethodSelectionProps): ReactElement => <View>
  <Headline style={tw`mt-16 text-grey-1`}>
    {i18n('buy.paymentMethods')}
  </Headline>
  <Checkboxes
    style={tw`px-7 mt-2`}
    items={PAYMENTMETHODS
      .filter(method => paymentMethodAllowedForCurrencies(method, currencies))
      .map(method => ({
        value: method,
        display: <Text style={tw`-mt-0.5`}>
          {i18n(`paymentMethod.${method}`)}
        </Text>
      }))}
    selectedValues={paymentMethods}
    onChange={(values) => setPaymentMethods(values as PaymentMethod[])}/>
</View>