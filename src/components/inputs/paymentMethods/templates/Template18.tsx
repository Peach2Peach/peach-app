import { useRef } from 'react'
import { TextInput } from 'react-native'
import i18n from '../../../../utils/i18n'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { LabelInput, ReferenceInput, UsernameInput } from '../../index'
import { CurrencySelection } from '../paymentForms/components'
import { useTemplate18Setup } from './hooks/useTemplate18Setup'

export const Template18 = (props: FormProps) => {
  let $username = useRef<TextInput>(null).current
  let $reference = useRef<TextInput>(null).current

  const {
    labelInputProps,
    userNameInputProps,
    referenceInputProps,
    currencySelectionProps,
    shouldShowCurrencySelection,
  } = useTemplate18Setup(props)
  return (
    <>
      <LabelInput {...labelInputProps} onSubmit={() => $username?.focus()} />
      <UsernameInput
        {...userNameInputProps}
        label={i18n('form.chippertag')}
        placeholder={i18n('form.chippertag.placeholder')}
        onSubmit={() => $reference?.focus()}
        reference={(el: any) => ($username = el)}
      />
      <ReferenceInput {...referenceInputProps} reference={(el: any) => ($reference = el)} />
      {shouldShowCurrencySelection && <CurrencySelection {...currencySelectionProps} />}
    </>
  )
}
