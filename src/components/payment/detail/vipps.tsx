import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { PaymentTemplateProps } from '..'
import { Text } from '../..'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { CopyAble } from '../../ui'

const possibleFields = ['phone']
export const DetailVipps = ({ paymentData, copyable, style }: PaymentTemplateProps): ReactElement => (
  <View style={[tw`flex-row justify-between`, style]}>
    <Text style={tw`text-black-2`}>{i18n('contract.payment.to')}</Text>

    <View>
      {possibleFields
        .filter((field) => paymentData[field])
        .map((field, i) => (
          <View key={'paymentDetails-' + field} style={i > 0 && tw`mt-2`}>
            <View style={tw`flex-row items-center justify-end`}>
              <Text style={tw`subtitle-1`}>{paymentData[field]}</Text>
              {copyable && <CopyAble value={paymentData[field]} style={tw`ml-2`} />}
            </View>
          </View>
        ))}
    </View>
  </View>
)
export default DetailVipps
