import { useRef } from 'react'
import { TextInput, View } from 'react-native'
import { CVUAliasInput } from '../..'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { BeneficiaryInput, LabelInput } from '../../index'
import { CurrencySelection } from '../paymentForms/components'
import { useTemplate16Setup } from './hooks'

export const Template16 = (props: FormProps) => {
  const {
    labelInputProps,
    beneficiaryInputProps,
    cvuAliasInputProps,
    shouldShowCurrencySelection,
    currencySelectionProps,
  } = useTemplate16Setup(props)
  let $cbu = useRef<TextInput>(null).current

  return (
    <View>
      <LabelInput {...labelInputProps} />
      <BeneficiaryInput {...beneficiaryInputProps} onSubmit={() => $cbu?.focus()} />
      <CVUAliasInput {...cvuAliasInputProps} reference={(el: any) => ($cbu = el)} />

      {shouldShowCurrencySelection && <CurrencySelection {...currencySelectionProps} />}
    </View>
  )
}
