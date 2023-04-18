import { useRef } from 'react'
import { TextInput, View } from 'react-native'
import { FormProps } from '../paymentForms/PaymentMethodForm'
import tw from '../../../../styles/tailwind'
import { TabbedNavigation } from '../../../navigation/TabbedNavigation'
import { EmailInput, PhoneInput, UsernameInput, LabelInput, ReferenceInput } from '../../index'
import { CurrencySelection } from '../paymentForms/components'
import { useTemplate6Setup } from './hooks'

export const Template6 = (props: FormProps) => {
  let $reference = useRef<TextInput>(null).current

  const {
    labelInputProps,
    tabbedNavigationProps,
    phoneInputProps,
    emailInputProps,
    userNameInputProps,
    referenceInputProps,
    currencySelectionProps,
    shouldShowPhoneInput,
    shouldShowEmailInput,
    shouldShowUserNameInput,
  } = useTemplate6Setup(props)

  return (
    <View>
      <LabelInput {...labelInputProps} />
      <TabbedNavigation {...tabbedNavigationProps} />
      <View style={tw`mt-2`}>
        {shouldShowPhoneInput && <PhoneInput {...phoneInputProps} onSubmit={() => $reference?.focus()} />}
        {shouldShowEmailInput && <EmailInput {...emailInputProps} onSubmit={() => $reference?.focus()} />}
        {shouldShowUserNameInput && <UsernameInput {...userNameInputProps} onSubmit={() => $reference?.focus()} />}
      </View>

      <ReferenceInput {...referenceInputProps} reference={(el: any) => ($reference = el)} />
      <CurrencySelection {...currencySelectionProps} />
    </View>
  )
}
