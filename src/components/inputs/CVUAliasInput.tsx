import { enforceBankNumberFormat } from '../../utils/format'
import i18n from '../../utils/i18n'
import { Input, InputProps } from './Input'

export const CVUAliasInput = ({ onChange, onSubmit, ...props }: InputProps) => (
  <Input
    autoCorrect={false}
    label={i18n('form.account')}
    placeholder={i18n('form.cvuAlias.placeholder')}
    {...props}
    onChange={onChange}
    onEndEditing={onChange ? (cvuAlias: string) => onChange(enforceBankNumberFormat(cvuAlias)) : undefined}
    onSubmit={onSubmit ? (cvuAlias: string) => onSubmit(enforceBankNumberFormat(cvuAlias)) : undefined}
  />
)
