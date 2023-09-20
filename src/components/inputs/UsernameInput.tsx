import { enforceUsernameFormat } from '../../utils/format'
import i18n from '../../utils/i18n'
import { Input, InputProps } from './Input'

export const UsernameInput = ({ onChange, onSubmit, ...props }: InputProps) => (
  <Input
    label={i18n('form.userName')}
    placeholder={i18n('form.userName.placeholder')}
    {...props}
    onChange={onChange}
    onEndEditing={onChange ? (usr: string) => onChange(enforceUsernameFormat(usr)) : undefined}
    onSubmit={onSubmit ? (usr: string) => onSubmit(enforceUsernameFormat(usr)) : undefined}
  />
)
