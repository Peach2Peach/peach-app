import { enforcePhoneFormat } from '../../utils/format'
import i18n from '../../utils/i18n'
import { Input, InputProps } from './Input'

export const PhoneInput = ({ onChange, onSubmit, ...props }: InputProps) => (
  <Input
    label={i18n('form.phoneLong')}
    placeholder={i18n('form.phone.placeholder')}
    autoCorrect={false}
    {...props}
    keyboardType="phone-pad"
    onChange={onChange ? (number: string) => onChange(enforcePhoneFormat(number)) : undefined}
    onSubmit={onSubmit ? (number: string) => onSubmit(enforcePhoneFormat(number)) : undefined}
  />
)
