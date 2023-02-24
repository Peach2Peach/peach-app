import React, { ReactElement } from 'react'
import { enforceUKBankNumberInputFormat } from '../../utils/format/enforceUKBankNumberInput'
import Input, { InputProps } from './Input'

export const UKBankNumberInput = ({ onChange, onSubmit, ...props }: InputProps): ReactElement => (
  <Input
    {...{
      ...props,
      onChange,
      onEndEditing: onChange ? (sortCode: string) => onChange(enforceUKBankNumberInputFormat(sortCode)) : undefined,
      onSubmit: onSubmit ? (sortCode: string) => onSubmit(enforceUKBankNumberInputFormat(sortCode)) : undefined,
    }}
  />
)
