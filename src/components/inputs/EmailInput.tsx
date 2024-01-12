import { enforceEmailFormat } from '../../utils/format/enforceEmailFormat'
import i18n from '../../utils/i18n'
import { Input, InputProps } from './Input'

export const EmailInput = ({ onChangeText, ...props }: InputProps) => (
  <Input
    placeholder={i18n('form.email.placeholder')}
    {...props}
    keyboardType="email-address"
    onChangeText={onChangeText}
    onEndEditing={onChangeText ? (e) => onChangeText(enforceEmailFormat(e.nativeEvent.text)) : undefined}
  />
)
