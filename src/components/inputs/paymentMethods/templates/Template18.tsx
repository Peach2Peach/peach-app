import { useRef } from 'react'
import { TextInput } from 'react-native'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { LabelInput, ReferenceInput, UsernameInput } from '../../index'
import { CurrencySelection } from '../paymentForms/components'
import { useTemplate18Setup } from './hooks/useTemplate18Setup'

export const Template18 = (props: FormProps) => {
  let $username = useRef<TextInput>(null).current
  let $reference = useRef<TextInput>(null).current

  const {
    labelInputProps,
    chipperTagInputProps,
    referenceInputProps,
    currencySelectionProps,
    shouldShowCurrencySelection,
  } = useTemplate18Setup(props)
  return (
    <>
      <LabelInput {...labelInputProps} onSubmit={() => $username?.focus()} />
      <UsernameInput
        {...chipperTagInputProps}
        onSubmit={() => $reference?.focus()}
        reference={(el: any) => ($username = el)}
      />
      <ReferenceInput {...referenceInputProps} reference={(el: any) => ($reference = el)} />
      {shouldShowCurrencySelection && <CurrencySelection {...currencySelectionProps} />}
    </>
  )
}