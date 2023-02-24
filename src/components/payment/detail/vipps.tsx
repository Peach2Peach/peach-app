import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { PaymentTemplateProps } from '..'
import { Text } from '../..'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { CopyAble } from '../../ui'

const possibleFields = ['phone']
export const DetailVipps = ({ paymentData, copyable, style }: PaymentTemplateProps): ReactElement => (
  <>
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
    <View style={[tw`flex-row justify-between mt-2`]}>
      <Text style={tw`text-black-2`}>{i18n('contract.summary.reference')}</Text>
      <View style={[tw`flex-row items-center justify-end`, !paymentData.reference && tw`opacity-50`]}>
        <Text style={tw`subtitle-1`}>{paymentData.reference || i18n('none')}</Text>
        {copyable && <CopyAble value={paymentData.reference} disabled={!paymentData.reference} style={tw`ml-2`} />}
      </View>
    </View>
  </>
)
export default DetailVipps
