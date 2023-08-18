import { useRef } from 'react'
import { TextInput, View } from 'react-native'
import { CBUInput, ReferenceInput } from '../..'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { BeneficiaryInput, LabelInput } from '../../index'
import { CurrencySelection } from '../paymentForms/components'
import { useTemplate14Setup } from './hooks'

export const Template14 = (props: FormProps) => {
  const {
    labelInputProps,
    beneficiaryInputProps,
    accountNumberInputProps,
    referenceInputProps,
    shouldShowCurrencySelection,
    currencySelectionProps,
  } = useTemplate14Setup(props)
  let $cbu = useRef<TextInput>(null).current
  let $reference = useRef<TextInput>(null).current

  return (
    <View>
      <LabelInput {...labelInputProps} />
      <BeneficiaryInput {...beneficiaryInputProps} onSubmit={() => $cbu?.focus()} />
      <CBUInput {...accountNumberInputProps} onSubmit={() => $reference?.focus()} reference={(el: any) => ($cbu = el)} />
      <ReferenceInput {...referenceInputProps} reference={(el: any) => ($reference = el)} />

      {shouldShowCurrencySelection && <CurrencySelection {...currencySelectionProps} />}
    </View>
  )
}
