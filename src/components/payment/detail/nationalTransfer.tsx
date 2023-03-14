import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { PaymentTemplateProps } from '..'
import { Text } from '../..'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { CopyAble } from '../../ui'

const possibleFields = ['beneficiary', 'accountNumber', 'iban', 'bic', 'reference']

const names: Record<string, string> = {
  'beneficiary': 'contract.payment.to',
  'iban': 'form.iban',
  'bic': 'form.bic',
  'accountNumber': 'form.account',
  'reference': 'contract.summary.reference',
}

const InfoBlock = ({ field, name, paymentData, copyable }:
  {field: string, name: string, paymentData: PaymentData, copyable?: boolean}) =>
  <View style={[tw`flex-row mt-[2px]`]}>
    <Text style={tw`text-black-2 w-25`}>{i18n(name)}</Text>
    <View key={'paymentDetails-' + field} style={tw`flex-1`}>
      <View style={tw`flex-row items-center`}>
        <Text style={tw`flex-wrap subtitle-1`}>{paymentData[field]}</Text>
        {copyable && <CopyAble value={paymentData[field]} style={tw`w-4 h-4 ml-2`} />}
      </View>
    </View>
  </View>

export const DetailNationalTransfer = ({ paymentData, copyable, style }: PaymentTemplateProps): ReactElement =>
  <View style={style}>
    {possibleFields
      .filter((field) => paymentData[field])
      .map((field) => possibleFields.includes('beneficiary')
          && <InfoBlock field={field} name={names[field]} copyable={copyable} paymentData={paymentData}/>)}
  </View>
export default DetailNationalTransfer
