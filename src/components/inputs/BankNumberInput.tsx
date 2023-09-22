import { enforceBankNumberFormat } from '../../utils/format'
import i18n from '../../utils/i18n'
import { Input, InputProps } from './Input'

export const BankNumberInput = ({ onChange, onSubmit, ...props }: InputProps) => (
  <Input
    required
    label={i18n('form.account.long')}
    placeholder={i18n('form.account.placeholder')}
    autoCorrect={false}
    {...props}
    onChange={onChange}
    onEndEditing={onChange ? (number: string) => onChange(enforceBankNumberFormat(number)) : undefined}
    onSubmit={onSubmit ? (number: string) => onSubmit(enforceBankNumberFormat(number)) : undefined}
  />
)
