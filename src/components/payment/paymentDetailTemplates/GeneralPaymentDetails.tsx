import { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { openAppLink } from '../../../utils/web'
import { PaymentTemplateProps } from '.'
import { paymentFields } from '../paymentFields'
import { InfoBlock } from './InfoBlock'
import { PaymentReference } from './PaymentReference'

const names: Record<string, string> = {
  beneficiary: 'contract.payment.to',
  iban: 'form.iban',
  bic: 'form.bic',
  accountNumber: 'form.account',
  reference: 'contract.summary.reference',
}

export const GeneralPaymentDetails = ({
  paymentMethod,
  paymentData,
  appLink,
  fallbackUrl,
  copyable,
  style,
}: PaymentTemplateProps): ReactElement => {
  const openApp = () => (fallbackUrl ? openAppLink(fallbackUrl, appLink) : {})

  const onInfoPress = () => {
    if (!appLink && !fallbackUrl) return
    openApp()
  }

  const possibleFields = paymentFields[paymentMethod]

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
      <PaymentReference style={tw`mt-[2px]`} reference={paymentData.reference} copyable={copyable} />
    </View>
  )
}
