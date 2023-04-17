import { ReactElement } from 'react'
import { enforceBICFormat } from '../../utils/format'
import i18n from '../../utils/i18n'
import Input, { InputProps } from './Input'

export const BICInput = ({ onChange, onSubmit, ...props }: InputProps): ReactElement => (
  <Input
    {...{
      autoCorrect: false,
      label: i18n('form.bic'),
      placeholder: i18n('form.bic.placeholder'),
      required: true,
      ...props,
      onChange,
      onEndEditing: onChange ? (bic: string) => onChange(enforceBICFormat(bic)) : undefined,
      onSubmit: onSubmit ? (bic: string) => onSubmit(enforceBICFormat(bic)) : undefined,
    }}
  />
)
