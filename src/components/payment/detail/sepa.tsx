import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { PaymentTemplateProps } from '..'
import { Text } from '../..'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { Headline } from '../../text'
import { CopyAble, HorizontalLine } from '../../ui'

export const DetailSEPA = ({ paymentData }: PaymentTemplateProps): ReactElement => <View>
  <View style={tw`z-10`}><CopyAble style={tw`absolute right-0 mt-2 ml-2`} value={paymentData.iban} /></View>
  <Headline style={tw`text-grey-2 normal-case mt-4`}>
    {i18n('contract.payment.to')}
  </Headline>
  <Text style={tw`text-center text-grey-2`}>{paymentData.iban}</Text>
  <HorizontalLine style={tw`mt-4`}/>
  <View style={tw`z-10`}><CopyAble style={tw`absolute right-0 mt-2 ml-2`} value={paymentData.beneficiary} /></View>
  <Headline style={tw`text-grey-2 normal-case mt-4`}>
    {i18n('form.beneficiary')}
  </Headline>
  <Text style={tw`text-center text-grey-2`}>{paymentData.beneficiary}</Text>
</View>
export default DetailSEPA