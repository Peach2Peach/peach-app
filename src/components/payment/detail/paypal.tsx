import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { PaymentTemplateProps } from '..'
import { Text } from '../..'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { Headline } from '../../text'
import { CopyAble, HorizontalLine } from '../../ui'

const possibleFields = [
  'phone',
  'userName',
  'email',
]
export const DetailPaypal = ({ paymentData }: PaymentTemplateProps): ReactElement => <View>
  {possibleFields
    .filter(field => paymentData[field])
    .map((field, i) => <View key={field}>
      {i > 0 ? <HorizontalLine style={tw`mt-4`} /> : null}
      <View style={tw`z-10`}><CopyAble style={tw`absolute right-0 mt-2 ml-2`} value={paymentData[field]} /></View>
      <Headline style={tw`text-grey-2 normal-case mt-4`}>
        {i18n(i > 0 ? 'or' : 'contract.payment.to')}
      </Headline>
      <Text style={tw`text-center text-grey-2`}>{paymentData[field]}</Text>
    </View>)}
</View>
export default DetailPaypal