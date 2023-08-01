import { useRef } from 'react'
import { TextInput } from 'react-native'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { EmailInput } from '../../EmailInput'
import { LabelInput } from '../../LabelInput'
import { useTemplate11Setup } from './hooks'

export const Template11 = (props: FormProps) => {
  const { labelInputProps, lnurlAddressInputProps } = useTemplate11Setup(props)
  let $lnurlAddressInput = useRef<TextInput>().current

  return (
    <>
      <LabelInput {...labelInputProps} onSubmit={() => $lnurlAddressInput?.focus()} />
      <EmailInput {...lnurlAddressInputProps} reference={(el: any) => ($lnurlAddressInput = el)} />
    </>
  )
}
