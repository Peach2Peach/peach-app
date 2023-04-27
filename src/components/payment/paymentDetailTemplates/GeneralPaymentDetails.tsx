import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { paymentFields } from '../paymentFields'
import { InfoBlock } from './InfoBlock'
import { PaymentReference } from './PaymentReference'

export type PaymentTemplateProps = ComponentProps &
  Pick<Contract, 'paymentMethod' | 'paymentData' | 'disputeActive'> & {
    copyable?: boolean
  }

const names: Record<string, string> = {
  beneficiary: 'contract.payment.to',
  iban: 'form.iban',
  bic: 'form.bic',
  accountNumber: 'form.account',
  reference: 'contract.summary.reference',
}

export const GeneralPaymentDetails = ({ paymentMethod, paymentData, style, ...props }: PaymentTemplateProps) => {
  const possibleFields = paymentFields[paymentMethod]

  return (
    <View style={[style, tw`gap-2 mt-1`]}>
      {!!possibleFields
        && possibleFields
          .filter((field) => !!paymentData?.[field])
          .map((field, i) => (
            <InfoBlock
              key={`info-${field}`}
              value={paymentData?.[field]}
              name={!paymentData?.beneficiary && i === 0 ? 'contract.payment.to' : names[field]}
              {...props}
            />
          ))}
      <PaymentReference reference={paymentData?.reference} {...props} />
    </View>
  )
}
