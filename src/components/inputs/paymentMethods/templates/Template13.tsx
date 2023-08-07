import { View } from 'react-native'
import tw from '../../../../styles/tailwind'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { TabbedNavigation } from '../../../navigation/TabbedNavigation'
import { EmailInput, LabelInput, PhoneInput } from '../../index'
import { CurrencySelection } from '../paymentForms/components'
import { useTemplate6Setup } from './hooks'

export const Template13 = (props: FormProps) => {
  const {
    labelInputProps,
    tabbedNavigationProps,
    phoneInputProps,
    emailInputProps,
    shouldShowCurrencySelection,
    currencySelectionProps,
    shouldShowPhoneInput,
    shouldShowEmailInput,
  } = useTemplate6Setup(props)

  return (
    <View>
      <LabelInput {...labelInputProps} />
      <TabbedNavigation {...tabbedNavigationProps} />
      <View style={tw`mt-2`}>
        {shouldShowPhoneInput && <PhoneInput {...phoneInputProps} />}
        {shouldShowEmailInput && <EmailInput {...emailInputProps} />}
      </View>

      {shouldShowCurrencySelection && <CurrencySelection {...currencySelectionProps} />}
    </View>
  )
}
