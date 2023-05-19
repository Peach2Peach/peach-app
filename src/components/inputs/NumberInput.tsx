import { enforceNumberFormat } from '../../utils/format'
import Input, { InputProps } from './Input'

export const NumberInput = ({ onChange, onSubmit, ...props }: InputProps) => (
  <Input
    {...{
      ...props,
      keyboardType: 'numeric',
      onChange: onChange ? (number: string) => onChange(enforceNumberFormat(number)) : undefined,
      onSubmit: onSubmit ? (number: string) => onSubmit(enforceNumberFormat(number)) : undefined,
    }}
  />
)
