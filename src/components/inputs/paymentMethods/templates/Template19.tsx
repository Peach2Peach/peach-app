import { useRef } from 'react'
import { TextInput } from 'react-native'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { LabelInput, UsernameInput } from '../../index'
import { CurrencySelection } from '../paymentForms/components'
import { useTemplate19Setup } from './hooks'

export const Template19 = (props: FormProps) => {
  let $username = useRef<TextInput>(null).current

  const { labelInputProps, userNameInputProps, currencySelectionProps, shouldShowCurrencySelection }
    = useTemplate19Setup(props)
  return (
    <>
      <LabelInput {...labelInputProps} onSubmit={() => $username?.focus()} />
      <UsernameInput {...userNameInputProps} reference={(el) => ($username = el)} />
      {shouldShowCurrencySelection && <CurrencySelection {...currencySelectionProps} />}
    </>
  )
}
