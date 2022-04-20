import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { PaymentTemplateProps } from '..'
import { Text } from '../..'

export const DetailPaypal = ({ paymentData }: PaymentTemplateProps): ReactElement => <View>
  <Text>{paymentData.paypal}</Text>
</View>

export default DetailPaypal