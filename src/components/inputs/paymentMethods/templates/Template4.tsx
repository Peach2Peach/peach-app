import { useRef } from 'react'
import { TextInput } from 'react-native'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { BeneficiaryInput, EmailInput, LabelInput, ReferenceInput } from '../../index'
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
      <EmailInput {...emailInputProps} onSubmit={() => $beneficiary?.focus()} reference={(el) => ($email = el)} />
      <BeneficiaryInput
        {...beneficiaryInputProps}
        onSubmit={() => $reference?.focus()}
        reference={(el) => ($beneficiary = el)}
      />
      <ReferenceInput {...referenceInputProps} reference={(el) => ($reference = el)} />

      {shouldShowCurrencySelection && <CurrencySelection {...currencySelectionProps} />}
    </>
  )
}
