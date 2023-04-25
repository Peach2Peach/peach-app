import { ReactElement } from 'react'
import { View } from 'react-native'
import { PaymentTemplateProps, possiblePaymentFields } from '..'
import { Text } from '../..'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { openAppLink } from '../../../utils/web'
import { CopyAble } from '../../ui'

export const names: Record<string, string> = {
  beneficiary: 'contract.payment.to',
  iban: 'form.iban',
  bic: 'form.bic',
  accountNumber: 'form.account',
  reference: 'contract.summary.reference',
}

export const InfoBlock = ({
  value,
  name,
  copyable,
  onInfoPress,
}: {
  value: string
  name?: string
  copyable?: boolean
  onInfoPress?: () => void
}) => (
  <View style={[tw`flex-row mt-[2px]`]}>
    <View style={tw`w-25`}>{!!name && <Text style={tw`text-black-2`}>{i18n(name)}</Text>}</View>
    <View key={'paymentDetails-' + name} style={tw`flex-row items-center flex-1`}>
      <Text onPress={!!onInfoPress ? onInfoPress : undefined} style={tw`flex-wrap subtitle-1 leading-base`}>
        {value}
      </Text>
      {copyable && (
        <View style={tw`w-6 h-4 ml-2`}>
          <CopyAble value={value} />
        </View>
      )}
    </View>
  </View>
)

export const GeneralPaymentData = ({
  paymentMethod,
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

  const possibleFields = possiblePaymentFields[paymentMethod]

  return (
    <View style={style}>
      {!!possibleFields
        && possibleFields
          .filter((field) => !!paymentData[field])
          .map((field, i) => (
            <InfoBlock
              key={'info-' + field}
              value={paymentData[field]}
              copyable={copyable}
              name={!paymentData.beneficiary && i === 0 ? 'contract.payment.to' : names[field]}
              onInfoPress={onInfoPress}
            />
          ))}
      <View style={[tw`flex-row mt-[2px] items-center`]}>
        <Text style={tw`text-black-2 w-25`}>{i18n('contract.summary.reference')}</Text>
        <View style={[tw`flex-row items-center`, !paymentData.reference && tw`opacity-50`]}>
          <Text style={tw`subtitle-1 leading-base`}>{paymentData.reference || i18n('none')}</Text>
          {copyable && <CopyAble value={paymentData.reference} style={tw`ml-2`} />}
        </View>
      </View>
    </View>
  )
}
export default GeneralPaymentData
