import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { PaymentTemplateProps, possiblePaymentFields } from '..'
import { Text } from '../..'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { openAppLink } from '../../../utils/web'
import { CopyAble } from '../../ui'

export const names: Record<string, string> = {
  'beneficiary': 'contract.payment.to',
  'iban': 'form.iban',
  'bic': 'form.bic',
  'accountNumber': 'form.account',
  'reference': 'contract.summary.reference',
}

export const InfoBlock = ({ value, name, copyable, onInfoPress }:
  {value: string, name?: string, copyable?: boolean, onInfoPress?: () => void}) =>
  <View style={[tw`flex-row mt-[2px]`]}>
    {!!name && <Text style={tw`text-black-2 w-25`}>{i18n(name)}</Text>}
    <View key={'paymentDetails-' + name} style={tw`flex-1`}>
      <View style={tw`flex-row items-center`}>
        <Text onPress={!!onInfoPress ? onInfoPress : undefined} style={tw`flex-wrap subtitle-1`}>{value}</Text>
        {copyable && <CopyAble value={value} style={tw`w-4 h-4 ml-2`} />}
      </View>
    </View>
  </View>

export const GeneralPaymentData = ({
  paymentData,
  appLink,
  fallbackUrl,
  copyable,
  style,
}: PaymentTemplateProps): ReactElement => {
  const openApp = () => (fallbackUrl ? openAppLink(fallbackUrl, appLink) : {})

  const onInfoPress = () => {
    if (appLink || fallbackUrl) {
      openApp()
    }
  }

  const possibleFields = possiblePaymentFields[paymentData.type]

  return (
    <View style={style}>
      {!!possibleFields && possibleFields
        .filter((field) => paymentData[field])
        .map((field) => (
          <InfoBlock value={paymentData[field]} copyable={copyable} name={names[field]} onInfoPress={onInfoPress}/>
        ))}
      <View style={[tw`flex-row mt-[2px]`]}>
        <Text style={tw`text-black-2 w-25`}>{i18n('contract.summary.reference')}</Text>
        <View style={[tw`flex-row items-center`, !paymentData.reference && tw`opacity-50`]}>
          <Text style={tw`subtitle-1`}>{paymentData.reference || i18n('none')}</Text>
          {copyable && <CopyAble value={paymentData.reference} style={tw`ml-2`} />}
        </View>
      </View>
    </View>
  )
}
export default GeneralPaymentData
