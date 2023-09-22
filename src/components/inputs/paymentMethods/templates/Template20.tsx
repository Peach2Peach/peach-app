import { useRef } from 'react'
import { TextInput } from 'react-native'
import i18n from '../../../../utils/i18n'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { Input, InputProps } from '../../Input'
import { BeneficiaryInput, LabelInput } from '../../index'
import { CurrencySelection } from '../paymentForms/components'
import { useTemplate20Setup } from './hooks'

export const Template20 = (props: FormProps) => {
  const {
    labelInputProps,
    beneficiaryInputProps,
    postePayNumberInputProps,
    currencySelectionProps,
    shouldShowCurrencySelection,
  } = useTemplate20Setup(props)

  let $beneficiary = useRef<TextInput>(null).current
  let $postePayNumber = useRef<TextInput>(null).current

  return (
    <>
      <LabelInput {...labelInputProps} onSubmit={() => $beneficiary?.focus()} />
      <BeneficiaryInput
        {...beneficiaryInputProps}
        onSubmit={() => $postePayNumber?.focus()}
        reference={(el) => ($beneficiary = el)}
      />
      <PostePayNumberInput {...postePayNumberInputProps} reference={(el) => ($postePayNumber = el)} />
      {shouldShowCurrencySelection && <CurrencySelection {...currencySelectionProps} />}
    </>
  )
}

function PostePayNumberInput (props: InputProps) {
  return (
    <Input
      label={i18n('form.postePayNumber')}
      placeholder={i18n('form.postePayNumber.placeholder')}
      autoCorrect={false}
      {...props}
    />
  )
}
