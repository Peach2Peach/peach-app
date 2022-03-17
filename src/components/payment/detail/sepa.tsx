import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { PaymentTemplateProps } from '..'
import { Text } from '../..'

export const DetailSEPA = ({ paymentData }: PaymentTemplateProps): ReactElement => <View>
  <Text>{paymentData.beneficiary}</Text>
  <Text>{paymentData.iban}</Text>
</View>

export default DetailSEPA