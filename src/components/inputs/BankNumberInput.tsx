import { ReactElement } from 'react'
import { enforceBankNumberFormat } from '../../utils/format'
import Input, { InputProps } from './Input'

export const BankNumberInput = ({ onChange, onSubmit, ...props }: InputProps): ReactElement => (
  <Input
    {...{
      ...props,
      onChange,
      onEndEditing: onChange ? (number: string) => onChange(enforceBankNumberFormat(number)) : undefined,
      onSubmit: onSubmit ? (number: string) => onSubmit(enforceBankNumberFormat(number)) : undefined,
    }}
  />
)
