import { enforceBankNumberFormat } from '../../utils/format'
import i18n from '../../utils/i18n'
import { Input, InputProps } from './Input'

export const CVUInput = ({ onChange, onSubmit, ...props }: InputProps) => (
  <Input
    autoCorrect={false}
    label={i18n('form.account')}
    placeholder={i18n('form.cvu.placeholder')}
    {...props}
    onChange={onChange}
    onEndEditing={onChange ? (cvu: string) => onChange(enforceBankNumberFormat(cvu)) : undefined}
    onSubmit={onSubmit ? (cvu: string) => onSubmit(enforceBankNumberFormat(cvu)) : undefined}
  />
)
