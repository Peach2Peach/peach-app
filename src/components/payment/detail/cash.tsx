import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { PaymentTemplateProps } from '..'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { Text } from '../../text'

export const CashDetails = ({ style }: PaymentTemplateProps): ReactElement => (
  <View style={[tw`flex-row justify-between`, style]}>
    <Text style={tw`text-black-2`}>{i18n('contract.payment.to')}</Text>
    <Text style={tw`subtitle-1`}>{i18n('contract.summary.location')}</Text>
  </View>
)

export default CashDetails
