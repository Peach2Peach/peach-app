import { useRef } from 'react'
import { TextInput, View } from 'react-native'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import tw from '../../../../styles/tailwind'
import { PhoneInput, LabelInput, ReferenceInput, BeneficiaryInput } from '../../index'
import { CurrencySelection } from '../paymentForms/components'
import { useTemplate8Setup } from './hooks'

export const Template8 = (props: FormProps) => {
  let $phone = useRef<TextInput>(null).current
  let $beneficiary = useRef<TextInput>(null).current
  let $reference = useRef<TextInput>(null).current

  const { labelInputProps, phoneInputProps, beneficiaryInputProps, referenceInputProps, currencySelectionProps }
    = useTemplate8Setup(props)

  return (
    <View>
      <LabelInput {...labelInputProps} onSubmit={() => $phone?.focus()} />
      <View style={tw`mt-1`}>
        <PhoneInput {...phoneInputProps} onSubmit={() => $beneficiary?.focus()} reference={(el: any) => ($phone = el)} />
      </View>
      <View style={tw`mt-1`}>
        <BeneficiaryInput
          {...beneficiaryInputProps}
          onSubmit={() => $reference?.focus()}
          reference={(el: any) => ($beneficiary = el)}
        />
      </View>
      <ReferenceInput {...referenceInputProps} reference={(el: any) => ($reference = el)} />
      <CurrencySelection {...currencySelectionProps} />
    </View>
  )
}
