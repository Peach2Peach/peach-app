import { enforceSortCodeFormat } from '../../utils/format'
import i18n from '../../utils/i18n'
import { Input, InputProps } from './Input'

export const SortCodeInput = ({ onChange, onSubmit, ...props }: InputProps) => (
  <Input
    required
    label={i18n('form.ukSortCode')}
    placeholder={i18n('form.ukSortCode.placeholder')}
    autoCorrect={false}
    {...props}
    onChange={onChange}
    onEndEditing={onChange ? (sortCode: string) => onChange(enforceSortCodeFormat(sortCode)) : undefined}
    onSubmit={onSubmit ? (sortCode: string) => onSubmit(enforceSortCodeFormat(sortCode)) : undefined}
  />
)
