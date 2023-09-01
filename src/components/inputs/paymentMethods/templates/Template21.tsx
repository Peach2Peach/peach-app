import { useRef } from 'react'
import { TextInput, View } from 'react-native'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { BankNumberInput, BeneficiaryInput, LabelInput, ReferenceInput } from '../../index'
import { CurrencySelection } from '../paymentForms/components'
import { useTemplate21Setup } from './hooks/useTemplate21Setup'

export const Template21 = (props: FormProps) => {
  const {
    labelInputProps,
    beneficiaryInputProps,
    accountNumberInputProps,
    referenceInputProps,
    shouldShowCurrencySelection,
    currencySelectionProps,
  } = useTemplate21Setup(props)
  let $beneficiary = useRef<TextInput>(null).current
  let $bankNumber = useRef<TextInput>(null).current
  let $reference = useRef<TextInput>(null).current

  return (
    <View>
      <LabelInput {...labelInputProps} onSubmit={() => $beneficiary?.focus()} />
      <BeneficiaryInput
        {...beneficiaryInputProps}
        onSubmit={() => $bankNumber?.focus()}
        reference={(el) => ($beneficiary = el)}
      />
      <BankNumberInput
        {...accountNumberInputProps}
        onSubmit={() => $reference?.focus()}
        reference={(el) => ($bankNumber = el)}
      />
      <ReferenceInput {...referenceInputProps} reference={(el) => ($reference = el)} />

      {shouldShowCurrencySelection && <CurrencySelection {...currencySelectionProps} />}
    </View>
  )
}
