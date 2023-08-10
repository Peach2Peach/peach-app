import { useRef } from 'react'
import { TextInput } from 'react-native'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { LabelInput, PhoneInput } from '../../index'
import { CurrencySelection } from '../paymentForms/components'
import { useTemplate3Setup } from './hooks'

export const Template12 = (props: FormProps) => {
  let $phone = useRef<TextInput>(null).current

  const { labelInputProps, phoneInputProps, currencySelectionProps, shouldShowCurrencySelection }
    = useTemplate3Setup(props)

  return (
    <>
      <LabelInput {...labelInputProps} onSubmit={() => $phone?.focus()} />
      <PhoneInput {...phoneInputProps} reference={(el: any) => ($phone = el)} />
      {shouldShowCurrencySelection && <CurrencySelection {...currencySelectionProps} />}
    </>
  )
}
