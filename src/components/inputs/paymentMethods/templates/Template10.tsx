import { useRef } from 'react'
import { TextInput } from 'react-native'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { LabelInput } from '../../LabelInput'
import { ReceiveAddressInput } from '../../ReceiveAddressInput'
import { useTemplate10Setup } from './hooks'

export const Template10 = (props: FormProps) => {
  const { labelInputProps, receiveAddressInputProps } = useTemplate10Setup(props)
  let $receiveAddressInput = useRef<TextInput>(null).current

  return (
    <>
      <LabelInput {...labelInputProps} onSubmit={() => $receiveAddressInput?.focus()} />
      <ReceiveAddressInput {...receiveAddressInputProps} reference={(el) => ($receiveAddressInput = el)} />
    </>
  )
}
