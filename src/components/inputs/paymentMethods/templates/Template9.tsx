import { useRef } from 'react'
import { TextInput } from 'react-native'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { TabbedNavigation } from '../../../navigation'
import { BankNumberInput, BICInput, IBANInput, LabelInput, ReferenceInput, BeneficiaryInput } from '../../index'
import { useTemplate9Setup } from './hooks'

export const Template9 = (props: FormProps) => {
  let $beneficiary = useRef<TextInput>(null).current
  let $bic = useRef<TextInput>(null).current
  let $reference = useRef<TextInput>(null).current

  const {
    labelInputProps,
    beneficiaryInputProps,
    tabbedNavigationProps,
    ibanInputProps,
    accountNumberInputProps,
    bicInputProps,
    referenceInputProps,
    shouldShowIbanInput,
  } = useTemplate9Setup(props)

  return (
    <>
      <LabelInput {...labelInputProps} onSubmit={() => $beneficiary?.focus()} />
      <BeneficiaryInput {...beneficiaryInputProps} reference={(el: any) => ($beneficiary = el)} />
      <TabbedNavigation {...tabbedNavigationProps} />
      {shouldShowIbanInput ? (
        <IBANInput {...ibanInputProps} onSubmit={() => $bic?.focus()} />
      ) : (
        <BankNumberInput {...accountNumberInputProps} onSubmit={() => $reference?.focus()} />
      )}
      {shouldShowIbanInput && (
        <BICInput {...bicInputProps} onSubmit={() => $reference?.focus()} reference={(el: any) => ($bic = el)} />
      )}
      <ReferenceInput {...referenceInputProps} reference={(el: any) => ($reference = el)} />
    </>
  )
}
