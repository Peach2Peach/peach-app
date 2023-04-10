import { useRef } from 'react'
import { TextInput } from 'react-native'
import { FormProps } from '../paymentForms/PaymentMethodForm'
import { EmailInput, LabelInput, ReferenceInput, BeneficiaryInput } from '../../index'
import { CurrencySelection } from '../paymentForms/components'
import { useTemplate4Setup } from './hooks'

export const Template4 = (props: FormProps) => {
  let $email = useRef<TextInput>(null).current
  let $reference = useRef<TextInput>(null).current
  let $beneficiary = useRef<TextInput>(null).current

  const {
    labelInputProps,
    emailInputProps,
    beneficiaryInputProps,
    referenceInputProps,
    currencySelectionProps,
    shouldShowCurrencySelection,
  } = useTemplate4Setup(props)

  return (
    <>
      <LabelInput {...labelInputProps} onSubmit={() => $email?.focus()} />
      <EmailInput {...emailInputProps} onSubmit={() => $beneficiary?.focus()} reference={(el: any) => ($email = el)} />
      <BeneficiaryInput
        {...beneficiaryInputProps}
        onSubmit={() => $reference?.focus()}
        reference={(el: any) => ($beneficiary = el)}
      />
      <ReferenceInput {...referenceInputProps} reference={(el: any) => ($reference = el)} />

      {shouldShowCurrencySelection && <CurrencySelection {...currencySelectionProps} />}
    </>
  )
}
