import { useRef } from 'react'
import { TextInput } from 'react-native'
import { BICInput, BeneficiaryInput, IBANInput, LabelInput, ReferenceInput } from '../../index'
import { FormProps } from '../paymentForms/PaymentMethodForm'
import { CurrencySelection } from '../paymentForms/components'
import { useTemplate1Setup } from './hooks'

export const Template1 = (props: FormProps) => {
  const {
    labelInputProps,
    beneficiaryInputProps,
    ibanInputProps,
    bicInputProps,
    referenceInputProps,
    currencySelectionProps,
    shouldShowCurrencySelection,
  } = useTemplate1Setup(props)

  let $beneficiary = useRef<TextInput>(null).current
  let $iban = useRef<TextInput>(null).current
  let $bic = useRef<TextInput>(null).current
  let $reference = useRef<TextInput>(null).current

  return (
    <>
      <LabelInput {...labelInputProps} onSubmit={() => $beneficiary?.focus()} />
      <BeneficiaryInput
        {...beneficiaryInputProps}
        onSubmit={() => $iban?.focus()}
        reference={(el: any) => ($beneficiary = el)}
      />
      <IBANInput {...ibanInputProps} onSubmit={() => $bic?.focus()} reference={(el: any) => ($iban = el)} />
      <BICInput {...bicInputProps} onSubmit={() => $reference?.focus()} reference={(el: any) => ($bic = el)} />
      <ReferenceInput {...referenceInputProps} reference={(el: any) => ($reference = el)} />
      {shouldShowCurrencySelection && <CurrencySelection {...currencySelectionProps} />}
    </>
  )
}
