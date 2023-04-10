import { useRef } from 'react'
import { TextInput } from 'react-native'
import { FormProps } from '../paymentForms/PaymentMethodForm'
import { PhoneInput, LabelInput, ReferenceInput, BeneficiaryInput } from '../../index'
import { CurrencySelection } from '../paymentForms/components'
import { useTemplate3Setup } from './hooks'

export const Template3 = (props: FormProps) => {
  let $phone = useRef<TextInput>(null).current
  let $beneficiary = useRef<TextInput>(null).current
  let $reference = useRef<TextInput>(null).current

  const {
    labelInputProps,
    phoneInputProps,
    beneficiaryInputProps,
    referenceInputProps,
    currencySelectionProps,
    shouldShowCurrencySelection,
  } = useTemplate3Setup(props)

  return (
    <>
      <LabelInput {...labelInputProps} onSubmit={() => $phone?.focus()} />
      <PhoneInput {...phoneInputProps} onSubmit={() => $beneficiary?.focus()} reference={(el: any) => ($phone = el)} />
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
