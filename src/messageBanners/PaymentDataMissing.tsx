import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Headline, Text, TextLink } from '../components'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'

type PaymentDataMissingProps = {
  openAddPaymentMethodDialog: () => void
}

export const PaymentDataMissing = ({ openAddPaymentMethodDialog }: PaymentDataMissingProps): ReactElement => (
  <View>
    <Headline style={tw`text-lg text-primary-background-light`}>{i18n('error.paymentDataMissing.title')}</Headline>
    <Text style={tw`mt-1 text-center text-primary-background-light`}>{i18n('error.paymentDataMissing.text.1')}</Text>
    <View style={tw`flex-row items-center justify-center mt-1`}>
      <Text style={tw`text-center text-primary-background-light`}>{i18n('error.paymentDataMissing.text.2')}</Text>
      <TextLink style={tw`ml-1 text-primary-background-light`} onPress={openAddPaymentMethodDialog}>
        {i18n('error.paymentDataMissing.text.3')}
      </TextLink>
    </View>
  </View>
)
