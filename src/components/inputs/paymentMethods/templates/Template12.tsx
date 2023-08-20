import { useRef } from 'react'
import { TextInput } from 'react-native'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { LabelInput, PhoneInput, ReferenceInput } from '../../index'
import { CurrencySelection } from '../paymentForms/components'
import { useTemplate12Setup } from './hooks'

export const Template12 = (props: FormProps) => {
  let $phone = useRef<TextInput>(null).current
  let $reference = useRef<TextInput>(null).current

  const { labelInputProps, phoneInputProps, referenceInputProps, currencySelectionProps, shouldShowCurrencySelection }
    = useTemplate12Setup(props)

  return (
    <>
      <LabelInput {...labelInputProps} onSubmit={() => $phone?.focus()} />
      <PhoneInput {...phoneInputProps} onSubmit={() => $reference?.focus()} reference={(el) => ($phone = el)} />
      <ReferenceInput {...referenceInputProps} reference={(el) => ($reference = el)} />

      {shouldShowCurrencySelection && <CurrencySelection {...currencySelectionProps} />}
    </>
  )
}
