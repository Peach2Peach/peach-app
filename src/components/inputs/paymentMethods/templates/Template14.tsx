import { useRef } from 'react'
import { TextInput, View } from 'react-native'
import { CBUInput } from '../..'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { BeneficiaryInput, LabelInput } from '../../index'
import { CurrencySelection } from '../paymentForms/components'
import { useTemplate14Setup } from './hooks'

export const Template14 = (props: FormProps) => {
  const {
    labelInputProps,
    beneficiaryInputProps,
    accountNumberInputProps,
    shouldShowCurrencySelection,
    currencySelectionProps,
  } = useTemplate14Setup(props)
  let $cbu = useRef<TextInput>(null).current

  return (
    <View>
      <LabelInput {...labelInputProps} />
      <BeneficiaryInput {...beneficiaryInputProps} onSubmit={() => $cbu?.focus()} />
      <CBUInput {...accountNumberInputProps} reference={(el: any) => ($cbu = el)} />

      {shouldShowCurrencySelection && <CurrencySelection {...currencySelectionProps} />}
    </View>
  )
}
