import { useRef } from 'react'
import { TextInput, View } from 'react-native'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { BankNumberInput, BeneficiaryInput, LabelInput } from '../../index'
import { CurrencySelection } from '../paymentForms/components'
import { useTemplate17Setup } from './hooks/useTemplate17Setup'

export const Template17 = (props: FormProps) => {
  const {
    labelInputProps,
    beneficiaryInputProps,
    accountNumberInputProps,
    shouldShowCurrencySelection,
    currencySelectionProps,
  } = useTemplate17Setup(props)
  let $accountNumber = useRef<TextInput>(null).current

  return (
    <View>
      <LabelInput {...labelInputProps} />
      <BeneficiaryInput {...beneficiaryInputProps} onSubmit={() => $accountNumber?.focus()} />
      <BankNumberInput {...accountNumberInputProps} reference={(el: any) => ($accountNumber = el)} />

      {shouldShowCurrencySelection && <CurrencySelection {...currencySelectionProps} />}
    </View>
  )
}
