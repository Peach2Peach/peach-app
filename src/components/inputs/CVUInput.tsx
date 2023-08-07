import { enforceBankNumberFormat } from '../../utils/format'
import i18n from '../../utils/i18n'
import { Input, InputProps } from './Input'

export const CVUInput = ({ onChange, onSubmit, ...props }: InputProps) => (
  <Input
    {...{
      autoCorrect: false,
      label: i18n('form.cvu'),
      placeholder: i18n('form.cvu.placeholder'),
      ...props,
      onChange,
      onEndEditing: onChange ? (cbu: string) => onChange(enforceBankNumberFormat(cbu)) : undefined,
      onSubmit: onSubmit ? (cbu: string) => onSubmit(enforceBankNumberFormat(cbu)) : undefined,
    }}
  />
)
