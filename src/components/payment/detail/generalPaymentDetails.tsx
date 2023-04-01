import { ReactElement } from 'react'
import { View } from 'react-native'
import { PaymentTemplateProps, possiblePaymentFields } from '..'
import { Text } from '../..'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { openAppLink } from '../../../utils/web'
import { CopyAble } from '../../ui'
import { InfoBlock } from './InfoBlock'

export const names: Record<string, string> = {
  beneficiary: 'contract.payment.to',
  iban: 'form.iban',
  bic: 'form.bic',
  accountNumber: 'form.account',
  reference: 'contract.summary.reference',
}

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
              key={`info-${field}`}
              style={tw`mt-[2px]`}
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
