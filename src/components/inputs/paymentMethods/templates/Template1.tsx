import { useRef } from 'react'
import { TextInput } from 'react-native'
import { FormProps } from '../paymentForms/PaymentMethodForm'
import i18n from '../../../../utils/i18n'
import { BICInput, IBANInput, ReferenceInput, BeneficiaryInput, LabelInput } from '../../index'
import { Checkbox } from '../../Checkbox'
import { hasMultipleAvailableCurrencies } from './utils/hasMultipleAvailableCurrencies'
import { CurrencySelection } from '../paymentForms/components'
import { useTemplate1Setup } from './hooks/useTemplate1Setup'

export const Template1 = ({ data, currencies = [], onSubmit, setStepValid, paymentMethod, setFormData }: FormProps) => {
  const {
    labelInputProps,
    beneficiaryInputProps,
    ibanInputProps,
    bicInputProps,
    referenceInputProps,
    checkboxProps,
    currencySelectionProps,
    save,
  } = useTemplate1Setup({ data, paymentMethod, onSubmit, setStepValid, currencies, setFormData })

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
      <IBANInput
        {...ibanInputProps}
        onSubmit={() => $bic?.focus()}
        reference={(el: any) => ($iban = el)}
        label={i18n('form.iban')}
      />
      <BICInput {...bicInputProps} onSubmit={() => $reference?.focus()} reference={(el: any) => ($bic = el)} />
      <ReferenceInput {...referenceInputProps} onSubmit={save} reference={(el: any) => ($reference = el)} />
      {paymentMethod === 'instantSepa' && <Checkbox {...checkboxProps} text={i18n('form.instantSepa.checkbox')} />}
      {hasMultipleAvailableCurrencies(paymentMethod) && <CurrencySelection {...currencySelectionProps} />}
    </>
  )
}
