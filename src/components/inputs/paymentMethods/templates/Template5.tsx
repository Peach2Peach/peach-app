import { useRef } from 'react'
import { TextInput } from 'react-native'
import { FormProps } from '../paymentForms/PaymentMethodForm'
import { SortCodeInput, BankNumberInput, LabelInput, ReferenceInput, BeneficiaryInput } from '../../index'
import { useTemplate5Setup } from './hooks'

export const Template5 = (props: FormProps) => {
  let $beneficiary = useRef<TextInput>(null).current
  let $ukBankAccount = useRef<TextInput>(null).current
  let $ukSortCode = useRef<TextInput>(null).current
  let $reference = useRef<TextInput>(null).current

  const { labelInputProps, beneficiaryInputProps, ukBankAccountInputProps, ukSortCodeInputProps, referenceInputProps }
    = useTemplate5Setup(props)

  return (
    <>
      <LabelInput {...labelInputProps} onSubmit={() => $beneficiary?.focus()} />
      <BeneficiaryInput
        {...beneficiaryInputProps}
        onSubmit={() => $ukBankAccount?.focus()}
        reference={(el: any) => ($beneficiary = el)}
      />
      <BankNumberInput
        {...ukBankAccountInputProps}
        onSubmit={() => $ukSortCode?.focus()}
        reference={(el: any) => ($ukBankAccount = el)}
      />
      <SortCodeInput
        {...ukSortCodeInputProps}
        onSubmit={() => $reference?.focus()}
        reference={(el: any) => ($ukSortCode = el)}
      />
      <ReferenceInput {...referenceInputProps} reference={(el: any) => ($reference = el)} />
    </>
  )
}
