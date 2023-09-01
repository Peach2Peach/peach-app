import { useRef } from 'react'
import { TextInput, View } from 'react-native'
import tw from '../../../../styles/tailwind'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { TabbedNavigation } from '../../../navigation/TabbedNavigation'
import { EmailInput, LabelInput, ReferenceInput, WalletInput } from '../../index'
import { CurrencySelection } from '../paymentForms/components'
import { useTemplate2Setup } from './hooks'

export const Template2 = (props: FormProps) => {
  const {
    labelInputProps,
    tabbedNavigationProps,
    walletInputProps,
    emailInputProps,
    referenceInputProps,
    currencySelectionProps,
    shouldShowWalletInput,
    shouldShowEmailInput,
  } = useTemplate2Setup(props)

  let $reference = useRef<TextInput>(null).current

  return (
    <View>
      <LabelInput {...labelInputProps} />
      <TabbedNavigation {...tabbedNavigationProps} />
      <View style={tw`mt-2`}>
        {shouldShowWalletInput && <WalletInput {...walletInputProps} onSubmit={$reference?.focus} />}
        {shouldShowEmailInput && <EmailInput {...emailInputProps} onSubmit={$reference?.focus} />}
      </View>
      <ReferenceInput {...referenceInputProps} reference={(el) => ($reference = el)} />
      <CurrencySelection {...currencySelectionProps} />
    </View>
  )
}
