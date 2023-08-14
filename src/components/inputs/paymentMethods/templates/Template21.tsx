import { View } from 'react-native'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { BankNumberInput, LabelInput } from '../../index'
import { CurrencySelection } from '../paymentForms/components'
import { useTemplate21Setup } from './hooks/useTemplate21Setup'

export const Template21 = (props: FormProps) => {
  const { labelInputProps, accountNumberInputProps, shouldShowCurrencySelection, currencySelectionProps }
    = useTemplate21Setup(props)

  return (
    <View>
      <LabelInput {...labelInputProps} />
      <BankNumberInput {...accountNumberInputProps} />

      {shouldShowCurrencySelection && <CurrencySelection {...currencySelectionProps} />}
    </View>
  )
}
