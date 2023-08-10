import { useRef } from 'react'
import { TextInput, View } from 'react-native'
import { CVUInput } from '../..'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { BeneficiaryInput, LabelInput } from '../../index'
import { CurrencySelection } from '../paymentForms/components'
import { useTemplate15Setup } from './hooks'

export const Template15 = (props: FormProps) => {
  const {
    labelInputProps,
    beneficiaryInputProps,
    accountNumberInputProps,
    shouldShowCurrencySelection,
    currencySelectionProps,
  } = useTemplate15Setup(props)
  let $cbu = useRef<TextInput>(null).current

  return (
    <View>
      <LabelInput {...labelInputProps} />
      <BeneficiaryInput {...beneficiaryInputProps} onSubmit={() => $cbu?.focus()} />
      <CVUInput {...accountNumberInputProps} reference={(el: any) => ($cbu = el)} />

      {shouldShowCurrencySelection && <CurrencySelection {...currencySelectionProps} />}
    </View>
  )
}
