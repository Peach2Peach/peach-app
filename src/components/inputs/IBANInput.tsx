import { enforceIBANFormat } from '../../utils/format'
import i18n from '../../utils/i18n'
import { Input, InputProps } from './Input'

export const IBANInput = ({ onChange, onSubmit, ...props }: InputProps) => (
  <Input
    autoCorrect={false}
    placeholder={i18n('form.iban.placeholder')}
    required
    {...props}
    onChange={onChange}
    onEndEditing={onChange ? (iban: string) => onChange(enforceIBANFormat(iban)) : undefined}
    onSubmit={onSubmit ? (iban: string) => onSubmit(enforceIBANFormat(iban)) : undefined}
  />
)
