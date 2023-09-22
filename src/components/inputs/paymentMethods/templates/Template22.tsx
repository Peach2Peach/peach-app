import { useRef } from 'react'
import { TextInput } from 'react-native'
import i18n from '../../../../utils/i18n'
import { FormProps } from '../../../../views/addPaymentMethod/PaymentMethodForm'
import { Input, InputProps } from '../../Input'
import { LabelInput } from '../../index'
import { useTemplate22Setup } from './hooks'

export const Template22 = (props: FormProps) => {
  let $pixAlias = useRef<TextInput>(null).current

  const { labelInputProps, pixAliasInputProps } = useTemplate22Setup(props)
  return (
    <>
      <LabelInput {...labelInputProps} onSubmit={() => $pixAlias?.focus()} />
      <PixAliasInput {...pixAliasInputProps} reference={(el) => ($pixAlias = el)} />
    </>
  )
}

function PixAliasInput (
  props: InputProps & { onChange: React.Dispatch<React.SetStateAction<string>>; onSubmit: () => void },
) {
  return (
    <Input
      label={i18n('form.pixAlias')}
      placeholder={i18n('form.pixAlias.placeholder')}
      {...props}
      onEndEditing={props.onChange}
    />
  )
}
