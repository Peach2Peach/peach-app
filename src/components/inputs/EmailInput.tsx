import { enforceEmailFormat } from '../../utils/format'
import i18n from '../../utils/i18n'
import { Input, InputProps } from './Input'

export const EmailInput = ({ onChange, onSubmit, ...props }: InputProps) => (
  <Input
    placeholder={i18n('form.email.placeholder')}
    {...props}
    keyboardType="email-address"
    autoCorrect={false}
    onChange={onChange}
    onEndEditing={onChange ? (email: string) => onChange(enforceEmailFormat(email)) : undefined}
    onSubmit={onSubmit ? (email: string) => onSubmit(enforceEmailFormat(email)) : undefined}
  />
)
