import { useRef } from 'react'
import { TextInput } from 'react-native'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { BankNumberInput, BeneficiaryInput, LabelInput, ReferenceInput } from '../../index'
import { useTemplate7Setup } from './hooks'

export const Template7 = (props: FormProps) => {
  let $beneficiary = useRef<TextInput>(null).current
  let $reference = useRef<TextInput>(null).current

  const { labelInputProps, beneficiaryInputProps, accountNumberInputProps, referenceInputProps }
    = useTemplate7Setup(props)

  return (
    <>
      <LabelInput {...labelInputProps} onSubmit={() => $beneficiary?.focus()} />
      <BeneficiaryInput {...beneficiaryInputProps} reference={(el) => ($beneficiary = el)} />
      <BankNumberInput {...accountNumberInputProps} onSubmit={() => $reference?.focus()} />
      <ReferenceInput {...referenceInputProps} reference={(el) => ($reference = el)} />
    </>
  )
}
