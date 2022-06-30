import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Headline, Text, TextLink } from '../components'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'

type PaymentDataMissingProps = {
  openAddPaymentMethodDialog: () => void,
}

export const PaymentDataMissing = ({ openAddPaymentMethodDialog }: PaymentDataMissingProps): ReactElement => <View>
  <Headline style={tw`text-white-1 text-lg`}>{i18n('error.paymentDataMissing.title')}</Headline>
  <Text style={tw`text-white-1 text-center mt-1`}>
    {i18n('error.paymentDataMissing.text.1')}
  </Text>
  <View style={tw`flex-row items-center justify-center mt-1`}>
    <Text style={tw`text-white-1 text-center`}>
      {i18n('error.paymentDataMissing.text.2')}
    </Text>
    <TextLink style={tw`text-white-1 ml-1`}
      onPress={openAddPaymentMethodDialog}>
      {i18n('error.paymentDataMissing.text.3')}
    </TextLink>
  </View>
</View>